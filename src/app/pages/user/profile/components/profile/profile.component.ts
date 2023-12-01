/**This component provides access to registered user profile */

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BalanceService } from '../../../balance/balance.service';
import { BankService } from '../../services/bank.service';
import { ProfileService } from '../../services/profile.service';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { CurrencySelectorService } from 'src/app/shared/services/currency-selector.service';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
})
/** *Profile Component */
export class ProfileComponent implements OnInit {
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	profile: any;
	profileName!: string;
	profileImage!: string;
	hideSideBar: boolean;
	isReceiver: boolean = false;

	sub!: Subscription;
	routeSelected: string;
	profile_routes: any;
	profileLoader: boolean = false;
	complianceStatus: any;
	reservedAmount: any;
	totalBalance: any;
	donationReceived: any;
	verificationIdentityCheck: boolean = false;
	stripeNotificationCheck: boolean = true;
	stripeStatus: any = {};
	parentFundraiser!: number;
	currency: any;
	/**
	 * Constructor
	 */
	constructor(
		private _route: ActivatedRoute,
		private _changeDetectorRef: ChangeDetectorRef,
		public _media: MediaObserver,
		private _profileService: ProfileService,
		private _bankService: BankService,
		private _balanceService: BalanceService,
		public _dashboardService: DashboardService,
		public _accountService: AccountService,
		public currencyService: CurrencySelectorService
	) {
		this.routeSelected = 'account';
		this.sub = this._route.data.subscribe(
			(v) => (this.routeSelected = v.route)
		);

		/** *Set default value */
		this.hideSideBar = true;

		/** *Set the default value to show bank details */

		this.profile_routes = [
			{
				name: $localize`:@@profile_personalDetails_label:Personal Details`,
				route: 'account',
				id: 'personalDetails',
			},
			// {
			// 	name: $localize`:@@profile_bankAccountDetails_label:Bank Account Details`,
			// 	route: 'bank',
			// 	id: 'bankAccountDetails',
			// },
			{
				name: $localize`:@@profile_payoutSettings:Payout Settings`,
				route: 'payout-settings',
				id: 'payout-settings',
			},
			{
				name: $localize`:@@profile_apiKey_label:API Key`,
				route: 'api',
				id: 'apiKey',
			},
			{
				name: $localize`:@@profile_emailSettings_label:Email Settings`,
				route: 'email',
				id: 'emailSettings',
			},
			{
				name: $localize`:@@profile_deactivateAccount_label:Deactive Account`,
				route: 'deactivate',
				id: 'deactiveAccount',
			},
		];
	}

	/** *----------------------------------------------------------------------------------------------------- */
	/** *@ Lifecycle hooks */
	/** *----------------------------------------------------------------------------------------------------- */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.currency = this.currencyService.getSelectedCurrency();

		this.currencyService.selectedCurrency.subscribe((res: any) => {
			if (this._accountService.checkHeaders()) {
				this.currency = this.currencyService.getSelectedCurrency();
				/** *Get Stripe Verification Check to Show Notification Bar */
				this._bankService.getStripeStatus().subscribe((res: any) => {
					this.stripeStatus = res?.data;

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

				this._bankService.stripeNotification.subscribe((res: any) => {
					console.log('response of stripe notification', res);
				});
				/** *Get user profile details */
				this.profileLoader = true;
				this.getUserProfile();

				/** *Update the sidebar view with the latest profile */
				this._profileService.profileUpdate
					.pipe(takeUntil(this._unsubscribeAll)) // Unsubscribe
					.subscribe((profile: any) => {
						if (profile) {
							/** *Update the the profile name */
							this.profileName = profile.data.name;

							/** *Update the the profile image */
							this.profileImage = profile.data.image;

							/** *Mark for check */
							this._changeDetectorRef.markForCheck();
						}
					});

				this._bankService.getPersonalVerification().subscribe((res: any) => {
					this.complianceStatus = res.data.status;
					this._balanceService
						.getTotalBalance(this.currency?.currency)
						.subscribe((balance: any) => {
							this.reservedAmount = balance?.data?.balance?.amount_reserved;
							this.totalBalance = balance?.data?.balance?.amount / 100;
							this.donationReceived =
								this.totalBalance + this.reservedAmount || 0;
							if (
								this.complianceStatus == 'unverified' &&
								this.donationReceived >= 1500
							) {
								this.verificationIdentityCheck = true;
							} else {
								this.verificationIdentityCheck = false;
							}
						});
				});
				this.currency = res?.currency;
				this._dashboardService
					.getFundraiserSummary()
					.subscribe((response: any) => {
						this.parentFundraiser = response.data.parent;
					});
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

	/** *----------------------------------------------------------------------------------------------------- */
	/** *@ Public methods */
	/** *----------------------------------------------------------------------------------------------------- */

	/**
	 * Get logged in user profile
	 */
	getUserProfile() {
		this._profileService
			.getProfile()
			.pipe(takeUntil(this._unsubscribeAll)) // Unsubscribe
			.subscribe((profile: any) => {
				// Update the profile
				this.profile = profile;
				this._profileService.setProfileObj = this.profile?.data?.profile;

				// get the status of the receiver
				this.isReceiver = profile?.data?.profile?.is_receiver;

				// Getting the value of donation count
				this._profileService.getDonationCount().subscribe((res: any) => {
					if (
						this.isReceiver == true &&
						res?.data?.first_donation_received == 1
					) {
					} else {
						const index = this.profile_routes.findIndex(
							(item: any) => item.route === 'personal-verification'
						);

						if (index !== -1) {
							this.profile_routes.splice(index, 1);
						}
					}
				});
				// Remove the bank links is the user is not receiver
				//Payout Settings Redirection Logic
				if (!this.isReceiver) {
					const index = this.profile_routes.findIndex(
						(item: any) => item.route === 'payout-settings'
					);

					if (index !== -1) {
						this.profile_routes.splice(index, 1);
					}
				}
				this.profileLoader = false;
				console.log('Profile loader', this.profileLoader);
				// Update the the profile name
				this.profileName = profile.data?.profile?.name;

				// Update the the profile image
				this.profileImage = profile.data?.profile?.image;

				// Mark for check
				this._changeDetectorRef.markForCheck();
			});
	}
}
