import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { FundraiserService } from '../../../../services/fundraiser.service';
import { isPlatformBrowser } from '@angular/common';

type LOCALE = 'nl' | 'en' | 'es' | 'de' | 'fr';
type NEW_CONTENT = {
	[key in LOCALE as string]?: string;
};
@Component({
	selector: 'app-translate-updates',
	templateUrl: './translate-updates.component.html',
})
export class TranslateUpdatesComponent implements OnInit {
	allLocales: LOCALE[] = ['nl', 'en', 'es', 'de', 'fr'];
	allLanguages = {
		nl: 'Nederlands',
		en: 'English',
		es: 'Español',
		de: 'Deutsch',
		fr: 'Français',
	};
	originalLocale: LOCALE = 'nl';
	selectedLocale: LOCALE = 'en';
	languageIconPath: string =
		'https://res.cloudinary.com/whydonate/image/upload/v1689152641/whydonate-production/platform/svg-icons/';
	translationLocaleArr: LOCALE[] = [];

	originalQuillContent!: any;
	quillContentCtrl: UntypedFormControl = new UntypedFormControl();
	quillContent!: any;
	isLoading: boolean = false;
	isDisable: boolean = true;
	isAutoTranslating: boolean = false;
	isBrowser: boolean = false;
	newContent: NEW_CONTENT[] = [
		{ nl: '' },
		{ en: '' },
		{ es: '' },
		{ de: '' },
		{ fr: '' },
	];
	allTextCheck: boolean = false;
	constructor(
		private notificationService: NotificationService,
		public _fundraiserService: FundraiserService,
		@Inject(MAT_DIALOG_DATA)
		public data: {
			slug: any;
			update: any;
			locale: any;
		},
		public dialogRef: MatDialogRef<TranslateUpdatesComponent>,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	ngOnInit(): void {
		console.log('TranslateUpdatesComponent', this.data);
		this.originalLocale = this.data?.locale;
		console.log('ORGINALE', this.data);
		this.originalQuillContent = this.data?.update?.content;
		console.log('ORIGINAL', this.originalQuillContent);
		this.translationLocaleArr = this.getTranslatableLocale(this.originalLocale);
		this.setQuillContent();
	}
	/** when content is edited of any locale, it is updated to newContent */
	changeUpdateContent(event: any) {
		this.newContent.map((content) => {
			if (content[this.selectedLocale] !== undefined) {
				content[this.selectedLocale] = event;
			}
			return content;
		});
		this.isDisable = false;
	}
	/** Remove all saved content */
	discardAllContentChanges() {
		this.quillContentCtrl.setValue(this.quillContent);

		this.newContent = this.newContent.map((content) => {
			return Object.assign({ [Object.keys(content)[0]]: '' });
		});
		this.changeQuillContent(this.selectedLocale);
		this.isDisable = true;
	}
	changeLanguage(language: string) {
		switch (true) {
			case language.includes('nl'):
				this.selectedLocale = 'nl';
				this.changeQuillContent(this.selectedLocale);
				break;
			case language.includes('es'):
				this.selectedLocale = 'es';
				this.changeQuillContent(this.selectedLocale);
				break;
			case language.includes('de'):
				this.selectedLocale = 'de';
				this.changeQuillContent(this.selectedLocale);
				break;
			case language.includes('fr'):
				this.selectedLocale = 'fr';
				this.changeQuillContent(this.selectedLocale);
				break;
			default:
				this.selectedLocale = 'en';
				this.changeQuillContent(this.selectedLocale);
		}
	}
	changeQuillContent(selectedLocale: LOCALE) {
		// if edited content already exist for a locale then prefer that
		let editedContent = this.newContent.find(
			(content) => content[selectedLocale]
		)?.[selectedLocale];

		this.quillContent =
			editedContent ||
			this.data?.update?.translation['content_' + selectedLocale];
	}
	setQuillContent() {
		this.quillContent =
			this.data?.update?.translation['content_' + this.translationLocaleArr[0]];

		console.log('QUIII', this.quillContent);
		this.selectedLocale = this.translationLocaleArr[0];
	}
	getOriginalLocale() {
		return this.originalLocale;
	}
	getTranslatableLocale(originalLocale: LOCALE): LOCALE[] {
		return this.allLocales.filter((locale) => locale !== originalLocale);
	}
	getLanguage(locale: LOCALE) {
		return this.allLanguages[locale];
	}

	autoTranslate() {
		if (this.selectedLocale) {
			let body = {
				content: this.originalQuillContent,
				target_language: this.selectedLocale,
				source_language: this.originalLocale,
			};
			this.isAutoTranslating = true;
			this._fundraiserService.autoTranslateNew(body).subscribe(
				(response: any) => {
					this.quillContentCtrl.setValue(response?.data?.translated_text);
					this.changeUpdateContent(response?.data?.translated_text);
					this.isAutoTranslating = false;
				},
				(error) => {
					this.notificationService.openNotification(
						$localize`:@@translate_about_autoTranslating_notification:There was an error Auto Translating Fundraiser About`,
						'',
						'error'
					);
					this.isAutoTranslating = false;
				}
			);
		}
	}
	allCheck(event: boolean) {
		this.allTextCheck = event;
		// console.log("YAYYY", event)
	}
	saveTranslations() {
		this.isLoading = true;
		let editedContent = this.newContent.filter((content: NEW_CONTENT) => {
			return !!content[Object.keys(content)[0]];
		});
		let observableSourceList: any = [];

		editedContent.map((content) => {
			let contentBody: any = {};
			contentBody['content'] = Object.values(content)?.[0];
			contentBody['update_id'] = this.data?.update?.id;
			contentBody['language_code'] = Object.keys(content)?.[0];
			contentBody['is_auto'] = false;
			contentBody['slug'] = this.data?.slug;
			observableSourceList.push(
				this._fundraiserService.saveUpdates(contentBody)
			);
		});
		//length of results/response will be same as length of editedContent array, i.e if editedContent.length is 2 then results[0] and results[1]
		forkJoin(observableSourceList).subscribe(
			(results) => {
				// console.log('results', results);
				this.isLoading = false;
				this.dialogRef.close(true);
				this.notificationService.openNotification(
					$localize`:@@fundraiser_update_edit_updateRequired_notification:Fundraiser Update is translated`,
					'',
					'success'
				);
				if (this.isBrowser) window.location.reload();
			},
			(err: any) => {
				this.notificationService.openNotification(
					$localize`:@@translate_appeal_errorTranslatingFundraiser_notification:There was an error Translating Fundraiser Update`,
					'close',
					'error'
				);
				this.isLoading = false;
			}
		);
		console.log(editedContent);
	}
	onCloseClick() {
		this.dialogRef.close();
	}
}
