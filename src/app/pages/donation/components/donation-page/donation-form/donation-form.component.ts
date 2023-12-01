/*Clicking the "Donate" button on a fundraiser invokes this component*/

import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	Renderer2,
	AfterViewInit,
	Inject,
	PLATFORM_ID,
} from '@angular/core';
import { MAT_LEGACY_SELECT_CONFIG as MAT_SELECT_CONFIG } from '@angular/material/legacy-select';
import {
	MatLegacyTabChangeEvent as MatTabChangeEvent,
	MatLegacyTabGroup as MatTabGroup,
} from '@angular/material/legacy-tabs';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { environment } from 'src/environments/environment.prod';
import { DonationService } from '../../../services/donation.service';
import { BankService } from 'src/app/pages/user/profile/services/bank.service';
import { FundraiserService } from 'src/app/pages/fundraiser/services/fundraiser.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-donation-form',
	templateUrl: './donation-form.component.html',
	styleUrls: ['./donation-form.component.scss'],
	providers: [
		{
			provide: MAT_SELECT_CONFIG, // gives branding color to mat-option by applying branding class near cdk-overlay-pane
			useValue: { overlayPanelClass: 'branding' },
		},
	],
})
/** *Donation Form Component */
export class DonationFormComponent implements OnInit, AfterViewInit {
	@Input() isDraftOrClosed!: boolean;
	@Input() defaultCurrency!: any;
	@Input() slug!: string;
	currentFundraiserConfig: any = {};
	isBrowser: boolean = false;
	isLoading: boolean = false;
	isPageDataLoaded: boolean = false;
	primaryColor: string = '#32BF56';
	pay_period: string = 'once';
	isAmountOtherSelected: boolean = false;
	isTipOtherSelected: boolean = false;
	isTipEnabled: boolean = false;
	tipValue: string = '0';
	tipAmount: number = 0;
	selectedDonationAmount!: number;
	totalAmount: number = 0;
	donationMadeResponse: any;
	isValidAmount: boolean = false;
	tip_details: any = {
		default_values: {
			tip_type_deciding_amount: 0,
			tip_amount_fixed_default: 0,
			tip_amount_percentage_default: 0,
		},
		tip_amount_percentage: {
			first_option: 0,
			second_option: 0,
			third_option: 0,
		},
		tip_amount_fixed: {
			first_option: 0,
			second_option: 0,
			third_option: 0,
		},
	};

	@Output() newResponse = new EventEmitter<any>();

	elementIdsOnetime: string[] = [
		'onetimeFirst',
		'onetimeSecond',
		'onetimeThird',
		'onetimeForth',
		'onetimeOther',
	];

	elementIdsMonthly: string[] = [
		'monthlyFirst',
		'monthlySecond',
		'monthlyThird',
		'monthlyForth',
		'monthlyOther',
	];

