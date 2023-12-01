import { Component, Inject } from '@angular/core';
import {
	UntypedFormGroup,
	UntypedFormBuilder,
	UntypedFormControl,
	Validators,
	AsyncValidatorFn,
	AbstractControl,
	ValidationErrors,
} from '@angular/forms';
import {
	MatLegacyDialog as MatDialog,
	MatLegacyDialogRef as MatDialogRef,
	MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ProfileService } from '../../../../services/profile.service';
import { Observable, of } from 'rxjs';

// component ts code for reset password dialog
@Component({
	selector: 'reset-password-dialog',
	templateUrl: './reset-password-dialog.html',
})
/** *Password Dialog */
export class ResetPasswordDialog {
	resetPasswordForm: UntypedFormGroup;
	constructor(
		public dialogRef: MatDialogRef<ResetPasswordDialog>,
		public _dialogRef: MatDialogRef<ResetPasswordDialog>,
		private _formBuilder: UntypedFormBuilder,
		public notificationService: NotificationService,
		public _accountService: AccountService,
		@Inject(MAT_DIALOG_DATA) public profileData: any
	) {
		_dialogRef.disableClose = false;

		this.resetPasswordForm = this._formBuilder.group({
			currentPassword: new UntypedFormControl('', [Validators.required]),
			password: new UntypedFormControl('', [
				Validators.required,
				Validators.minLength(8),
				Validators.maxLength(100),
				Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$'),
			]),
			confirm_password: new UntypedFormControl(
				'',
				[Validators.required],
				[this.passwordsMustMatch()]
			),
		});
	}

	/**
	 * Function to check if passwords match
	 */

	passwordsMustMatch(): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			const password = this.resetPasswordForm.get('password')?.value;
			const confirmPassword = control.value;

			if (password === confirmPassword) {
				return of(null); // Return null if passwords match
			} else {
				return of({ passwordMismatch: true }); // Return error object if passwords do not match
			}
		};
	}
	/** *Password getErrorMessage */
	getPasswordErrorMessage() {
		return this.resetPasswordForm?.controls['password'].hasError('required')
			? 'Password is required'
			: this.resetPasswordForm?.controls['password'].hasError('pattern')
			? 'Minimum 8 digit. Must contains 1 Uppercase, 1 number & 0 special characters'
			: '';
	}
	/**
	 * update password
	 */
	updatePassword() {
		// Return if the form is invalid
		// if (this.resetPasswordForm.invalid) {
		// 	return;
		// }
		// Disable the form
		this.resetPasswordForm.disable();

		// get the value from the from input
		const currentPassword =
			this.resetPasswordForm?.controls.currentPassword.value;
		const password = this.resetPasswordForm?.controls.password.value;
		const confirm_password =
			this.resetPasswordForm?.controls.confirm_password.value;
		// verify password payload
		const payload = {
			password: password,
			currentPassword: currentPassword,
			email: this.profileData?.profile?.email,
		};
		// call the bank service to verify password
		this._accountService.resetPassword(payload).subscribe(
			(response: any) => {
				// if(response){

				// }
				if (response.errors.code) {
					this.notificationService.openNotification(
						$localize`:@@account_errorUnable_notification:${response.errors.message}, Please try Again`,
						'Close',
						'error'
					);
				} else {
					this.notificationService.openNotification(
						$localize`:@@account_password:Password updated`,
						'Close',
						'success'
					);
				}

				this._dialogRef.close({
					event: 'Close',
				});
				// Re-enable the form
				this.resetPasswordForm.enable();
			},
			(error) => {
				this.notificationService.openNotification(
					$localize`:@@account_errorUnable_notification:Error unable to update password`,
					'Close',
					'error'
				);

				this._dialogRef.close({
					event: 'Close',
				});

				// Re-enable the form
				this.resetPasswordForm.enable();
			}
		);
	}
	onCloseClick() {
		this.dialogRef.close();
	}
}
