import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { FundraiserService } from '../../../services/fundraiser.service';
import { isPlatformBrowser } from '@angular/common';
@Component({
	selector: 'app-edit-created-by',
	templateUrl: './edit-created-by.component.html',
})
export class EditCreatedByComponent implements OnInit {
	isLoading: boolean = false;
	receivedForm: any;
	isFormValid: boolean = true;
	isBrowser: boolean = false;
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: { currentFundraiser: any },
		public _fundraiserService: FundraiserService,
		public notificationService: NotificationService,
		public fundraiserService: FundraiserService,
		public dialogRef: MatDialogRef<EditCreatedByComponent>,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	ngOnInit(): void {}

	async dialogClose() {
		this.isLoading = true;
		try {
			// console.log('so1', this.receivedForm);
			//Update social media----------------------------------------------------------
			let socialMediaBody = {
				slug: this.data?.currentFundraiser?.slug,
				email: this.receivedForm?.email || '',
				facebook: this.receivedForm?.facebook || '',
				twitter: this.receivedForm?.twitter || '',
				linked_in: this.receivedForm?.linked_in || '',
				instagram: this.receivedForm?.instagram || '',
				website: this.receivedForm?.website || '',
			};
			if (
				this.data?.currentFundraiser?.parent != null &&
				Object.keys(this.data?.currentFundraiser?.parent).length > 0
			) {
				(
					await this.fundraiserService.updateConnectedFundraiserSocials(
						socialMediaBody
					)
				).subscribe(
					(res: any) => {
						this.isLoading = false;
						this.notificationService.openNotification(
							$localize`:@@edit_created_socialMedia_notification:Social media is updated`,
							'',
							'success'
						);
						this.dialogRef.close(this.receivedForm.value);
						if (this.isBrowser) window.location.reload();
					},
					(err: any) => {
						this.notificationService.openNotification(
							$localize`:@@edit_created_errorUpdatingSocialMeda_notification:There was an error updating social media`,
							'close',
							'error'
						);
						this.isLoading = false;
					}
				);
			} else {
				(
					await this.fundraiserService.updateSocialMedia(socialMediaBody)
				).subscribe(
					(res: any) => {
						this.isLoading = false;
						console.log('Socialmedia Updated', res);
						this.notificationService.openNotification(
							$localize`:@@edit_created_socialMedia_notification:Social media is updated`,
							'',
							'success'
						);
						this.dialogRef.close(this.receivedForm.value);
						if (this.isBrowser) window.location.reload();
					},
					(err: any) => {
						this.notificationService.openNotification(
							$localize`:@@edit_created_errorUpdatingSocialMeda_notification:There was an error updating social media`,
							'close',
							'error'
						);
						this.isLoading = false;
					}
				);
			}
		} catch (err: any) {
			this.notificationService.openNotification(
				$localize`:@@edit_created_errorUpdatingBackground_notification:There was an error updating background`,
				'close',
				'error'
			);
			this.isLoading = false;
		}
	}
	receiveForm(form: any) {
		this.receivedForm = form;
		// console.log('SSS', form.email);
	}
	receiveFormValidity(validity: boolean) {
		this.isFormValid = validity;
		// console.log('formRec', validity);
	}
	onCloseClick() {
		this.dialogRef.close();
	}
}
