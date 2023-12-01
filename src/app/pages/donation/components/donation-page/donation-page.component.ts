import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/global/services/theme.service';
import { FundraiserService } from 'src/app/pages/fundraiser/services/fundraiser.service';
import { CustomBrandingService } from 'src/app/pages/user/custom-branding/services/custom-branding.service';
import { FundraiserCardService } from 'src/app/shared/services/fundraiser-card.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DonationService } from '../../services/donation.service';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-donation-page',
	templateUrl: './donation-page.component.html',
	styleUrls: ['./donation-page.component.scss'],
})
/** *Donation Page Component */
export class DonationPageComponent implements OnInit {
	raisedAmount: number = 0;
	targetAmount: number = 0;
	progress: number = 0;
	currentFundraiser: any;
	slug: string = '';
	backgroundImage: string =
		'https://res.cloudinary.com/whydonate/image/upload/v1689704507/whydonate-production/platform/svg-icons/fundraiser_default_bg.png';
	isChild: boolean = false;
	fundraiserCardData: any;
	isLoading: boolean = true;
	isDraftOrClosed!: boolean;
	isBrowser: boolean = false;
	locale: any;
	currency: any = {
		currency_code: '',
		currency_symbol: '',
	};
	constructor(
		public donationService: DonationService,
		public fundraiserService: FundraiserService,
		public _customBrandingService: CustomBrandingService,
		public _themeService: ThemeService,
		public notificationService: NotificationService,
		public router: Router,
		public fundriaserCardDataService: FundraiserCardService,
		public _accountService: AccountService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	ngOnInit(): void {
		//get slug from url
		this.locale = this._accountService.getLocaleId();
		if (this.isBrowser) sessionStorage.setItem('flag', 'false');

		if (this.router.url.indexOf('?') != -1) {
			this.slug = this.router.url.substring(8, this.router.url.indexOf('?'));
		} else {
			this.slug = this.router.url.substring(8);
		}

		// get Fundraiser from service
		this.fundraiserService
			.getFundraiserBySlug(this.slug, this.locale)
			.subscribe((data: any) => {
				this.currentFundraiser = data['data'].result;
				// SET CURRENCY
				this.currency = {
					currency: this.currentFundraiser?.currency_code,
					symbol: this.currentFundraiser?.currency_symbol,
				};

				this.isDraftOrClosed = this.fundraiserService.isFundraiserClosed(
					this.currentFundraiser
				);
				if (this.isBrowser) sessionStorage.clear();
				if (this.isBrowser)
					sessionStorage.setItem(
						'slug',
						JSON.stringify(this.currentFundraiser)
					);
				//SET SELECTED FUNDRAISER IN SERVICE
				this.donationService.setSelectedFundraiser(this.currentFundraiser);
				this.fundraiserService.setCurrentFundraiser(this.currentFundraiser);

				// Set custom branding of fundraiser
				this.setCustomBranding(this.currentFundraiser);

				/** *Check If the fundraiser is Child or Parent */
				if (
					this.currentFundraiser?.parent != null &&
					Object.keys(this.currentFundraiser?.parent).length > 0
				) {
					this.isChild = true;
				}
				// CALCULATE DONATION PROGRESS
				this.calculateProgress();
				//UPDATE BACKGROUND
				this.loadBackgroundInView();
				//UPDATE FUNDRAISER CARD DATA
				this.fundraiserCardData =
					this.fundriaserCardDataService.filterFundraiserCardDataList([
						this.currentFundraiser,
					]);

				this.isLoading = false;
			}),
			(error: any) => {
				if (this.isBrowser)
					window.alert('Error Loading Fundraiser. Error: ' + error);
			};

		this.fundraiserService
			.getFundraiserBySlug(this.slug, this.locale)
			.subscribe((data: any) => {
				// console.log("data donation form",data)
				if (data['errors']['code'] == '4001') {
					this.router.navigate(['/fundraising/fundraiser-not-found']);
				}
			});
	}

	/**
	 * Load Background In View
	 */
	loadBackgroundInView() {
		if (this.isChild) {
			if (this.currentFundraiser?.background != null) {
				this.backgroundImage = this.currentFundraiser?.background?.image;
			} else if (
				this.currentFundraiser?.background == null &&
				Object.keys(this.currentFundraiser?.parent).length > 0
			) {
				if (this.currentFundraiser?.parent?.background != null) {
					this.backgroundImage =
						this.currentFundraiser?.parent?.background?.image;
				}
			}
		} else {
			if (this.currentFundraiser?.background) {
				this.backgroundImage = this.currentFundraiser?.background?.image;
			}
		}
	}

	/** Set CustomBranding by calling services */
	setCustomBranding(currentFundraiser: any) {
		// Set Custom Branding
		this._customBrandingService.setProfileObj = currentFundraiser?.profile;
		let customSettings = this._customBrandingService.getBrandingObj;
		this._themeService.setTheme(
			customSettings?.primaryColor,
			customSettings?.secondaryColor,
			customSettings?.customFont
		);
	}

	/**
	 * Fundtion to calculate the donation progress
	 */
	calculateProgress() {
		if (this.currentFundraiser) {
			this.raisedAmount = parseInt(this.currentFundraiser?.donation?.amount);
			this.targetAmount = parseInt(this.currentFundraiser?.amount_target);
			this.progress = (this.raisedAmount / this.targetAmount) * 100;
			this.progress = Math.round((this.progress + Number.EPSILON) * 100) / 100;
		}
	}

	/*
	 *  Destroy the selected fundraiser in Service
	 */
	ngOnDestroy() {
		this.donationService.emptySelectedFundraiser();
	}
	redirectToFundraiser() {
		this.router.navigate(['fundraising/' + this.slug]);
	}
}
