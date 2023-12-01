/* This component comes into action after clicking forgot password in log in screen */
import { Component, OnInit } from '@angular/core';
import {
	UntypedFormControl,
	UntypedFormGroup,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { APIService } from 'src/app/global/services/api.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AccountService } from '../../services/account.service';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss'],
})
/** *Forgot Password Component */
export class ForgotPasswordComponent implements OnInit {
	forgotForm: any;

	constructor(
		private _router: Router,
		private service: AccountService,
		private _apiService: APIService,
		private notificationService: NotificationService
	) {}
	public isLoading: boolean | undefined;

	ngOnInit() {
		this.forgotForm = new UntypedFormGroup({
			email: new UntypedFormControl('', [
				Validators.required,
				Validators.email,
				Validators.pattern(
					'^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'
				),
			]),
		});
	}
	/** *Forgot Password */

	forgotPassword() {
		let obj = {
			email: this.forgotForm.get('email')?.value,
		};

		if (this.forgotForm.invalid) {
			alert('Invalid E-mail');
			return;
		}

		this.isLoading = true;
		this.service.forgotPassword(obj).subscribe((res: any) => {
			if (res.data.invalid_user == true) {
				this.notificationService.openNotification(
					$localize`:@@account_forget_password_emailDoesnot_notification:Email doesn't exist`,
					'',
					'error'
				);
			} else {
				this.notificationService.openNotification(
					$localize`:@@account_forget_password_linkSend_notification:Link sent to registered email address`,
					'',
					'success'
				);
			}
			this.isLoading = false;
		}, this._apiService.handleError);
	}
	/** *Route To Register Component */

	routeToRegister() {
		this._router.navigate(['account/register']);
	}
	/** *Route To Login Component */

	routeToLogin() {
		this._router.navigate(['account']);
	}
}
