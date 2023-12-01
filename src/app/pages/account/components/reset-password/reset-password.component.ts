/*Upon clicking "Reset Password" link recieved in registered email, user is redirected to this component*/

import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
	UntypedFormControl,
	UntypedFormGroup,
	Validators,
	AsyncValidatorFn,
	AbstractControl,
	ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/app/global/services/api.service';
import { UserResetPassword } from '../../models/user-reset-password';
import { AccountService } from '../../services/account.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss'],
})
/** *Reset Password Component */
export class ResetPasswordComponent implements OnInit {
	resetPasswordForm!: UntypedFormGroup;
	token: any;
	email: any;
	checkTokenValidInProgress!: boolean;
	isTokenExpired = false;
	isTokenValid = false;
	isBrowser: boolean = false;

	constructor(
		private _accountService: AccountService,
		private _apiService: APIService,
		private _router: Router,
		private _route: ActivatedRoute,
		public _notificationService: NotificationService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}
	public isLoading!: boolean;

	ngOnInit(): void {
		this.resetPasswordForm = new UntypedFormGroup({
			password: new UntypedFormControl('', [
				Validators.required,
				Validators.minLength(8),
				Validators.maxLength(100),
				Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$'),
			]),
			confirmPassword: new UntypedFormControl(
				'',
				[Validators.required],
				[this.passwordsShouldMatchValidator()]
			),
		});

		this._route.queryParams.subscribe((query) => {
			this.token = query['t'];
			this.email = query['u'];

			if (!this.token) {
				this._router.navigate(['/']);
			} else {
				this.tokenValidationCheck();
			}
		});
	}
	/** *Token Validation Check */

	tokenValidationCheck() {
		this.checkTokenValidInProgress = true;
		this._accountService
			.isResetPasswordTokenValid(this.email, this.token)
			.subscribe(
				(result: any) => {
					try {
						this.checkTokenValidInProgress = false;
						if (!result.data.token_verified) {
							this._notificationService.openNotification(
								$localize`:@@thank_donar_messageSuccessfullt_notification:Verification failed`,
								'',
								'success'
							);
							this._router.navigate(['/']);
						}
					} catch (e) {}
				},
				() => {
					this.checkTokenValidInProgress = false;
				}
			);
	}
	/** *Reset Password  */

	resetPasswordMethod(resetPasswordForm: any) {
		if (this.resetPasswordForm.invalid) {
			if (this.isBrowser) window.alert('Invalid password');
			return;
		}

		let reset_password = resetPasswordForm.value;
		reset_password['token'] = this.token;
		reset_password['email'] = this.email;
		// this.isLoading = true;
		this._accountService.resetPassword(reset_password).subscribe((res: any) => {
			if (res.data.password_updated == true) {
				this._notificationService.openNotification(
					$localize`:@@thank_donar_messageSuccessfullt_notification:Password Changed`,
					'',
					'success'
				);
				this._router.navigate(['account/login']);
			}
			this.isLoading = false;
		}, this._apiService.handleError);
	}

	/** *Password getErrorMessage */
	getPasswordErrorMessage() {
		return this.resetPasswordForm?.controls['password'].hasError('required')
			? 'Password is required'
			: this.resetPasswordForm?.controls['password'].hasError('pattern')
			? 'Minimum 8 digit. Must contains 1 Uppercase, 1 number & 0 special characters'
			: '';
	}

	passwordsShouldMatchValidator(): AsyncValidatorFn {
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
}
