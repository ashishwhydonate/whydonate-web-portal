import { Component, Inject, OnInit } from '@angular/core';
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
	selector: 'app-translate-appeal',
	templateUrl: './translate-appeal.component.html',
})
export class TranslateAppealComponent implements OnInit {
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
	constructor(
		private _formBuilder: UntypedFormBuilder,
		private notificationService: NotificationService,
		public _fundraiserService: FundraiserService,
		public _accountService: AccountService,
		@Inject(MAT_DIALOG_DATA) public data: { currentFundraiser: any },
		public dialogRef: MatDialogRef<TranslateAppealComponent>
	) {}

	ngOnInit(): void {
		console.log('TranslateAppealComponent', this.data.currentFundraiser);
		this.originalLocale = this.data?.currentFundraiser?.language_code;
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
		// this.originalQuillContent = this.data?.currentFundraiser?.appeal;
		this.translationLocaleArr = this.getTranslatableLocale(this.originalLocale);
		this.initTranslations();

		// store edited titles
		this.titleFormGroup.valueChanges.subscribe((val) => {
			let editedTitle = this.titleFormGroup.get('translationTitle')?.value;
			this.titleFormGroup
				.get(this.selectedLocale)
				?.setValue(editedTitle, { emitEvent: false });
			this.changeAppealContent(val);
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
		this.isDisable = false;
	}
	// /** Remove all saved content */
	discardAllAppealChanges() {
		this.titleFormGroup.reset('');
		let titleTranslation =
			this.titleFormGroup.get(this.selectedLocale)?.value ||
			this.data?.currentFundraiser?.translations?.[
				'title_' + this.selectedLocale
			] ||
			this.data?.currentFundraiser?.title;
		this.titleFormGroup
			.get('translationTitle')
			?.setValue(titleTranslation, { emitEvent: false });

		// this.quillContentCtrl.setValue(this.quillContent);
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
		let titleTranslation =
			this.titleFormGroup.get(selectedLocale)?.value ||
			this.data?.currentFundraiser?.translations?.['title_' + selectedLocale] ||
			this.data?.currentFundraiser?.title;

		this.titleFormGroup
			.get('translationTitle')
			?.setValue(titleTranslation, { emitEvent: false });

		// if edited content already exist for a locale then prefer that
		let editedAppeal = this.newAppeal.find(
			(content) => content[selectedLocale]
		)?.[selectedLocale];

		this.quillContent =
			editedAppeal ||
			this.data.currentFundraiser.translations['content_' + selectedLocale];
	}
	initTranslations() {
		let titleTranslation =
			this.data?.currentFundraiser?.translations?.[
				'title_' + this.translationLocaleArr[0]
			] || this.data?.currentFundraiser?.title;

		this.titleFormGroup
			.get('translationTitle')
			?.setValue(titleTranslation, { emitEvent: false });

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
				content: this.originalTitle,
				target_language: this.selectedLocale,
				source_language: this.originalLocale,
			};
			this.isAutoTranslating = true;
			this._fundraiserService.autoTranslateNew(body).subscribe(
				(response: any) => {
					this.titleFormGroup
						.get('translationTitle')
						?.setValue(response?.data?.translated_text);

					this.titleFormGroup
						.get('translationTitle')
						?.setValue(response?.data?.translated_text, {
							emitEvent: false,
						});
					this.titleFormGroup
						.get(this.selectedLocale)
						?.setValue(response?.data?.translated_text, {
							emitEvent: false,
						});

					// this.quillContentCtrl.setValue(
					// 	response?.data?.translated_text?.about
					// );
					// this.changeAppealContent(response?.data?.translated_text?.about);
					this.isAutoTranslating = false;
				},
				(error: any) => {
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
		this.isLoading = true;
		// get non empty/edited appeal to be pushed
		let editedAppeal = this.newAppeal.filter((appeal: NEW_CONTENT) => {
			return !!appeal[Object.keys(appeal)[0]];
		});
		let observableSourceList: any = [];
		console.log('APPEAL', editedAppeal);
		editedAppeal.map((appeal) => {
			let appealBody: any = {
				title:
					this.titleFormGroup.get(Object.keys(appeal)?.[0])?.value ||
					this?.data?.currentFundraiser?.title,
				slug: this.data?.currentFundraiser?.slug,
				language_code: Object.keys(appeal)?.[0],
				currency_code: this.data?.currentFundraiser?.currency_code,
				is_auto: false,
			};
			console.log('GEGEGEG', appealBody);
			// appealBody['title'] =
			// 	this.titleFormGroup.get(Object.keys(appeal)?.[0])?.value ||
			// 	this?.data?.currentFundraiser?.title;
			// appealBody['description'] = '';
			// appealBody['appeal'] = Object.values(appeal)?.[0];
			// appealBody['content'] = '';
			// appealBody['slug'] = this.data?.currentFundraiser?.slug;
			// appealBody['language_code'] = Object.keys(appeal)?.[0];
			// appealBody['is_auto'] = false;
			// appealBody['currency_code'] = this.data?.currentFundraiser?.currency_code;
			// appealBody['organization'] = this._accountService.getLocaleId();
			// appealBody['updated_at'] = new Date().getTime();
			// appealBody['created_at'] = this?.data?.currentFundraiser?.created_at;
			console.log('APPEALBODY', appealBody);
			observableSourceList.push(
				this._fundraiserService.updateFundraiserTitleTranslation(appealBody)
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
		console.log(editedAppeal);
	}
	onCloseClick() {
		this.dialogRef.close();
	}
}
