import { Component, Inject, OnInit } from '@angular/core';
import {
	UntypedFormBuilder,
	UntypedFormControl,
	UntypedFormGroup,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { FundraiserService } from '../../../../services/fundraiser.service';
import { MediaService } from '../../../../services/media.service';

type LOCALE = 'nl' | 'en' | 'es' | 'de' | 'fr';
@Component({
	selector: 'app-edit-appeal',
	templateUrl: './edit-appeal.component.html',
})
export class EditAppealComponent implements OnInit {
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
	newAppeal: any = {};
	titleFormGroup!: UntypedFormGroup;
	quillContentCtrl: UntypedFormControl = new UntypedFormControl();
	mediaList: any;
	mediaResetControl: UntypedFormControl = new UntypedFormControl(false);
	maxLengthCheck: any;
	constructor(
		private _formBuilder: UntypedFormBuilder,
		public _mediaService: MediaService,
		public fundraiserService: FundraiserService,
		public notificationService: NotificationService,
		@Inject(MAT_DIALOG_DATA) public data: { currentFundraiser: any },
		public dialogRef: MatDialogRef<EditAppealComponent>
	) {}

	ngOnInit(): void {
		this.originalLocale = this.data?.currentFundraiser?.language_code;
		this.titleFormGroup = this._formBuilder.group({
			translationTitle: [this.data?.currentFundraiser?.title],
		});
		console.log('EditAppealComponent', this.data?.currentFundraiser);
	}
	// }
	checkBoolean(event: boolean) {
		// console.log('Event in Check', event);
		this.maxLengthCheck = event;
	}
	discardChanges() {
		this.titleFormGroup
			.get('translationTitle')
			?.reset(this.data?.currentFundraiser?.title);
		this.mediaResetControl.setValue(true);
		this.newAppeal = {};
	}

	dialogClose() {
		try {
			this.isSave = true;
			let observableSourceList = [];
			let contentBody = this.getContentBodyObject();

			contentBody['title'] = this.titleFormGroup.get('translationTitle')?.value;
			contentBody['slug'] = this.data?.currentFundraiser?.slug;
			observableSourceList.push(
				this.fundraiserService.updateFundraiserTitle(contentBody)
			);
			forkJoin(observableSourceList).subscribe(
				(results) => {
					console.log('results', results);
					console.log(results[0]);
					this.isSave = false;
					this.notificationService.openNotification(
						$localize`:@@edit_appeal_fundraiserAppeal_notification:Fundraiser Appeal is updated`,
						'',
						'success'
					);
					this.dialogRef.close(true);
				},
				(err: any) => {
					this.notificationService.openNotification(
						$localize`:@@edit_appeal_errorUpdatingFundraiser_notification:There was an error updating Fundraiser Appeal`,
						'close',
						'error'
					);
					this.isSave = false;
				}
			);
		} catch (err: any) {
			this.notificationService.openNotification(
				$localize`:@@edit_appeal_errorUpdatingFundraiser_notification:There was an error updating Fundraiser Appeal`,
				'close',
				'error'
			);
			this.isSave = false;
		}
	}

	getContentBodyObject() {
		let body: any = {};
		body['title'] = this.titleFormGroup.get('translationTitle')?.value;
		body['slug'] = this.data?.currentFundraiser?.slug;
		return body;
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
