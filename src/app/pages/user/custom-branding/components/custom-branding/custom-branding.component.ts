/**This component is invoked when custom branding is selected by a registered user */

import {
	Location,
	LocationStrategy,
	PathLocationStrategy,
} from '@angular/common';
import { CustomBrandingService } from '../../services/custom-branding.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AccountService } from 'src/app/pages/account/services/account.service';

@Component({
	selector: 'app-custom-branding',
	templateUrl: './custom-branding.component.html',
	providers: [
		Location,
		{ provide: LocationStrategy, useClass: PathLocationStrategy },
	],
})
/** *Custom Branding Component */
export class CustomBrandingComponent implements OnInit, OnDestroy {
	location: Location;
	sub!: Subscription;
	selectedTabIndex = 1;
	customEmailSetting: any;
	customBrandingSetting: any;
	customBrandingLabel = $localize`:@@custom_branding_branding_mat_tab:Branding`;
	emailBrandingLabel = $localize`:@@custom_branding_email_mat_tab:Email`;
	receiptBrandingLabel = $localize`:@@custom_branding_receipt_mat_tab:Receipt`;

	constructor(
		private _customBrandingService: CustomBrandingService,
		public _route: ActivatedRoute,
		location: Location,
		public _router: Router,
		public notificationService: NotificationService,
		public accountService: AccountService
	) {
		this.location = location;
		this.sub = this._route.fragment.subscribe((fragment: any) => {
			if (fragment === 'email') this.selectedTabIndex = 1;
			else if (fragment === 'receipt') this.selectedTabIndex = 2;
			else this.selectedTabIndex = 0;
			// console.log('Tab:', this.selectedTabIndex, ' => ', fragment);
		});
	}

	ngOnInit(): void {
		if (this.accountService.checkHeaders()) {
			this._customBrandingService.getProfile().subscribe(
				(res: any) => {
					this._customBrandingService.setProfileObj = res.data.profile;
					this.customEmailSetting =
						this._customBrandingService.getCustomEmailObj;
					this.customBrandingSetting =
						this._customBrandingService.getBrandingObj;

					this.notificationService.openNotification(
						$localize`:@@custom_branding_recordFetched_notification:Record fetched successfully`,
						'OK',
						'success'
					);
				},
				(error) => {
					this.notificationService.openNotification(
						$localize`:@@custom_branding_errorFetching_notification:Error fetching records`,
						'Close',
						'error'
					);
				}
			);
		}
	}

	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}

	setTab(index: number) {
		// this.selectedTabIndex = index;
		// console.log(this.selectedTabIndex);
	}

	changeRouteFragment(event: number) {
		// console.log('event', event);
		// if (event === 1) this.location.go('/custom-branding#email');
		// else if (event === 2) this.location.go('/custom-branding#receipt');
		// else this.location.go('/custom-branding#branding');
	}

	/** *TODO: use below function in toolbar for navigation */
	// routeToBranding() {
	// 	const navigationExtras: NavigationExtras = { fragment: 'branding' };
	// 	this._router.navigate(['custom-branding'], navigationExtras);
	// }
	// routeToEmail() {
	// 	const navigationExtras: NavigationExtras = { fragment: 'email' };
	// 	this._router.navigate(['custom-branding'], navigationExtras);
	// }
	// routeToReceipt() {
	// 	const navigationExtras: NavigationExtras = { fragment: 'receipt' };
	// 	this._router.navigate(['custom-branding'], navigationExtras);
	// }
}
