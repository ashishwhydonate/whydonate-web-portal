import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { JWT } from 'src/app/global/models/jwt';
import { User } from 'src/app/global/models/user';
import { APIService } from 'src/app/global/services/api.service';
import { UserRegistration } from '../models/user-registration-model';
import { UserLogin } from '../models/user-login-model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserResetPassword } from '../models/user-reset-password';
import { Tools } from 'src/utilities/tools';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class AccountService {
	isBrowser: boolean = false;
	ACCOUNT_API_V2 = environment.ACCOUNT_API_V2;
	isLoggedIn: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
	public loggedInUpdate = this.isLoggedIn.asObservable();

	/*
	 * DESCRIPTION: This class depends upon below PARAM
	 * PARAM: _apiService
	 * PARAM: _router
	 */
	constructor(
		private _apiService: APIService,
		private _router: Router,
		private notificationService: NotificationService,
		public HttpClient: HttpClient,
		@Inject(LOCALE_ID) public locale: string,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	/**
	 * Function to login
	 * @param email
	 * @param password
	 */
	login(userLoginDetails: UserLogin) {
		/** *TO DO - This is a temporary v2 URL - This will change in future */

		let endPointUrl = this.ACCOUNT_API_V2 + 'account/user/login/';

		let body = userLoginDetails;
		this._apiService.tempPost(endPointUrl, body).subscribe(
			(response) => {
				//If email is not verified, route the user to verification screen
				if (response.errors.hasOwnProperty('code')) {
					this.notificationService.openNotification(
						$localize`:@@account_login_incorrectCredientials_error:Error: Incorrect Email & Password`,
						'',
						'error'
					);
					this._router.navigate(['account/']);
					this.setIsUserLoggedIn(false);
				} else if (
					response.data.is_email_verified == 0 ||
					response.data.is_email_verified == '0'
				) {
					this._router.navigate([
						'account/registration-complete',
						{ email: userLoginDetails.email },
					]);
				} else if (
					response.data.is_active == 0 ||
					response.data.is_active == '0'
				) {
					this.notificationService.openNotification(
						$localize`:@@account_login_account_deactivated_error:Error: Your account is deactivated please contact customer care to activate.`,
						'',
						'error'
					);
					this.isLoggedIn.next(false);
				}
				//If email is verified, continue login process
				else {
					let user_val = new User(
						response.data.id,
						new JWT(response.data.jwt, ''),
						response.data.first_name,
						response.data.last_name,
						userLoginDetails.email,
						response.data.profile_image != 'No image found'
							? response.data.profile_image
							: null,
						response.data.is_email_verified
					);
					/** *Save user info into local storage */
					if (this.isBrowser)
						localStorage.setItem('user', JSON.stringify(user_val));
					/** *Save login time to local storage */
					if (this.isBrowser)
						localStorage.setItem('lastLogin', new Date().getTime().toString());
					/** *Set use logging flag */
					this.setIsUserLoggedIn(true);
					/** *Send Notification */
					this.notificationService.openNotification(
						$localize`:@@account_login_loginSuccessfully_notification:Login successfully`,
						'OK',
						'success'
					);

					/** *Check previous path or else Route to dashboard */
					let previous_path = Tools.getPreviousPath() || 'dashboard';
					let previous_path_withoutLocale = Tools.getPathnameWithoutLocale(
						previous_path,
						this.getLocaleId()
					);
					this._router.navigate([previous_path_withoutLocale]);

					/** *SET USER LANGUAGE */
					if (this.isBrowser) Tools.setUserlanguage(this.getLocaleId());
					/** *Set Timeout to logout */
					setTimeout(() => {
						/** *Send Notification */
						this.notificationService.openNotification(
							$localize`:@@account_login_youHavebeenLogout_notification:You have been logout of your account. Kindly login again.`,
							'',
							'error'
						);
						this.logout();
					}, 7200000);
				}
			},
			(error) => {
				this.notificationService.openNotification(
					$localize`:@@account_login_incorrectCredientials_error:Error: Incorrect Email & Password`,
					'',
					'error'
				);
				this.setIsUserLoggedIn(false);
			}
		);
	}

	/*
	 * Function To set logout
	 * @param value
	 */
	logout() {
		if (this.isBrowser) localStorage.clear();
		if (
			this._router.url.includes('/dashboard') ||
			this._router.url.includes('/profile') ||
			this._router.url.includes('/donate') ||
			this._router.url.includes('/my-fundraisers') ||
			this._router.url.includes('/balance') ||
			this._router.url.includes('/custom-branding') ||
			this._router.url.includes('/fundraising/donation-amount')
		) {
			this._router.navigate(['/account']);
		}
		this.isLoggedIn.next(false);
	}

	/*
	 * Function To verify email
	 * @param value
	 */
	verifyEmail(data: any) {
		let endPoint = 'account/verify_email/';
		return this.HttpClient.post(this.ACCOUNT_API_V2 + endPoint, data);
	}

	/*
	 * Function to get current login status
	 */
	getLoginInformation() {
		//CHECK IF USER IS LOGGED IN
		if (this.isLoggedIn.getValue() == false) {
			//CHECK IF JWT/USER EXISTS
			let user: any;
			if (this.isBrowser) user = localStorage.getItem('user') || '';
			if (user != null && user != undefined && user.length > 0) {
				//CHECK IF JWT IS VALID
				if (this.isJWTValid()) {
					this.isLoggedIn.next(true);
				} else {
					//JWT is has expired --> logout
					this.logout();
					/** *JWT EXPIRED - Send Notification */
					this.notificationService.openNotification(
						$localize`:@@account_login_youHavebeenLogout_notification:You have been logout of your account. Kindly login again.`,
						'',
						'error'
					);
				}
			}
		}

		return this.isLoggedIn;
	}

	/*
	 *Function to check if JWT has expired
	 */
	isJWTValid() {
		if (this.isBrowser)
			if (
				new Date().getTime() >
				parseInt(localStorage.getItem('lastLogin') || '0') + 7200000
			) {
				return false;
			} else {
				return true;
			}
	}

	/*
	 * Function to check if an email already exists in whydonate database
	 */
	isEmailInUse(email: string) {
		let endPointUrl: string = 'account/user/verify_email/';
		let body = { email: email };
		return this.HttpClient.post(this.ACCOUNT_API_V2 + endPointUrl, body);
	}

	/*
	 * Function to register a user
	 */
	register(userDetails: UserRegistration) {
		// Extract Data and Make form data
		let registerFormData = new FormData();
		if (userDetails.image) {
			registerFormData.append(
				'image',
				Tools.base64toBlob(userDetails?.image, userDetails?.image_type),
				userDetails?.image_name
			);
		}
		registerFormData.append('name', userDetails.name);
		registerFormData.append(
			'language_code',
			userDetails.language_code ? userDetails.language_code : 'nl'
		);
		registerFormData.append('type', userDetails.type);
		registerFormData.append(
			'phone_number',
			userDetails.phone_number != undefined ? userDetails.phone_number : null
		);
		registerFormData.append('first_name', userDetails.first_name);
		registerFormData.append('last_name', userDetails.last_name);
		registerFormData.append('email', userDetails.email);
		registerFormData.append('password', userDetails.password);
		registerFormData.append('previous_path', userDetails.previous_path);
		return this.HttpClient.post(
			this.ACCOUNT_API_V2 + 'account/user/',
			registerFormData,
			{ headers: new HttpHeaders().set('Origin', environment.domain) }
		);
	}

	/*
	 * Function to create a Merchant on OPP
	 */
	async createMerchant(payload: any) {
		let url = 'account/merchant';
		let headers = this.getHeaders();
		return await this.HttpClient.post(this.ACCOUNT_API_V2 + url, payload, {
			headers: headers,
		}).toPromise();
	}

	/*
	 * Function to resend verification email
	 */
	resendVerificationEmail(email: string) {
		let body = { email: email };
		return this.HttpClient.post(
			this.ACCOUNT_API_V2 + 'account/resend_email',
			body,
			{ headers: new HttpHeaders().set('Origin', environment.domain) }
		);
	}

	/*
	 * Function to get Locale Id
	 */
	getLocaleId(): string {
		if (this.locale.startsWith('en')) {
			return 'en';
		}
		if (this.locale.startsWith('es')) {
			return 'es';
		}
		if (this.locale.startsWith('de')) {
			return 'de';
		}
		if (this.locale.startsWith('fr')) {
			return 'fr';
		}
		return 'nl';
	}

	/*
	 * Function to set user is logged In
	 */
	setIsUserLoggedIn(value: Boolean) {
		this.isLoggedIn.next(value);
	}

	/*
	 * Function for forgot password
	 */
	forgotPassword(email: any) {
		let endPointUrl: string = 'account/user/forget_password/';
		let headers = this.getHeaders();
		return this.HttpClient.post(this.ACCOUNT_API_V2 + endPointUrl, email, {
			headers: headers,
		});
	}

	/**
	 * Function to check token validation
	 */
	isResetPasswordTokenValid(email: any, token: any) {
		let endPointUrl: string = 'account/user/reset_password_token_validate/';
		// return this._apiService.post(endPointUrl, { user_id, token });
		let headers = this.getHeaders();
		return this.HttpClient.post(
			this.ACCOUNT_API_V2 + endPointUrl,
			{ email, token },
			{
				headers: headers,
			}
		);
	}

	/*
	 * Function to register a user
	 */
	resetPassword(reset_password: UserResetPassword) {
		let endPointUrl: string = 'account/user/reset_password/';
		let body = reset_password;
		let headers = this.getHeaders();
		return this.HttpClient.post(this.ACCOUNT_API_V2 + endPointUrl, body, {
			headers: headers,
		});
	}

	/**
	 * Function to get HttpHeader authorization header after session started
	 * @returns HttpHeaders
	 */
	getHeaders() {
		let user: any;
		if (this.isBrowser) user = localStorage.getItem('user') || '{}';
		if (user != '{}' && user != null && user != undefined) {
			let jwt = JSON.parse(user)?.jwt?.jwt || null;
			if (jwt != null && jwt != undefined && jwt != '{}') {
				return new HttpHeaders()
					.set('content-type', 'application/json')

					.set('Access-Control-Allow-Origin', '*') //! throws cors error */
					.set('Authorization', `JWT ${jwt}`);
			} else {
				return new HttpHeaders().set('content-type', 'application/json');
			}
		} else {
			return new HttpHeaders().set('content-type', 'application/json');
		}
	}

	checkHeaders() {
		let user: any;
		if (this.isBrowser) user = localStorage.getItem('user') || '{}';
		if (user != '{}' && user != null && user != undefined) {
			let jwt = JSON.parse(user)?.jwt?.jwt || null;
			if (jwt != null && jwt != undefined && jwt != '{}' && jwt.length != 0) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
}
