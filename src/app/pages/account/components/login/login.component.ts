import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { skip } from 'rxjs/operators';
import { UserLogin } from '../../models/user-login-model';
import { AccountService } from '../../services/account.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
/** *Login Component */
export class LoginComponent implements OnInit {
	loginFieldPassword: any;
	loginForm: any;
	user_val: any;
	email: any;
	password: any;
	loginUser!: UserLogin;
	public isLoading: boolean = false;

	constructor(
		private _router: Router,
		private _accountService: AccountService,
		private _notificationService: NotificationService
	) {}
	
	ngOnInit(): void {
		this.loginForm = new UntypedFormGroup({
			email: new UntypedFormControl('', [
				Validators.required,
				Validators.email,
				Validators.pattern(
					'^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'
				),
			]),
			password: new UntypedFormControl('', [Validators.required]),
		});
	}
	/** *Login */

	login() {
		this.isLoading = true;
		this.loginUser = new UserLogin(
			(this.email = this.loginForm?.controls['email'].value.toLowerCase()),
			(this.password = this.loginForm.value.password)
		);
		/** *this.isLoading = false; */
		if (this.loginForm.invalid) {
			this._notificationService.openNotification(
				$localize`:@@account_login_invalidEmail_notification:Invalid E-mail`,
				'',
				'error'
			);
			this.isLoading = false;
		} else {
			/** *this.isLoading = true; */
			this._accountService.login(this.loginUser);
			this._accountService.loggedInUpdate
				.pipe(skip(1)) //skip the default value and wait for actual event
				.subscribe((data: Boolean) => {
					this.isLoading = false;
				});
			/** *this.isLoading = false; */
		}
	}
	/** *Route To Register Component */
	routeToRegistration() {
		this._router.navigate(['account/register']);
	}

	/** *Route To Login Component */
	routeToForgotPassword() {
		this._router.navigate(['account/forgot-password']);
	}
}