	elementIdsYearly: string[] = [
		'yearlyFirst',
		'yearlySecond',
		'yearlyThird',
		'yearlyForth',
		'yearlyOther',
	];
	maxMinCheck: boolean = false;
	oneTimeLabel = $localize`:@@donation_form_oneTime_label:One Time`;
	monthlyLabel = $localize`:@@donation_form_monthly_label:Monthly`;
	yearlyLabel = $localize`:@@donation_form_yearly_label:Yearly`;
	currentLocale: string = '';
	termsAndCondition = $localize`:@@donation_form_terms&conditions:terms-and-conditions`;
	termsHref: any;
	queryAmount: any;
	selectedOtherButttonCheck: boolean = false;
	firstButttonCheck: boolean = false;
	secondButttonCheck: boolean = false;
	thirdButttonCheck: boolean = false;
	forthButttonCheck: boolean = false;
	queryCheck: boolean = false;
	isTipInPercentage: boolean = true;
	stripeStatus: boolean = false;
	stripeChargeStatus!: boolean;
	selectedCurrency: any = {};
	constructor(
		public donationService: DonationService,
		public notificationService: NotificationService,
		public cookieService: CookieService,
		public accountService: AccountService,
		public renderer: Renderer2,
		public _accountService: AccountService,
		public route: ActivatedRoute,
		private cdr: ChangeDetectorRef,
		private _fundraiserService: FundraiserService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	// LIFECYCLE HOOKS------------------------------------------------------------------------------------------------------
	ngOnInit(): void {
		this.setTermsAndConditionsURL();
		this.checkQueryParams();
	}

	ngAfterViewInit() {
		// GET SELECTED CURRENCY
		this.selectedCurrency = this.donationService.getSelectedCurrency();

		this.donationService.selectedCurrency.subscribe((res) => {
			this.selectedCurrency = res;
			this.getDonationConfig(this.slug, res?.currency);
		});

		//Stripe Charges Status To Disable Donate Button If Charges are false
		this._fundraiserService
			.getStripeChargesStatus(this.slug)
			.subscribe((res: any) => {
				this.stripeChargeStatus = res?.data?.status;
			});
	}
	ngAfterViewChecked() {
		//your code to update the model
		this.cdr.detectChanges();
	}

	// OPERATION METHODS------------------------------------------------------------------------------------------------------

	checkQueryParams() {
		//Main If to check that onetime Tab is there or not

		this.route.queryParams.subscribe((params: any) => {
			this.queryAmount = params.amount;
			if (this.queryAmount != undefined) {
				this.queryCheck = true;
				this.setQueryValue();
			} else {
				this.queryCheck = false;
			}
		});
	}

	getSelectedCurrency() {
		this.donationService.getSelectedCurrency();
	}

	setTermsAndConditionsURL() {
		this.currentLocale = this._accountService.getLocaleId();
		if (this.currentLocale == 'nl') {
			this.termsHref = `${environment.homeUrl}/${this.termsAndCondition}`;
		} else {
			this.termsHref = `${environment.homeUrl}/${this.currentLocale}/${this.termsAndCondition}`;
		}
	}

	setPrimaryColorForCustomBranding() {
		// Set primary color from custom style for Select Amount to show correct branding color

		if (
			this.currentFundraiserConfig?.customdonationconfiguration?.primary_color
		) {
			this.primaryColor =
				this.currentFundraiserConfig?.customdonationconfiguration?.primary_color;
		}
	}

	getDonationConfig(slug: string, currency_code: string = 'eur') {
		this.isPageDataLoaded = false;
		this.donationService
			.getDonationConfigurationOfFundraiser(slug, currency_code)
			.subscribe((response: any) => {
				this.currentFundraiserConfig = response?.data;
				this.tip_details = response?.data?.tip_amount;
				this.isPageDataLoaded = true;
				this.setDefaultPayPeriod();
				this.setDefaultTipAmount();
				this.setDefaultPaymentValues();
				this.setPrimaryColorForCustomBranding();
			});
	}

	setDefaultPayPeriod() {
		// SET DEFAULT PAY PERIOD
		if (
			this.currentFundraiserConfig.customdonationconfiguration.onetime
				.onetime_select
		) {
			this.pay_period = 'once';
		} else if (
			this.currentFundraiserConfig.customdonationconfiguration.monthly
				.monthly_select
		) {
			this.pay_period = 'monthly';
		} else if (
			this.currentFundraiserConfig.customdonationconfiguration.yearly
				.yearly_select
		) {
			this.pay_period = 'yearly';
		}
	}

	setDefaultTipAmount() {
		// SET DEFAULT TIP AMOUNT
		if (this.currentFundraiserConfig?.fundraiser_data?.tip_enabled) {
			this.isTipEnabled = true;
			if (this.isTipInPercentage) {
				this.tipValue =
					this.tip_details?.default_values?.tip_amount_percentage_default;
			} else {
				this.tipValue =
					this.tip_details?.default_values?.tip_amount_fixed_default;
			}
		}
	}

	/** *Setting Value from query selector to ngModel */
	setQueryValue() {
		this.selectedDonationAmount = parseInt(this.queryAmount);
		// this.isAmountOtherSelected = true;
		this.isTipEnabled = true;
		this.tipValue = '15';
		this.calculateFinalDonationAmount();
	}

	setDefaultPaymentValues() {
		//SET DEFAULT PAYMENT VALUES
		this.tipAmount = 0;
		this.selectedDonationAmount = 0;
		this.totalAmount = 0;
		this.isValidAmount = false;
	}

	// EVENT FOR DONATION TAB CHANGE
	donationTabChanged(tabChangeEvent: MatTabChangeEvent): void {
		this.setDefaultPaymentValues();
		//Tackling the translated tab issue for stripe
		let tabLabel = tabChangeEvent.tab.textLabel.toLowerCase();
		switch (tabLabel) {
			case 'eenmalig':
			case 'einmalig':
			case 'una vez':
			case 'une fois':
			case 'one time':
				this.pay_period = 'once';
				this.setDefaultButtonStyle(this.elementIdsOnetime);
				break;
			case 'maandelijks':
			case 'monatlich':
			case 'mensual':
			case 'mensuel':
			case 'monthly':
				this.pay_period = 'monthly';
				this.setDefaultButtonStyle(this.elementIdsMonthly);
				break;
			case 'jaarlijks':
			case 'jährlich':
			case 'anualmente':
			case 'annuel':
			case 'yearly':
				this.pay_period = 'yearly';
				this.setDefaultButtonStyle(this.elementIdsYearly);
				break;
			default:
				this.pay_period = 'once';
				this.setDefaultButtonStyle(this.elementIdsOnetime);
				break;
		}
	}

	/*
	 * Function to start donation
	 */
	makeDonation() {
		this.isLoading = true;
		// Calculate the final amount
		this.calculateFinalDonationAmount();

		// Generate return URL
		let returnURL: string = '';
		if (this.isBrowser) {
			returnURL =
				window.location.protocol +
				'//' +
				window.location.hostname +
				'/' +
				this.accountService.getLocaleId() +
				'/donate/check-payment-status/';

			//=========================================================/
			// Change return URL for localhost, **For dev purpose only
			if (window.location.hostname == 'localhost') {
				returnURL =
					window.location.protocol +
					'//' +
					window.location.hostname +
					':' +
					window.location.port +
					'/donate/check-payment-status/';
			}
		}

		//=========================================================/

		//**Generate donation payload
		//**IMPORTANT: AMOUNT NEEDS TO BE CONVERTED TO CENTS TO WORK WITH OPP
		let donationPayload: any = {
			fundraising_local_id: this.currentFundraiserConfig?.fundraiser_data?.id,
			currency_code: this.selectedCurrency?.currency,
			lang: this._accountService.getLocaleId(),
			description: this.currentFundraiserConfig?.fundraiser_data?.title,
			bank_account: '',
			return_url: returnURL,
			amount: this.selectedDonationAmount,
			tip: this.tipValue.toString(),
			is_tip_enabled: this.isTipEnabled,
			tip_percentage: this.tipValue,
			tip_amount: this.tipAmount,
			other_tip_amount: parseFloat(this.tipValue) > 0 ? 1 : this.tipAmount,
			source: 'web',
			pay_period: this.pay_period,
			is_anonymous: false,
			newsletter: false,
		};

		//CHECK IF A USER IS LOGGED IN
		this.accountService.getLoginInformation().subscribe((response) => {
			if (response) {
				let userString: string = '';
				if (this.isBrowser) userString = localStorage.getItem('user') || '';
				if (
					userString != null &&
					userString != undefined &&
					userString.length > 0
				) {
					let user = JSON.parse(userString);
					donationPayload['first_name'] = user.first_name;
					donationPayload['last_name'] = user.last_name;
					donationPayload['email'] = user.email;
					donationPayload['is_anonymous'] = false;
				}
			}
		});

		this.donationService.makeDonation(donationPayload).subscribe(
			(res: any) => {
				this.donationMadeResponse = res;
				this.newResponse.emit(this.donationMadeResponse);
				try {
					if (this.isBrowser) {
						localStorage.setItem(
							'transactionId',
							res['data']['transaction_id']
						);
						localStorage.setItem('paymentId', res['data']['id']);
						localStorage.setItem(
							'expireTime',
							String(new Date().getHours() + 1)
						);
					}
				} catch (error) {
				} finally {
					if (this.isBrowser) window.location.href = res?.data?.url;
				}
			},
			(error) => {
				this.isLoading = false;
				this.notificationService.openNotification(
					$localize`:@@donation_form_errorOcurred_notification:An error occured`,
					'OK',
					'error'
				);
			}
		);
	}

	/*
	 * Function to calculate total donation amount
	 */

	calculateFinalDonationAmount() {
		if (this.tipAmount < 0) {
			this.tipAmount = 0;
		}
		if (this.isTipEnabled) {
			if (!this.isTipOtherSelected) {
				// Check if tip is in percentage or absolute
				if (this.isTipInPercentage) {
					this.tipAmount =
						(parseFloat(this.tipValue) * this.selectedDonationAmount) / 100;
					this.tipAmount = Math.round(this.tipAmount * 100) / 100;
					this.totalAmount = this.tipAmount + this.selectedDonationAmount;
				} else {
					this.tipAmount = Math.round(parseFloat(this.tipValue) * 100) / 100;
					this.totalAmount =
						Math.round((this.tipAmount + this.selectedDonationAmount) * 100) /
						100;
				}
			} else {
				this.tipAmount = Math.round(this.tipAmount * 100) / 100;
				this.totalAmount =
					Math.round((this.tipAmount + this.selectedDonationAmount) * 100) /
					100;
			}
		} else {
			this.totalAmount = this.selectedDonationAmount;
		}

		// If amount is greater than zero, enable donate button
		if (
			this.totalAmount >=
				this.currentFundraiserConfig.customdonationconfiguration
					.min_donation_amount &&
			this.totalAmount <=
				this.currentFundraiserConfig.customdonationconfiguration
					.max_donation_amount &&
			this.selectedDonationAmount >=
				this.currentFundraiserConfig.customdonationconfiguration
					.min_donation_amount
		) {
			this.isValidAmount = true;
		} else {
			this.isValidAmount = false;
		}
	}

	setDonationAmount2(value: string, elementid: string, period: string) {
		if (!elementid.includes('Other')) {
			this.isAmountOtherSelected = false;
		}

		this.setSelectedButtonStyle(elementid);
		this.setUnselectedButtonStyle(elementid, period);
		this.selectedDonationAmount = parseFloat(value);

		if (
			this.selectedDonationAmount >=
			this.tip_details?.default_values?.tip_type_deciding_amount
		) {
			this.isTipInPercentage = true;
		} else {
			this.isTipInPercentage = false;
		}
		this.setDefaultTipValue();

		this.calculateFinalDonationAmount();
	}

	/**
	 * Function to set default tip values
	 */
	setDefaultTipValue() {
		// SET DEFAULT TIP AMOUNT
		if (this.currentFundraiserConfig?.fundraiser_data?.tip_enabled) {
			this.isTipEnabled = true;
			this.isTipOtherSelected = false;
			if (this.isTipInPercentage) {
				this.tipValue =
					this.tip_details?.default_values?.tip_amount_percentage_default;
			} else {
				this.tipValue =
					this.tip_details?.default_values?.tip_amount_fixed_default;
			}
		}
	}

	// STYLING METHODS------------------------------------------------------------------------------------------------------

	setSelectedButtonStyle(elementid: string) {
		let button: any;
		if (this.isBrowser) button = document.getElementById(elementid);
		if (button != null) {
			button!.className = 'mat-flat-button mat-primary';
		}
	}

	setUnselectedButtonStyle(elementid: string, period: string) {
		let remainingButtonIds: string[] = [];
		switch (period) {
			case 'onetime':
				remainingButtonIds = this.elementIdsOnetime.filter(
					(element) => element != elementid
				);
				break;

			case 'monthly':
				remainingButtonIds = this.elementIdsMonthly.filter(
					(element) => element != elementid
				);
				break;

			case 'yearly':
				remainingButtonIds = this.elementIdsYearly.filter(
					(element) => element != elementid
				);
				break;
		}

		remainingButtonIds.forEach((elementid) => {
			let button: any;
			if (this.isBrowser) button = document.getElementById(elementid);
			if (button != null && button.className != null) {
				button.className = 'mat-stroked-button';
			}
		});
	}

	setDefaultButtonStyle(buttonIds: string[]) {
		buttonIds.forEach((elementid) => {
			let button: any;
			if (this.isBrowser) button = document.getElementById(elementid);
			if (button != null && button.className != null) {
				button.className = 'mat-stroked-button';
			}
		});
	}

	/*
	 * Other Buttons
	 */

	checkAmountOtherButton2(elementid: string, period: string) {
		this.setSelectedButtonStyle(elementid);
		this.setUnselectedButtonStyle(elementid, period);
		this.isAmountOtherSelected = true;
	}

	checkTipOtherButton() {
		this.isTipOtherSelected = !this.isTipOtherSelected;
		this.tipAmount = this.tip_details?.default_values?.tip_amount_fixed_default;
		this.calculateFinalDonationAmount();
	}

	setTipOtherFalse(tipValue: string) {
		this.isTipOtherSelected = false;
		this.tipValue = tipValue;
		this.calculateFinalDonationAmount();
	}

	/*
	 * route to terms & payment
	 */
	routeToTerms() {
		if (this.isBrowser) window.open(this.termsHref, '_blank');
	}

	// UTILITY METHODS------------------------------------------------------------------------------------------------------
	restrictToNumeric(event: any) {
		const input = event.target;
		const value = input.value.replace(/[^0-9]/g, '');
		this.tipAmount = value;
	}
}
