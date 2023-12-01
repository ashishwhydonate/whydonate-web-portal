/**This component provides dashboard view of the registered user */

import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { DashboardService } from '../../services/dashboard.service';
import { FundraiserCardService } from 'src/app/shared/services/fundraiser-card.service';
import { APIService } from 'src/app/global/services/api.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomBrandingService } from '../../../custom-branding/services/custom-branding.service';
import { BankService } from '../../../profile/services/bank.service';
import { ProfileService } from '../../../profile/services/profile.service';
import { BalanceService } from '../../../balance/balance.service';
import { HttpParams } from '@angular/common/http';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { CurrencySelectorService } from 'src/app/shared/services/currency-selector.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
})
/** *Dashboard Component */
export class DashboardComponent implements OnInit {
	profileResponse: any;
	balanceResponse: any;
	myFundraisersResponse: any;
	donationGivenResponse: any;
	donationReceivedResponse: any;
	donationRecurringReceivedResponse: any;
	donationRecurringGivenResponse: any;

	stepsToDoObj: any;
	profileCardObj: any;
	myFundraisersObj: any = {};
	myFundraisersCount!: number;
	donationReceivedObj!: any;
	donationGivenObj!: any;
	donationRecurringReceivedObj: any;
	donationRecurringGivenObj: any;
	subscription: Subscription | any;
	oldBalanceTotal: number = 0;
	stripeNotificationCheck: boolean = true;
	stripeStatus: any = {};
	parentFundraiser!: number;
	currency: any;
	constructor(
		public _dashboardService: DashboardService,
		public _APIService: APIService,
		private _fundraiserCardService: FundraiserCardService,
		public _media: MediaObserver,
		private _router: Router,
		private _customBrandingService: CustomBrandingService,
		public _profileService: ProfileService,
		public _balanceService: BalanceService,
		public _bankService: BankService,
		public _accountService: AccountService,
		public currencyService: CurrencySelectorService
	) {}

	ngOnInit(): void {
		this.currency = this.currencyService.getSelectedCurrency();
		this.currencyService.selectedCurrency.subscribe((res: any) => {
			if (this._accountService.checkHeaders()) {
				/** *Get Stripe Verification Check to Show Notification Bar */
				this._bankService.getStripeStatus().subscribe((res: any) => {
					this.stripeStatus = res?.data;
					//Checking that either user is verified with Stripe or not
					if (
						this.stripeStatus?.charges_enabled == true &&
						this.stripeStatus?.payout_enabled == true &&
						this.stripeStatus?.details_submitted == true
					) {
						this.stripeNotificationCheck = true;
					} else {
						this.stripeNotificationCheck = false;
					}
				});
				this.setDashboardData();
				this._dashboardService
					.getFundraiserSummary()
					.subscribe((response: any) => {
						this.parentFundraiser = response.data.parent;
					});
			}
		});
	}

	//check if obj or obj.donationReceived is undefined and then use an optional chaining operator when accessing the donationReceived property to avoid the TypeError if it is undefined
	removeUndefined(obj: any) {
		if (!obj || !obj.donationReceived) {
			return obj;
		}
		let x = obj.donationReceived?.filter(function (val: any) {
			return val.status !== 'undefined';
		});
		obj.donationReceived = x;
		return obj;
	}

	/** *Set Dashboard data function, 4 UI component are populated with API responses */
	setDashboardData() {
		if (this._accountService.checkHeaders()) {
			/** *(1) Profile card */
			/** *Get profile for profile card */

			this._dashboardService.getProfile().subscribe(
				(res: any) => {
					/** *Success */
					this.profileResponse = res.data;
					this._customBrandingService.setIsReceived(
						this.profileResponse?.profile?.is_receiver
					);
				},
				(error) => {
					this._APIService.handleError(error).subscribe(
						() => {},
						(errorMessage) => {
							console.log('ERROR', errorMessage);
						}
					);
				}
			);
		}
	}
}
