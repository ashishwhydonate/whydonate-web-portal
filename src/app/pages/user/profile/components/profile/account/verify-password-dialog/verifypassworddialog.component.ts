import { Component, Inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ProfileService } from '../../../../services/profile.service';
// component ts code for reset verify passord dialog
@Component({
	selector: 'verify-password-dialog',
	templateUrl: './verify-password-dialog.html',
})
/** *Verify Password Dialog */
export class VerifyPasswordDialog {
	verifyPasswordForm: UntypedFormGroup;

	constructor(
		public dialogRef: MatDialogRef<VerifyPasswordDialog>,
		public _verifyPasswordDialogRef: MatDialogRef<VerifyPasswordDialog>,
		private _formBuilder: UntypedFormBuilder,
		private _profileService: ProfileService,
		public notificationService: NotificationService,
		@Inject(MAT_DIALOG_DATA) public inputedDetails: any
	) {
		this.verifyPasswordForm = this._formBuilder.group({
			password: ['', Validators.required],
		});
	}

	/**
	 * verify password
	 */
	verifyPassword() {
		// Return if the form is invalid
		if (this.verifyPasswordForm.invalid) {
			return;
		}

		// Disable the form
		this.verifyPasswordForm.disable();

		// get the value from the from input
		const password = this.verifyPasswordForm?.controls.password.value;

		// verify password payload
		const payload = {
			email: this.inputedDetails.email,
			password: password,
		};

		/** *call the bank service to verify password */
		this._profileService.verifyPassword(payload).subscribe(
			(response) => {
				// Call the this to update the bank details

				// Close dialog once successful and send response to the parent
				// to triger profile update method (this.updateProfile())
				this._verifyPasswordDialogRef.close({
					event: 'Close',
					passwordVerified: true,
					response: response,
					password: payload.password,
				});

				// Re-enable the form
				this.verifyPasswordForm.enable();
			},
			(error) => {
				this.notificationService.openNotification(
					$localize`:@@account_notValid_notification:Your password is not valid`,
					'Close',
					'error'
				);

				// Re-enable the form
				this.verifyPasswordForm.enable();
			}
		);
	}

	/**
	 * update bank details
	 */
	_updateBankDetails(payload: any) {
		this._profileService.put('account/profile/', {}).subscribe(
			(data) => {
				// Close dialog once the details is updated with a success massage
				this._verifyPasswordDialogRef.close({ event: 'Cancel' });

				this.notificationService.openNotification(
					$localize`:@@account_bankUpdated_notification:Bank details updated`,
					'Close',
					'success'
				);
			},
			(error) => {
				this.notificationService.openNotification(
					$localize`:@@account_unableUpdating_notification:Unable to updating your details`,
					'Close',
					'error'
				);
			}
		);
	}
	onCloseClick(){
		this.dialogRef.close();
	}
}
