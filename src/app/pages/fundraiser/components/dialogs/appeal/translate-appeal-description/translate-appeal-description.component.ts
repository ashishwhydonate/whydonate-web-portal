import { Component, Inject, OnInit } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { forkJoin } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { FundraiserService } from '../../../../services/fundraiser.service';
import { AccountService } from 'src/app/pages/account/services/account.service';
import {
	UntypedFormBuilder,
	UntypedFormControl,
	UntypedFormGroup,
} from '@angular/forms';

type LOCALE = 'nl' | 'en' | 'es' | 'de' | 'fr';
type NEW_CONTENT = {
	[key in LOCALE as string]?: string;
};

@Component({
	selector: 'app-translate-appeal-description',
	templateUrl: './translate-appeal-description.component.html',
})
export class TranslateAppealDescriptionComponent implements OnInit {
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

	originalTitle!: any;
	titleFormGroup!: UntypedFormGroup;
	originalQuillContent!: any;
	quillContentCtrl: UntypedFormControl = new UntypedFormControl();
	quillContent!: any;
	isLoading: boolean = false;
	isDisable: boolean = true;
	isAutoTranslating: boolean = false;
	newAppeal: NEW_CONTENT[] = [
		{ nl: '' },
		{ en: '' },
		{ es: '' },
		{ de: '' },
		{ fr: '' },
	];
	allTextCheck: boolean = false;
	constructor(
		private _formBuilder: UntypedFormBuilder,
		private notificationService: NotificationService,
		public _fundraiserService: FundraiserService,
		public _accountService: AccountService,
		@Inject(MAT_DIALOG_DATA)
		public data: { currentFundraiser: any; currentFundraiserImage: any },
		public dialogRef: MatDialogRef<TranslateAppealDescriptionComponent>
	) {}

	ngOnInit(): void {
		console.log(
			'TranslateAppealDescriptionComponent',
			this.data.currentFundraiser
		);
		this.originalLocale = this.data?.currentFundraiserImage?.language_code;

		this.titleFormGroup = this._formBuilder.group({
			translationTitle: [''],
			en: [''],
			nl: [''],
			es: [''],
			de: [''],
			fr: [''],
		});
		this.originalQuillContent = this.data?.currentFundraiser?.content;
		this.translationLocaleArr = this.getTranslatableLocale(this.originalLocale);
		this.initTranslations();

		// store edited titles
		this.titleFormGroup.valueChanges.subscribe((val) => {
			this.changeAppealContent(this.quillContent);
			console.log(this.titleFormGroup.value);
		});
	}
	/** when content is edited of any locale, it is updated to newAppeal */
	changeAppealContent(event: any) {
		this.newAppeal.map((appeal) => {
			if (appeal[this.selectedLocale] !== undefined) {
				appeal[this.selectedLocale] = event;
			}
			return appeal;
		});
		console.log('changeAppealContent', this.newAppeal);
		this.isDisable = false;
	}
	allCheck(event: boolean) {
		this.allTextCheck = event;
	}
	/** Remove all saved content */
	discardAllAppealChanges() {
		this.titleFormGroup.reset('');

		this.quillContentCtrl.setValue(this.quillContent);
		this.newAppeal = this.newAppeal.map((appeal) => {
			return Object.assign({ [Object.keys(appeal)[0]]: '' });
		});
		// this.changeQuillAppeal(this.selectedLocale);
		this.isDisable = true;
	}
	changeLanguage(language: string) {
		switch (true) {
			case language.includes('nl'):
				this.selectedLocale = 'nl';
				this.changeQuillAppeal(this.selectedLocale);
				break;
			case language.includes('es'):
				this.selectedLocale = 'es';
				this.changeQuillAppeal(this.selectedLocale);
				break;
			case language.includes('de'):
				this.selectedLocale = 'de';
				this.changeQuillAppeal(this.selectedLocale);
				break;
			case language.includes('fr'):
				this.selectedLocale = 'fr';
				this.changeQuillAppeal(this.selectedLocale);
				break;
			default:
				this.selectedLocale = 'en';
				this.changeQuillAppeal(this.selectedLocale);
		}
	}
	changeQuillAppeal(selectedLocale: LOCALE) {
		let editedAppeal = this.newAppeal.find(
			(content) => content[selectedLocale]
		)?.[selectedLocale];

		this.quillContent =
			editedAppeal ||
			this.data.currentFundraiser.translations['content_' + selectedLocale];
	}
	initTranslations() {
		this.quillContent =
			this.data?.currentFundraiser?.translations[
				'content_' + this.translationLocaleArr[0]
			];
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
					this.changeAppealContent(response?.data?.translated_text);
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
	saveTranslations() {
		if (this._accountService.checkHeaders()) {
			this.isLoading = true;
			// get non empty/edited appeal to be pushed
			let editedAppeal = this.newAppeal.filter((appeal: NEW_CONTENT) => {
				return !!appeal[Object.keys(appeal)[0]];
			});
			let observableSourceList: any = [];

			editedAppeal.map((appeal) => {
				// let appealBody: any = {};
				let appealBody: any = {
					description: '',
					content: Object.values(appeal)?.[0],
					appeal: this.escapeHtml(Object.values(appeal)?.[0]),
					slug: this.data?.currentFundraiserImage?.slug,
					language_code: Object.keys(appeal)?.[0],
					currency_code: this.data?.currentFundraiserImage?.currency_code,
					is_auto: false,
				};

				observableSourceList.push(
					this._fundraiserService.updateFundraiserAppealDescriptionTranslation(
						appealBody
					)
				);
			});
			//length of results/response will be same as length of editedAppeal array, i.e if editedAppeal.length is 2 then results[0] and results[1]
			forkJoin(observableSourceList).subscribe(
				(results) => {
					// console.log('results', results);
					this.isLoading = false;
					this.dialogRef.close(true);
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
		}
	}

	escapeHtml(string_with_html: any) {
		/** *.(remove any tags).(remove double space) */
		return string_with_html
			?.replace(/<[^>]*>/g, ' ')
			?.replace(/\s\s+/g, ' ')
			?.trim();
	}
	onCloseClick() {
		this.dialogRef.close();
	}
}
