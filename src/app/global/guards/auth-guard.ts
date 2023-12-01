import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { Location, isPlatformBrowser } from '@angular/common';
import { ProfileService } from 'src/app/pages/user/profile/services/profile.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Tools } from 'src/utilities/tools';

/**
 * This guard prevents a non registered user to access account pages/module
 */

@Injectable({
	providedIn: 'root',
})
export class AuthGuard {
	isLoggedIn: Boolean = false;
	isAccountDeactivated: Boolean = false;
	isHeaderAvailable: Boolean = false;
	isBrowser: boolean = false;

	/**
	 * This guard depends upon
	 * PARAM: accountService
	 * PARAM: _router
	 */
	constructor(
		private accountService: AccountService,
		private _router: Router,
		public location: Location,
		public activatedRoute: ActivatedRoute,
		public notificationService: NotificationService,
		public profileService: ProfileService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	/**
	 * This function helps in actvating the routes
	 * RETURNS
	 */
	canActivate() {
		this.accountService.getLoginInformation().subscribe((data: Boolean) => {
			this.isLoggedIn = data;
			this.isHeaderAvailable = this.accountService.checkHeaders();

			//get Profile
			if (this.isLoggedIn == true && this.isHeaderAvailable) {
				this.profileService.getProfile().subscribe((res: any) => {
					if (res['data']['deactivated'] == true) {
						this.isAccountDeactivated = true;
						this.notificationService.openNotification(
							$localize`:@@auth_accountDeactivated:Your account is deactivated please contact customer care to activate.`,
							'Got it',
							'error'
						);
						this.accountService.logout();
						this._router.navigate(['account/login']);
					}
				});
			}
		});

		this.isHeaderAvailable = this.accountService.checkHeaders();
		if (
			this.isLoggedIn &&
			!this.isAccountDeactivated &&
			this.isHeaderAvailable
		) {
			return true;
		} else if (this.isAccountDeactivated || !this.isHeaderAvailable) {
			/** *Send Notification */
			this.notificationService.openNotification(
				$localize`:@@account_login_youHavebeenLogout_notification:You have been logout of your account. Kindly login again.`,
				'',
				'error'
			);
			this._router.navigate(['account/login']);
			return false;
		} else {
			let previousPathFromBrowserAddressBar: any;
			if (this.isBrowser)
				previousPathFromBrowserAddressBar =
					Tools.getPathnameWithoutLocale(
						window.location.pathname,
						this.accountService.getLocaleId()
					) || '';
			let previousPathFromRouter: any;
			if (this.isBrowser)
				previousPathFromRouter = localStorage.getItem('previous_path') || '';
			if (previousPathFromBrowserAddressBar.includes(previousPathFromRouter)) {
				Tools.setPreviousPath(previousPathFromBrowserAddressBar);
			}

			this._router.navigate(['account']);
			return false;
		}
	}
}
