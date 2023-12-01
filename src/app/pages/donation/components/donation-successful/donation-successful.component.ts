import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from 'src/app/global/services/theme.service';
import { FundraiserService } from 'src/app/pages/fundraiser/services/fundraiser.service';
import { CustomBrandingService } from 'src/app/pages/user/custom-branding/services/custom-branding.service';
import { DashboardService } from 'src/app/pages/user/dashboard/services/dashboard.service';
import { FundraiserCardData } from 'src/app/shared/interfaces/fundraiser-card-interface';
import { FundraiserCardService } from 'src/app/shared/services/fundraiser-card.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DonationService } from '../../services/donation.service';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-donation-successful',
	templateUrl: './donation-successful.component.html',
	styleUrls: ['./donation-successful.component.scss'],
})
/** *Donation Successful Component */
export class DonationSuccessfulComponent implements OnInit {
	slug: string = '';
	donorId: string | null = '';
	orderId: string | null = '';
	currentFundraiser: any;
	progress: number = 0;
	raisedAmount: number = 0;
	targetAmount: number = 0;
	backgroundImage: string =
		'https://res.cloudinary.com/whydonate/image/upload/v1689704507/whydonate-production/platform/svg-icons/fundraiser_default_bg.png';
	isChild: boolean = false;
	isFundraiserLoaded: boolean = false;
	donationReceipt: any;
	transactionCost: any;
	profileResponse: any;
	fundraiserGetFundraiser: any;
	fundraiserGetFundraiser2: any;
	_slug: string = 'testurl';
	_fundraiserCardData: FundraiserCardData;
	orderID: any;
	transactionID: any;
	taxAmount: any;
	flagValue: any;
	unknownID: string = '1111111';
	unknownName: string = 'Unknown1';
	fundraiserCardData: any;
	isLoading: boolean;
	userAccount: any;
	amount: any = 0;
	locale: any;
	isBrowser: boolean = false;
	constructor(
		public router: Router,
		public activatedRoute: ActivatedRoute,
		public _customBrandingService: CustomBrandingService,
		public _themeService: ThemeService,
		public donationService: DonationService,
		public fundraiserService: FundraiserService,
		public _dashboardService: DashboardService,
		public _fundraiserCardService: FundraiserCardService,
		public notificationService: NotificationService,
		public _accountService: AccountService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		this.isLoading = false;
		this._fundraiserCardService = _fundraiserCardService;
		this._fundraiserCardData = this._fundraiserCardService.getObjWithData();
	}

	ngOnInit(): void {
		this.locale = this._accountService.getLocaleId();

		this.flagValue = JSON.parse(sessionStorage.getItem('flag') || '{}');

		// EXTRACT VARIABLES THROUGH ROUTE
		this.donorId = this.activatedRoute.snapshot.paramMap.get('donorId') || '';
		this.orderId = this.activatedRoute.snapshot.paramMap.get('orderId') || '';
		this.slug = this.activatedRoute.snapshot.paramMap.get('slug') || '';

		//GET FUNDRAISER THROUGH SLUG
		this.fundraiserService
			.getFundraiserBySlug(this.slug, this.locale)
			.subscribe((data: any) => {
				this.currentFundraiser = data['data']?.result;
				this.isFundraiserLoaded = true;
				sessionStorage.setItem('slug', JSON.stringify(this.currentFundraiser));
				//SET SELECTED FUNDRAISER IN SERVICE
				this.donationService.setSelectedFundraiser(this.currentFundraiser);
				this.checkTaxAmount();

				// Set custom branding of fundraiser
				this.setCustomBranding(this.currentFundraiser);

				//ZARAZ
				if (this.isBrowser)
					(window as any)?.zaraz?.track('purchase', {
						transaction_id: this.transactionID || '',
						value: this.fundraiserGetFundraiser?.amount || '',
						tax: this.taxAmount || '',
						shipping: this.fundraiserGetFundraiser?.tip_amount || '',
						user_id: this.currentFundraiser?.profile?.user_id || '',
						profile_name: this.currentFundraiser?.profile?.name || '',
						transaction_cost: this.transactionCost || '',
						currency: 'EUR',
						source: 'Web',
						items: [
							{
								item_id: this.transactionID || '',
								item_name: this.fundraiserGetFundraiser?.description || '',
								price: this.fundraiserGetFundraiser?.amount || '',
								item_brand:
									this.currentFundraiser?.location?.location_name || '',
								item_category: this.currentFundraiser?.category?.name || '',
								item_variant: this.fundraiserGetFundraiser?.pay_period || '',
								quantity: 1,
							},
						],
					});

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
					this._fundraiserCardService.filterFundraiserCardDataList([
						this.currentFundraiser,
					]);
			}),
			(error: any) => {
				if (this.isBrowser)
					window.alert('Error Loading Fundraiser. Error: ' + error);
			};

		if (this.isBrowser)
			this.transactionID = localStorage.getItem('transactionId');
		this.donationReceipt = this.donationService.getDonationReceipt();
		this.fundraiserGetFundraiser = this.donationService.getDonationDone();

		this.transactionCost =
			this.fundraiserGetFundraiser.amount * (1.9 / 100) + 0.25;
	}

	/** *Checking Tax Amount */
	checkTaxAmount() {
		if (this.fundraiserGetFundraiser?.tip_amount == '0') {
			this.taxAmount = this.fundraiserGetFundraiser.amount * (3 / 100);
		} else {
			this.taxAmount = '0';
		}
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
	 * Function to calculate the donation progress
	 */
	// calculateProgress() {
	// 	if (this.currentFundraiser) {
	// 		this.raisedAmount = parseInt(this.currentFundraiser.donation.amount);
	// 		this.targetAmount = parseInt(this.currentFundraiser.amount_target);
	// 		this.progress = (this.raisedAmount / this.targetAmount) * 100;
	// 		this.progress = Math.round((this.progress + Number.EPSILON) * 100) / 100;
	// 	}
	// }
	calculateProgress() {
		if (this.currentFundraiser && this.currentFundraiser.donation?.amount) {
			this.raisedAmount = parseInt(this.currentFundraiser.donation.amount);
			this.targetAmount = parseInt(this.currentFundraiser.amount_target);
			this.progress = (this.raisedAmount / this.targetAmount) * 100;
			this.progress = Math.round((this.progress + Number.EPSILON) * 100) / 100;
		}
	}
}
