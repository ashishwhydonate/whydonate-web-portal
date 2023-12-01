import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { FundraiserService } from '../../../../services/fundraiser.service';
import {
	UntypedFormBuilder,
	UntypedFormControl,
	UntypedFormGroup,
} from '@angular/forms';
import { AccountService } from 'src/app/pages/account/services/account.service';

type LOCALE = 'nl' | 'en' | 'es' | 'de' | 'fr';
type NEW_CONTENT = {
	[key in LOCALE as string]?: string;
};

@Component({
	selector: 'app-translate-about-description',
	templateUrl: './translate-about-description.component.html',
})
export class TranslateAboutDescriptionComponent implements OnInit {
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
	titleTranslation!: any;
	quillContent!: any;
	originalTitle!: any;
	titleFormGroup!: UntypedFormGroup;
	quillContentCtrl: UntypedFormControl = new UntypedFormControl();

	originalQuillContent!: any;
	originalDescription!: any;
	isLoading: boolean = false;
	isDisable: boolean = true;
	isDescriptionEmpty: boolean = true;
	isAutoTranslating: boolean = false;
	newContent: NEW_CONTENT[] = [
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
		public accountService: AccountService,
		public fundraiserService: FundraiserService,
		@Inject(MAT_DIALOG_DATA)
		public data: { currentFundraiser: any; currentFundraiserImage: any },
		public dialogRef: MatDialogRef<TranslateAboutDescriptionComponent>
	) {}

