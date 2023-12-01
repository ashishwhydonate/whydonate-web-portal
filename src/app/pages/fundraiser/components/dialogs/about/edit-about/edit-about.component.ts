/**This component comes into action when registered user clicks edit button on their title of fundraiser
 * To update Fundraiser Name and About */

import { Component, Inject, OnInit } from '@angular/core';
import {
	UntypedFormBuilder,
	UntypedFormControl,
	UntypedFormGroup,
	Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { FundraiserService } from '../../../../services/fundraiser.service';
import { MediaService } from '../../../../services/media.service';
import { AccountService } from 'src/app/pages/account/services/account.service';
type LOCALE = 'nl' | 'en' | 'es' | 'de' | 'fr';

@Component({
	selector: 'app-edit-about',
	templateUrl: './edit-about.component.html',
})
export class EditAboutComponent implements OnInit {
	allLanguages = {
		nl: 'Nederlands',
		en: 'English',
		es: 'Español',
		de: 'Deutsch',
		fr: 'Français',
	};
	originalLocale: LOCALE = 'nl';
	languageIconPath: string =
		'https://res.cloudinary.com/whydonate/image/upload/v1689152641/whydonate-production/platform/svg-icons/';
	isSave = false;
	newAbout: any = { title: '', content: '', imageListOperation: [] };
	titleFormGroup!: UntypedFormGroup;
	quillContentCtrl: UntypedFormControl = new UntypedFormControl();
	mediaList: any;
	mediaResetControl: UntypedFormControl = new UntypedFormControl(false);
	getTitle: any;
	maxLengthCheck: any;
	constructor(
		private _formBuilder: UntypedFormBuilder,
		public _mediaService: MediaService,
		public _fundraiserService: FundraiserService,
		public notificationService: NotificationService,
		public accountService: AccountService,
		@Inject(MAT_DIALOG_DATA) public data: { currentFundraiser: any },
		public dialogRef: MatDialogRef<EditAboutComponent>
	) {}

	ngOnInit(): void {
		this.originalLocale = this.data?.currentFundraiser?.language_code;
		this.titleFormGroup = this._formBuilder.group({
			translationTitle: new UntypedFormControl(
				this.data?.currentFundraiser?.title,
				[
					Validators.minLength(15),
					Validators.maxLength(70),
					Validators.pattern(
						/^[a-zA-Z0-9_\s\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FAC0}-\u{1FAFF}\u{1FB00}-\u{1FBFF}\u{1FC00}-\u{1FCFF}\u{1FD00}-\u{1FDFF}\u{1FE00}-\u{1FEFF}\u{1FF00}-\u{1FFFF}\u{2B05}\u{1F004}]*$/u
					),
				]
			),
		});
		this.mediaList = this._mediaService.getMediaList(
			this.data?.currentFundraiser?.image_list
		);
	}
	onTitleChange(event: any) {
		this.newAbout['title'] = event;
	}

	checkBoolean(event: boolean) {
		this.maxLengthCheck = event;
	}

	discardChanges() {
		this.titleFormGroup
			.get('translationTitle')
			?.reset(this.data?.currentFundraiser?.title);
	}

	saveAboutContentAndMedia() {
		if (this.accountService.checkHeaders()) {
			this.isSave = true;
			let observableSourceList: any[] = [];

			if (this.newAbout?.title) {
				let contentBody = this.getContentBodyObject();
				observableSourceList.push(
					this._fundraiserService.updateFundraiserTitle(contentBody)
				);
			}
			forkJoin(observableSourceList).subscribe(
				(results) => {
					this.isSave = false;
					this.dialogRef.close(true);
				},
				(err: any) => {
					this.notificationService.openNotification(
						$localize`:@@edit_about_errorUpdatingFundraiser_notification:There was an error updating Fundraiser About`,
						'close',
						'error'
					);
					this.isSave = false;
				}
			);
		}
	}

	getContentBodyObject() {
		return {
			slug: this.data?.currentFundraiser?.slug,
			title: this.titleFormGroup.get('translationTitle')?.value,
		};
	}
	escapeHtml(string_with_html: any) {
		/** *.(remove any tags).(remove double space) */
		return string_with_html
			?.replace(/<[^>]*>/g, ' ')
			?.replace(/\s\s+/g, ' ')
			?.trim();
	}
	onNoClick() {
		this.dialogRef.close();
	}
}
