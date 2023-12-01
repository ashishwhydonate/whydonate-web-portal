import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { SidenavService } from '../../services/sidenav.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
	isShowText: Boolean = false;
	isShowIcon: Boolean = false;
	isReceiver: Boolean = true;
	activeItem: string = '';
	dashboardTooltip = $localize`:@@dashboard_tooltip:Dashboard`;
	fundraisersTooltip = $localize`:@@fundraisers_tooltip:My Fundraisers`;
	balanceTooltip = $localize`:@@balance_tooltip: Balance`;
	payoutsettingsTooltip = $localize`:@@payout_settings_tooltip:Payout Settings`;
	emailsettingsTooltip = $localize`:@@email_settings_tooltip:Email Settings`;
	customisefundraisersTooltip = $localize`:@@customise_fundraisers_tooltip:Customise Fundraisers`;
	customiseemailsTooltip = $localize`:@@customise_emails_tooltip:Customise Emails`;
	customisereceiptsTooltip = $localize`:@@customise_receipts_tooltip:Customise Receipts`;
	apikeyTooltip = $localize`:@@api_key_tooltip:API-Key`;
	isBrowser: boolean = false;

	constructor(
		public router: Router,
		public sidenavService: SidenavService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	ngOnInit(): void {
		this.getActiveItem();
		this.sidenavService.isShowText.subscribe((res: any) => {
			this.isShowText = res;
		});
		this.sidenavService.isShowIcon.subscribe((res: any) => {
			this.isShowIcon = res;
		});
	}

	/*
	 * Function for selected item
	 * @param value
	 */
	getActiveItem() {
		this.router.events.subscribe((e) => {
			if (e instanceof NavigationEnd) {
				if (e.url.includes('/dashboard')) {
					this.activeItem = 'dashboard';
				} else if (e.url.includes('/my-fundraisers')) {
					this.activeItem = 'myFundraisers';
				} else if (e.url.includes('/balance')) {
					this.activeItem = 'balance';
				} else if (e.url.includes('/profile/payout-settings')) {
					this.activeItem = 'payoutSettings';
				} else if (e.url.includes('/profile/email')) {
					this.activeItem = 'emailSettings';
				} else if (e.url.includes('/custom-branding#branding')) {
					this.activeItem = 'customiseFundraisers';
				} else if (e.url.includes('/custom-branding#email')) {
					this.activeItem = 'customiseEmails';
				} else if (e.url.includes('/profile/api')) {
					this.activeItem = 'apiKey';
				} else {
					this.activeItem = '';
				}
			}
		});
	}

	/*
	 * Function for user menu clicks
	 * @param value
	 */
	userMenuClick(value: string) {
		this.activeItem = value;
		switch (value.toLowerCase()) {
			case 'dashboard':
				this.router.navigate(['/dashboard']);

				break;

			case 'myfundraisers':
				this.router.navigate(['/my-fundraisers']);
				break;

			case 'balance':
				this.router.navigate(['/balance']);
				break;

			case 'payoutsettings':
				this.router.navigate(['/profile/payout-settings']);
				break;

			case 'emailsettings':
				this.router.navigate(['/profile/email']);
				break;

			case 'customisefundraisers':
				this.routeToBranding();
				break;

			case 'customiseemails':
				this.routeToEmail();
				break;

			case 'custom branding':
				this.router.navigate(['/custom-branding']);
				break;

			case 'customisereceipts':
				this.routeToReceipt();
				break;

			case 'embedplugin':
				this.routeToReceipt();
				break;

			case 'apikey':
				this.router.navigate(['/profile/api']);
				break;
		}
		if (this.isMobileViewPort()) {
			this.closeSidenav();
		}
	}

	/*
	 * Route to custom branding
	 */
	routeToBranding() {
		const navigationExtras: NavigationExtras = { fragment: 'branding' };
		this.router.navigate(['custom-branding'], navigationExtras);
	}
	/*
	 * Route to custom email
	 */
	routeToEmail() {
		this.router.navigate(['custom-branding/email']);
	}
	/*
	 * Route to custom receipt
	 */
	routeToReceipt() {
		this.router.navigate(['custom-branding/receipt']);
	}

	isMobileViewPort(): Boolean {
		var innerWidth: any;
		if (this.isBrowser) innerWidth = window.innerWidth;

		if (innerWidth < 420) {
			return true;
		} else {
			return false;
		}
	}

	closeSidenav() {
		// Conditions For Mobile View
		this.isShowText = !this.isShowText;
		this.isShowIcon = !this.isShowIcon;
		this.sidenavService.toggleSidenav(this.isShowText, this.isShowIcon);
	}
}