	ngOnInit(): void {
		console.log('currentFundraiser', this.data.currentFundraiser);
		this.originalLocale = this.data?.currentFundraiserImage?.language_code;

		this.originalTitle =
			this.data?.currentFundraiser?.translations?.[
				`title_${this.originalLocale}`
			] || this.data?.currentFundraiser?.title;

		this.titleFormGroup = this._formBuilder.group({
			translationTitle: [''],
			en: [''],
			nl: [''],
			es: [''],
			de: [''],
			fr: [''],
		});

		this.originalQuillContent =
			this.data?.currentFundraiser?.translations?.[
				`content_${this.originalLocale}`
			] || this.data?.currentFundraiser?.content;

		if (this.originalQuillContent != null) {
			this.isDescriptionEmpty = false;
		}

		this.originalDescription =
			this.data?.currentFundraiser?.translations?.[
				`content_${this.originalLocale}`
			] || this.data?.currentFundraiser?.content;

		this.translationLocaleArr = this.getTranslatableLocale(this.originalLocale);

		this.initTranslations();

		// store edited titles
		this.titleFormGroup.valueChanges.subscribe((val) => {
			// let editedTitle = this.titleFormGroup.get('translationTitle')?.value;
			// this.titleFormGroup
			// 	.get(this.selectedLocale)
			// 	?.setValue(editedTitle, { emitEvent: false });

			this.changeAboutContent(this.quillContent);
			console.log(this.titleFormGroup.value);
		});
	}
	initTranslations() {
		// let titleTranslation =
		// 	this.data?.currentFundraiser?.translations?.[
		// 		'title_' + this.translationLocaleArr[0]
		// 	] || this.data?.currentFundraiser?.title;

		// this.titleFormGroup
		// 	.get('translationTitle')
		// 	?.setValue(titleTranslation, { emitEvent: false });

		this.quillContent =
			this.data?.currentFundraiser?.translations?.[
				'content_' + this.translationLocaleArr[0]
			] || this.data?.currentFundraiser?.content;

		this.selectedLocale = this.translationLocaleArr[0];
	}
	changeLanguage(language: string) {
		switch (true) {
			case language.includes('nl'):
				this.selectedLocale = 'nl';
				this.changeTranslation(this.selectedLocale);
				break;
			case language.includes('es'):
				this.selectedLocale = 'es';
				this.changeTranslation(this.selectedLocale);
				break;
			case language.includes('de'):
				this.selectedLocale = 'de';
				this.changeTranslation(this.selectedLocale);
				break;
			case language.includes('fr'):
				this.selectedLocale = 'fr';
				this.changeTranslation(this.selectedLocale);
				break;
			default:
				this.selectedLocale = 'en';
				this.changeTranslation(this.selectedLocale);
		}
	}
	changeTranslation(selectedLocale: LOCALE) {
		// let titleTranslation =
		// 	this.titleFormGroup.get(selectedLocale)?.value ||
		// 	this.data?.currentFundraiser?.translations?.['title_' + selectedLocale] ||
		// 	this.data?.currentFundraiser?.title;

		// this.titleFormGroup
		// 	.get('translationTitle')
		// 	?.setValue(titleTranslation, { emitEvent: false });

		// if edited content already exist for a locale then prefer that
		let editedContent = this.newContent.find(
			(content) => content[selectedLocale]
		)?.[selectedLocale];

		this.quillContent =
			editedContent ||
			this.data?.currentFundraiser?.translations?.[
				'content_' + selectedLocale
			] ||
			this.data?.currentFundraiser?.content;
	}
	/** when content is edited of any locale, it is updated to newContent */
	changeAboutContent(event: any) {
		this.newContent.map((content) => {
			if (content[this.selectedLocale] !== undefined) {
				content[this.selectedLocale] = event;
			}
			return content;
		});
		this.isDisable = false;

		console.log('newContent', this.newContent);
	}
	/** Remove all saved content */
	discardAllAboutChanges() {
		this.titleFormGroup.reset('');
		// let titleTranslation =
		// 	this.titleFormGroup.get(this.selectedLocale)?.value ||
		// 	this.data?.currentFundraiser?.translations?.[
		// 		'title_' + this.selectedLocale
		// 	] ||
		// 	this.data?.currentFundraiser?.title;
		// console.log(titleTranslation);
		// this.titleFormGroup
		// 	.get('translationTitle')
		// 	?.setValue(titleTranslation, { emitEvent: false });

		this.quillContentCtrl.setValue(this.quillContent);

		this.newContent = this.newContent.map((content) => {
			return Object.assign({ [Object.keys(content)[0]]: '' });
		});
		console.log('this.newContent', this.newContent);

		this.isDisable = true;
		// this.changeDetectorRef.detectChanges();
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
	allCheck(event: boolean) {
		this.allTextCheck = event;
		// console.log("YAYYY", event)
	}
	autoTranslate() {
		console.log('about', this.originalQuillContent);
		console.log('description', this.originalDescription);
		if (this.selectedLocale) {
			let body = {
				content: this.originalDescription,
				target_language: this.selectedLocale,
				source_language: this.originalLocale,
			};
			this.isAutoTranslating = true;
			this.fundraiserService.autoTranslateNew(body).subscribe(
				(response: any) => {
					// this.titleFormGroup
					// 	.get('translationTitle')
					// 	?.setValue(response?.data?.translated_text?.title);

					console.log(response);
					console.log(this.titleFormGroup);
					// this.titleFormGroup
					// 	.get('translationTitle')
					// 	?.setValue(response?.data?.translated_text?.title, {
					// 		emitEvent: false,
					// 	});
					// this.titleFormGroup
					// 	.get(this.selectedLocale)
					// 	?.setValue(response?.data?.translated_text?.title, {
					// 		emitEvent: false,
					// 	});

					this.quillContentCtrl.setValue(response?.data?.translated_text);
					this.changeAboutContent(response?.data?.translated_text);

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
		if (this.accountService.checkHeaders()) {
			this.isLoading = true;
			let editedContent = this.newContent.filter((content: NEW_CONTENT) => {
				return !!content[Object.keys(content)[0]];
			});
			let observableSourceList: any = [];

			editedContent.map((content) => {
				let contentBody: any = {
					description: this.escapeHtml(Object.values(content)?.[0]),
					content: Object.values(content)?.[0],
					appeal: '',
					slug: this.data?.currentFundraiserImage?.slug,
					language_code: Object.keys(content)?.[0],
					currency_code: this.data?.currentFundraiserImage?.currency_code,
					is_auto: false,
				};
				observableSourceList.push(
					this.fundraiserService.updateFundraiserDescriptionTranslation(
						contentBody
					)
				);
			});
			//length of results/response will be same as length of editedContent array, i.e if editedContent.length is 2 then results[0] and results[1]
			forkJoin(observableSourceList).subscribe(
				(results) => {
					// console.log('results', results);
					this.isLoading = false;
					this.dialogRef.close(true);
				},
				(error) => {
					this.notificationService.openNotification(
						$localize`:@@translate_about_errorTranslating:There was an error Translating Fundraiser About`,
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
