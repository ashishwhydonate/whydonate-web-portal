/**This component provides profile view of registered user in their dashboard */

import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomBrandingService } from 'src/app/pages/user/custom-branding/services/custom-branding.service';
import { DashboardService } from '../../../services/dashboard.service';
import { BankService } from 'src/app/pages/user/profile/services/bank.service';
import { ProfileService } from 'src/app/pages/user/profile/services/profile.service';
import { BalanceService } from 'src/app/pages/user/balance/balance.service';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { CurrencySelectorService } from 'src/app/shared/services/currency-selector.service';
import { platform } from 'os';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-profile-view',
	templateUrl: './profile-view.component.html',
})
/** *Profile View Component */
export class ProfileViewComponent implements OnInit {
	@Input() profileCard!: any;
	profileCardData: any;
	isReceiver: boolean = false;
	oppVerificationCheck: boolean = false;
	firstDonationReceived: any;
	activeOPPDonationCount: any;
	stripeStatus: any;
	showOpp: boolean = false;
	showStripe: boolean = false;
	chargesEnabled: any;
	payoutEnabled: any;
	detailsSubmitted: any;
	stripePrompt: boolean = false;
	stripeBalanceTotal: string | number = 0;
	stripeBalanceAvailable: number = 0;
	stripeBalancePending: number = 0;
	user: any;
	isBrowser: boolean = false;
	currency: any;
	constructor(
		private router: Router,
		private _dashboardService: DashboardService,
		private _customBrandingService: CustomBrandingService,
		public _bankService: BankService,
		public _profileService: ProfileService,
		public _balanceService: BalanceService,
		public _accountService: AccountService,
		public currencyService: CurrencySelectorService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	ngOnInit(): void {
		this.currency = this.currencyService.getSelectedCurrency();

		this.currencyService.selectedCurrency.subscribe((res) => {
			this.currency = this.currencyService.getSelectedCurrency();
			if (this._accountService.checkHeaders()) {
				this._dashboardService.currentObject.subscribe((res) => {
					this.profileCardData = res;
				});
				if (this.isBrowser) this.user = localStorage.getItem('user');

				//Getting status that either user created the fundraiser or not
				this._customBrandingService
					.getIsReceived()
					.subscribe((receivedValue: boolean) => {
						this.isReceiver = receivedValue;
					});

				//Getting status to check that either user is registerd with stripe or not
				this._bankService.getStripeStatus().subscribe((res: any) => {
					this.stripeStatus = res?.data;
					this.chargesEnabled = this.stripeStatus?.charges_enabled;
					this.payoutEnabled = this.stripeStatus?.payout_enabled;
					this.detailsSubmitted = this.stripeStatus?.details_submitted;
					if (
						this.chargesEnabled == true &&
						this.payoutEnabled == true &&
						this.detailsSubmitted == true
					) {
						this.stripePrompt = true;
						this._bankService.changNotificationStatus(true); //Stripe Notification Banner Check
					} else {
						this.stripePrompt = false;
						this._bankService.changNotificationStatus(false);
					}

					//Checking that either user is registered with OPP or not
					this._bankService.getPersonalVerification().subscribe((res: any) => {
						if (res?.errors?.code === '1005') {
							this.oppVerificationCheck = false;
						} else {
							this.oppVerificationCheck = true;
						}

						//Getting the Donation Count to check that first donation is received or not
						this._profileService.getDonationCount().subscribe((res: any) => {
							this.firstDonationReceived = res?.data?.first_donation_received;
							//Getting the Donation Count to check that recurring donation is in progress or not
							//Maintaing a check for all the scenarios (OPP/STRIPE/BOTH)
							if (
								this.firstDonationReceived === 0 &&
								this.stripeStatus.details_submitted === false &&
								this.oppVerificationCheck === true
							) {
								this.showOpp = true; //WIll SHOW OPP and Stripe
							} else if (
								this.firstDonationReceived === 1 &&
								this.stripeStatus.details_submitted === true &&
								this.oppVerificationCheck === true
							) {
								this.showOpp = true; //Will SHOW Stripe & OPP
								this.showStripe = true; //Will SHOW Stripe & OPP
								this.getStripeBalance();
							} else if (
								this.firstDonationReceived === 1 &&
								this.stripeStatus.details_submitted === false &&
								this.oppVerificationCheck === true
							) {
								this.showStripe = true;
								this.showOpp = true;
								this.getStripeBalance();
							} else {
								this.getStripeBalance();
							}

							//Zaraz
							if (this.firstDonationReceived === 1) {
								if (this.isBrowser)
									(window as any)?.zaraz?.track('first_donation_received', {
										user_id: JSON.parse(this.user)?.id,
									});
							}
						});
					});
				});
			}
		});
	}

	//Getting Stripe Balance
	getStripeBalance() {
		if (this._accountService.checkHeaders()) {
			this._balanceService
				.getStripeBalance(this.currency?.currency)
				.subscribe((res: any) => {
					this.stripeBalanceAvailable = parseFloat(res?.data?.available) || 0;
					this.stripeBalancePending = parseFloat(res?.data?.pending) || 0;
					this.stripeBalanceTotal = (
						this.stripeBalanceAvailable + this.stripeBalancePending
					).toFixed(2);
					if (this.stripeBalanceAvailable + this.stripeBalancePending > 0) {
						this.showStripe = true;
					}
				});
		}
	}

	/** *Route To Profile */
	routeToProfile() {
		this.router.navigate(['profile']);
	}
	/** *Route To Balance */
	routeToBalance() {
		this.router.navigate(['balance']);
	}
}
