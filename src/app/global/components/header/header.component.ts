import { HttpClient } from '@angular/common/http';
import {
	ChangeDetectorRef,
	Component,
	HostListener,
	Inject,
	LOCALE_ID,
	OnInit,
	PLATFORM_ID,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { FundraiserService } from 'src/app/pages/fundraiser/services/fundraiser.service';
import { CustomBrandingService } from 'src/app/pages/user/custom-branding/services/custom-branding.service';
import { DashboardService } from 'src/app/pages/user/dashboard/services/dashboard.service';
import { BankService } from 'src/app/pages/user/profile/services/bank.service';
import { ProfileService } from 'src/app/pages/user/profile/services/profile.service';
import { PopupStartFundraiserComponent } from 'src/app/shared/components/popup-start-fundraiser/popup-start-fundraiser.component';
import { Tools } from 'src/utilities/tools';
import { JWT } from '../../models/jwt';
import { User } from '../../models/user';
import { SidenavService } from '../../services/sidenav.service';
import { isPlatformBrowser } from '@angular/common';

/************************************************
 *
 * This class takes care of header section
 *
 ***********************************************/

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	/** *GLOBAL VARIABLES---------------------------------------- */
	logo: any;
	currentLang: string = '';
	isLoggedIn: boolean = false;
	isShowText: Boolean = false;
	isShowIcon: Boolean = false;
	user: any;
	profileImage: any;
	currentFundraiser: any;
	public currentLanguageCode: string = '';
	subject = new Subject<string>();
	userProfile: any;
	userImg: any;
	defaultImage: any;
	isBrowser: boolean = false;
	whydonatePlatformUrl = $localize`:@@header_crowfunding_label:crowdfunding-fundraising`;
	donationPluginUrl = $localize`:@@header_donate_plugin_url:donate-button-website`;
	digitalPinBoxUrl = $localize`:@@header_digital_box_url:digital-collection-box`;
	isReceiver: boolean = false;
	defaultProfileImage: string =
		'https://res.cloudinary.com/whydonate/image/upload/v1689793299/whydonate-production/platform/svg-icons/whydonate_user.png';
	constructor(
		public accountService: AccountService,
		public router: Router,
		private _http: HttpClient,
		private _changeDetectorRef: ChangeDetectorRef,
		public fundraiserService: FundraiserService,
		private _profileService: ProfileService,
		private _customBrandingService: CustomBrandingService,
		public _dashboardService: DashboardService,
		public _dialog: MatDialog,
		public _bankService: BankService,
		public _sidenavService: SidenavService,
		@Inject(LOCALE_ID) public locale: string,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}
	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
		var innerWidth: any;
		if (this.isBrowser) innerWidth = window.innerWidth;

		this.setLogo(innerWidth);
		this.setSideNavDefaults();
	}

	ngOnInit(): void {
		this.setSideNavDefaults();
		this._customBrandingService
			.getIsReceived()
			.subscribe((receivedValue: boolean) => {
				this.isReceiver = receivedValue;
			});
		//SET DEFAULTIMAGE AND DEFAULT LOGO
		if (this.isBrowser) this.setLogo(window.innerWidth);
		this.getUrl().subscribe();
		this.getLoggedInInfo();

		/** *Fetch and check if custom branding exists */

		/** *Update the sidebar view with the latest profile */
		this._profileService.profileUpdate
			.pipe(takeUntil(this._unsubscribeAll)) // Unsubscribe
			.subscribe((profile: any) => {
				if (profile) {
					/** *Update the the profile image */
					this.userProfile = profile;
					this.profileImage = this.userProfile.data.image;
					if (this.isBrowser) this.user = localStorage.getItem('user');

					let user_val = new User(
						JSON.parse(this.user)?.id,
						new JWT(
							JSON.parse(this.user)?.jwt.jwt,
							JSON.parse(this.user)?.jwt.expiry_date
						),
						JSON.parse(this.user)?.first_name,
						JSON.parse(this.user)?.last_name,
						JSON.parse(this.user)?.email,
						this.profileImage != 'No image found' ? this.profileImage : null
					);
					/** *Save user info into local storage */
					if (this.isBrowser)
						localStorage.setItem('user', JSON.stringify(user_val));

					/** *Mark for check */
					this._changeDetectorRef.markForCheck();
				}
			});

		this.router.events.subscribe((e) => {
			if (e instanceof NavigationEnd) {
				if (e.url.includes('/fundraising') || e.url.includes('/donate')) {
					this.fundraiserService
						.getCurrentFundraiser()
						.subscribe((fundraiser) => {
							if (fundraiser != null && fundraiser != undefined) {
								if (fundraiser?.profile?.custom_logo) {
									this.logo = Tools.getCloudinaryCustomLogoPath(
										fundraiser?.['profile']?.['custom_logo']
									);
								}
							}
						});
				} else {
					if (this.isBrowser) this.setLogo(window.innerWidth);
				}
			}
		});
	}
	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		/** *Unsubscribe from all subscriptions */
		this._unsubscribeAll.complete();
	}
	/*
	 * Function for user menu clicks
	 * @param value
	 */
	userMenuClick(value: string) {
		switch (value.toLowerCase()) {
			case 'myaccount':
				this.router.navigate(['/profile']);
				break;

			case 'helpcenter':
				if (this.isBrowser)
					window.location.href =
						'https://helpdesk' +
						'.whydonate.com' +
						'/' +
						this.currentLanguageCode;
				break;

			case 'logout':
				this.accountService.logout();
				break;
		}
	}

	/*
	 * Function to retrieve login info
	 */
	getLoggedInInfo() {
		this.accountService.getLoginInformation().subscribe((data: Boolean) => {
			if (data == true) {
				this.isLoggedIn = true;
				this.user = localStorage.getItem('user');
				this.profileImage = JSON.parse(this.user)?.profile_image;
				if (this.profileImage == null) {
					this.profileImage = this.defaultImage;
				} else {
					this.profileImage;
				}
			} else {
				this.isLoggedIn = false;
			}
		});
	}

	/*
	 * Route to login
	 */
	routeToLogin() {
		// SET PREVIOUS PATH TO EMPTY BECAUSE LOGIN IS HAPPENING ON USER CLICK
		if (this.isBrowser) localStorage.setItem('previous_path', '');
		this.router.navigate(['account']);
	}

	/*
	 * Route to search
	 */
	routeToSearch() {
		this.router.navigate(['search']);
	}

	/*
	 * Route to home
	 */
	routeToHome() {
		this.router.navigate(['/']);
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
		this.router.navigate(['custom-email']);
	}

	routeToReceipt() {
		this.router.navigate(['custom-receipt']);
	}

	startFundraiser(): void {
		const dialogRef = this._dialog.open(PopupStartFundraiserComponent, {
			width: '80%',
			height: 'fit-content',
			panelClass: 'fundraiser-popup',
		});
	}

	/** *Header Links Method */
	getUrl() {
		this.router.events
			.pipe(filter((event: any) => event instanceof NavigationEnd))
			.subscribe((x: any) => {
				this.currentLanguageCode = x.url;
				this.subject.next(this.currentLanguageCode);
			});
		return this.subject.asObservable();
	}

	languageForWhydonatePlatform() {
		if (this.isBrowser)
			window.location.href =
				'https://whydonate.com/' + this.whydonatePlatformUrl;
	}
	languageForDonationPlugin() {
		if (this.isBrowser)
			window.location.href = 'https://whydonate.com/' + this.donationPluginUrl;
	}
	languageForDigitalPinBox() {
		if (this.isBrowser)
			window.location.href = 'https://whydonate.com/' + this.digitalPinBoxUrl;
	}
	handleImageError(event: any) {
		event.target.src = this.defaultProfileImage;
	}

	/**
	 * Function to toggle left side navigation menu
	 */
	toggleSidenav() {
		var innerWidth: any;
		if (this.isBrowser) innerWidth = window.innerWidth;
		this.isShowText = this._sidenavService.getIsShowTextValue();
		this.isShowIcon = this._sidenavService.getIsShowIconValue();

		if (innerWidth < 420) {
			// Conditions For Mobile View
			this.isShowText = !this.isShowText;
			this.isShowIcon = !this.isShowIcon;
			this._sidenavService.toggleSidenav(this.isShowText, this.isShowIcon);
		} else {
			// Conditions For Desktop View
			this.isShowText = !this.isShowText;
			this.isShowIcon = true;
			this._sidenavService.toggleSidenav(this.isShowText, this.isShowIcon);
		}
	}

	/**
	 * Function to set default behaviour for left side navigation menu
	 */
	setSideNavDefaults() {
		var innerWidth: any;
		if (this.isBrowser) innerWidth = window.innerWidth;
		if (innerWidth < 420) {
			// Conditions For Mobile View
			this.isShowText = false;
			this.isShowIcon = false;
			this._sidenavService.toggleSidenav(this.isShowText, this.isShowIcon);
		} else {
			// Conditions For Desktop View
			this.isShowText = true;
			this.isShowIcon = true;
			this._sidenavService.toggleSidenav(this.isShowText, this.isShowIcon);
		}
	}

	/**
	 * Function to Set Responsive Logo in Header
	 * @param innerWidth
	 */
	setLogo(innerWidth: number) {
		/** *Condition for Custom Branding LOGO */
		if (this.isLoggedIn == true && this.accountService.checkHeaders()) {
			this._customBrandingService
				.getProfile()
				.pipe(takeUntil(this._unsubscribeAll))
				.subscribe((userProfile) => {
					this.userProfile = userProfile;
					this._customBrandingService.setIsReceived(
						this.userProfile.data?.profile?.is_receiver || false
					);
					try {
						if (
							this.userProfile?.data?.profile?.custom_logo != null &&
							this.userProfile?.data?.profile?.custom_logo !=
								'https://res.cloudinary.com/whydonate/image/upload/dpr_auto,f_auto,q_auto/whydonate-production/platform/visuals/whydonate-logo-licht.webp' &&
							this.userProfile?.data?.profile?.custom_logo !=
								'https://res.cloudinary.com/whydonate/image/upload/v1680029185/whydonate-production/platform/svg-icons/whydonate_icon.svg'
						) {
							this.logo = Tools.getCloudinaryCustomLogoPath(
								this.userProfile?.data?.profile?.custom_logo
							);
						} else {
							if (innerWidth < 500) {
								this.logo =
									'https://res.cloudinary.com/whydonate/image/upload/v1680029185/whydonate-production/platform/svg-icons/whydonate_icon.svg';
							} else {
								this.logo =
									'https://res.cloudinary.com/whydonate/image/upload/dpr_auto,q_auto/whydonate-staging/platform/visuals/new_design_logo.svg';
							}
						}
					} catch (err) {
						if (innerWidth < 500) {
							this.logo =
								'https://res.cloudinary.com/whydonate/image/upload/v1680029185/whydonate-production/platform/svg-icons/whydonate_icon.svg';
						} else {
							this.logo =
								'https://res.cloudinary.com/whydonate/image/upload/dpr_auto,q_auto/whydonate-staging/platform/visuals/new_design_logo.svg';
						}
					}
				});
		} else {
			if (innerWidth < 500) {
				this.logo =
					'https://res.cloudinary.com/whydonate/image/upload/v1680029185/whydonate-production/platform/svg-icons/whydonate_icon.svg';
			} else {
				this.logo =
					'https://res.cloudinary.com/whydonate/image/upload/dpr_auto,q_auto/whydonate-staging/platform/visuals/new_design_logo.svg';
			}
		}
	}
}
