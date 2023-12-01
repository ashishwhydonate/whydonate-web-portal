import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JWT } from 'src/app/global/models/jwt';
import { User } from 'src/app/global/models/user';
import { CustomBrandingService } from 'src/app/pages/user/custom-branding/services/custom-branding.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AccountService } from '../../services/account.service';
import { environment } from 'src/environments/environment';
import { Tools } from 'src/utilities/tools';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-email-verification',
	templateUrl: './email-verification.component.html',
	styleUrls: ['./email-verification.component.scss'],
})
export class EmailVerificationComponent implements OnInit {
	userEmail: string = '';
	userToken: string = '';
	previous_path: string = '';
	verificationStatus: string = 'unsuccessful';
	profileResponse: any;
	isBrowser: boolean = false;
	// zaraz: any = environment.zaraz;
	constructor(
		public activatedRoute: ActivatedRoute,
		public accountService: AccountService,
		public notificationService: NotificationService,
		public router: Router,
		public _customBrandingService: CustomBrandingService,
		@Inject(PLATFORM_ID) platformId: false
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	ngOnInit(): void {
		this.userEmail =
			this.activatedRoute.snapshot.queryParamMap.get('email') || '';
		this.userToken =
			this.activatedRoute.snapshot.queryParamMap.get('token') || '';

		//Fetch Previous Path if available
		this.previous_path =
			this.activatedRoute.snapshot.queryParamMap.get('previous_path') || '';

		let payload = {
			email: this.userEmail,
			token: this.userToken,
		};

		this.accountService.verifyEmail(payload).subscribe(
			(res: any) => {
				if (res['status'] == 200) {
					if (
						res?.errors?.message ==
						'Missing or invalid field email in request body'
					) {
						this.verificationStatus = 'unsuccessful';
						this.notificationService.openNotification(
							res.errors.message,
							'OK',
							'error'
						);
					} else if (res?.data?.response == 'VerificationLinkExpired') {
						this.verificationStatus = 'unsuccessful';
						this.notificationService.openNotification(
							'Email verification link is expired',
							'OK',
							'error'
						);
					} else if (res?.data?.response == 'EmailAlreadyVerified') {
						this.notificationService.openNotification(
							'Email is already verified',
							'OK',
							'success'
						);
						this.verificationStatus = 'successful';
						this.accountService.setIsUserLoggedIn(false);
						setTimeout(() => {
							this.router.navigate(['account']);
						}, 3000);
					} else if (!res?.errors?.message) {
						let user_val = new User(
							res.data.id,
							new JWT(res.data.jwt, ''),
							res.data.first_name,
							res.data.last_name,
							this.userEmail,
							res.data.profile_image != 'No image found'
								? res.data.profile_image
								: null
						);

						/** *Save user info into local storage */
						if (this.isBrowser)
							localStorage.setItem('user', JSON.stringify(user_val));
						/** *Save login time to local storage */
						if (this.isBrowser)
							localStorage.setItem(
								'lastLogin',
								new Date().getTime().toString()
							);
						/** *Set use logging flag */
						this.accountService.setIsUserLoggedIn(true);

						if (this.accountService.checkHeaders()) {
							// GA Script
							this._customBrandingService.getProfile().subscribe((res) => {
								/** *Success */
								this.profileResponse = res;

								//SEND GOOGLE ANALYTICS EVENT
								if (this.isBrowser)
									(window as any)?.zaraz?.track('New_Account_Created', {
										user_id: user_val.id,
										profile_id: this.profileResponse?.data?.profile?.id,
									});
							});
						}

						this.verificationStatus = 'successful';
						setTimeout(() => {
							// if (this.previous_path != '' && this.previous_path != undefined) {
							// 	let previous_path_withoutLocale =
							// 		Tools.getPathnameWithoutLocale(
							// 			this.previous_path,
							// 			this.accountService.getLocaleId()
							// 		);
							// 		this.router.navigate([previous_path_withoutLocale]);
							// } else {
							// 	this.router.navigate(['dashboard']);
							// }
							this.router.navigate(['dashboard']);
						}, 3000);
					}
				}
			},
			(error) => {
				this.verificationStatus = 'unsuccessful';
			}
		);
	}
}
