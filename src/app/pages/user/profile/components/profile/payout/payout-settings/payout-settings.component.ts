import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Inject,
	OnInit,
	Output,
	PLATFORM_ID,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { BankService } from '../../../../services/bank.service';
import { ProfileService } from '../../../../services/profile.service';
import { BalanceService } from 'src/app/pages/user/balance/balance.service';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-payout-settings',
	templateUrl: './payout-settings.component.html',
	styleUrls: ['./payout-settings.component.scss'],
})
/** *Payout Settings Component */
export class PayoutSettingsComponent implements OnInit, AfterViewInit {
	stripeStatus: any = {}; //Empth Object for Stripe Status
	tempBoolean: boolean = false;
	interval: FormControl = new FormControl(); //Interval variable for setting the payout interval
	state: FormControl = new FormControl();
	isLoading: boolean = false;
	stripeVerificationCheck: boolean = false;
	stripeDashboardCheck: boolean = false;
	stripeDashboardDisabled: boolean = false;
	anchorsFiltered: any = [];
	selectedInterval: any = '';
	selectedAnchor: any = '';
	currentRoute = 'payout-settings';
	chargesEnabled!: boolean;
	payoutEnabled!: boolean;
	detailsSubmitted!: boolean;
	firstDonationReceived: number = 0;
	stripePrompt!: boolean;
	merchantOnboardingData: any = {};
	oppVerificationCheck!: boolean;
	stripeScenarioACheck!: boolean;
	showStripeAndOpp: boolean = false; //status maintaining for stripe and opp
	showStripeOnly: boolean = false; //status maintaining for stripe only
	showOppOnly: boolean = false; //status maintaining for opp only
	@Output() stripeNotification = new EventEmitter<boolean>();
	activeOPPDonationCount: any = {};
	manualCheck: boolean = false;
	payoutScheduledInterval: string = '';
	payoutScheduledAttribute: string = '';
	first: boolean = true;
	second: boolean = true;
	third: boolean = false;
	user: any;

	changedIntervalValue: any;
	userIntervalValue: any;
	changedStateValue: any;
	userStateValue: any;
	valueIntialized: boolean = false;
	isBrowser: boolean = false;
	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private _bankService: BankService,
		private _notificationService: NotificationService,
		private _profileService: ProfileService,
		private _balanceService: BalanceService,
		private _accountService: AccountService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	/** *Payout schedule Dropdown list data */
	payoutScheduleData: any = {
		List: [
			{
				id: 0,
				displayName: $localize`:@@payout_settings_payout_schedule_monthly_interval:monthly`,
				intervalName: 'monthly',
				States: [
					{
						id: 0,
						anchorName: '1',
						displayName: '1',
					},
					{
						id: 1,
						anchorName: '2',
						displayName: '2',
					},
					{
						id: 2,
						anchorName: '3',
						displayName: '3',
					},
					{
						id: 3,
						anchorName: '4',
						displayName: '4',
					},
					{
						id: 4,
						anchorName: '5',
						displayName: '5',
					},
					{
						id: 5,
						anchorName: '6',
						displayName: '6',
					},
					{
						id: 6,
						anchorName: '7',
						displayName: '7',
					},
					{
						id: 7,
						anchorName: '8',
						displayName: '8',
					},
					{
						id: 8,
						anchorName: '9',
						displayName: '9',
					},
					{
						id: 9,
						anchorName: '10',
						displayName: '10',
					},
					{
						id: 10,
						anchorName: '11',
						displayName: '11',
					},
					{
						id: 11,
						anchorName: '12',
						displayName: '12',
					},
					{
						id: 12,
						anchorName: '13',
						displayName: '13',
					},
					{
						id: 13,
						anchorName: '14',
						displayName: '14',
					},
					{
						id: 14,
						anchorName: '15',
						displayName: '15',
					},
					{
						id: 15,
						anchorName: '16',
						displayName: '16',
					},
					{
						id: 16,
						anchorName: '17',
						displayName: '17',
					},
					{
						id: 17,
						anchorName: '18',
						displayName: '18',
					},
					{
						id: 18,
						anchorName: '19',
						displayName: '19',
					},
					{
						id: 19,
						anchorName: '20',
						displayName: '20',
					},
					{
						id: 20,
						anchorName: '21',
						displayName: '21',
					},
					{
						id: 21,
						anchorName: '22',
						displayName: '22',
					},
					{
						id: 22,
						anchorName: '23',
						displayName: '23',
					},
					{
						id: 23,
						anchorName: '24',
						displayName: '24',
					},
					{
						id: 24,
						anchorName: '25',
						displayName: '25',
					},
					{
						id: 25,
						anchorName: '26',
						displayName: '26',
					},
					{
						id: 26,
						anchorName: '27',
						displayName: '27',
					},
					{
						id: 27,
						anchorName: '28',
						displayName: '28',
					},
					{
						id: 28,
						anchorName: '29',
						displayName: '29',
					},
					{
						id: 29,
						anchorName: '30',
						displayName: '30',
					},
					{
						id: 30,
						anchorName: '31',
						displayName: '31',
					},
				],
			},
			{
				id: 1,
				displayName: $localize`:@@payout_settings_payout_schedule_weekly_interval:weekly`,
				intervalName: 'weekly',
				States: [
					{
						id: 0,
						displayName: $localize`:@@payout_settings_payment_schedule_monday_attribute:monday`,
						anchorName: 'monday',
					},
					{
						id: 1,
						displayName: $localize`:@@payout_settings_payment_schedule_tuesday_attribute:tuesday`,
						anchorName: 'tuesday',
					},
					{
						id: 2,
						displayName: $localize`:@@payout_settings_payment_schedule_wednesday_attribute:wednesday`,
						anchorName: 'wednesday',
					},
					{
						id: 3,
						displayName: $localize`:@@payout_settings_payment_schedule_thursday_attribute:thursday`,
						anchorName: 'thursday',
					},
					{
						id: 4,
						displayName: $localize`:@@payout_settings_payment_schedule_friday_attribute:friday`,
						anchorName: 'friday',
					},
					{
						id: 5,
						displayName: $localize`:@@payout_settings_payment_schedule_saturday_attribute:saturday`,
						anchorName: 'saturday',
					},
					{
						id: 6,
						displayName: $localize`:@@payout_settings_payment_schedule_sunday_attribute:sunday`,
						anchorName: 'sunday',
					},
				],
			},
		],
	};

	ngOnInit() {
		if (this.isBrowser) this.user = localStorage.getItem('user');
		this._bankService.getStripeStatus().subscribe((res: any) => {
			if (
				res.data.status === 'rejected.other' ||
				res.data.status === 'rejected.terms_of_service' ||
				res.data.status === 'rejected.fraud'
			)
				this.stripeDashboardDisabled = true;
		});

		//Business logic to maintain the selected value from the dropdown in Schedule Payout Section
		this.interval.valueChanges.subscribe((interval: any) => {
			this.selectedInterval = interval;
			this.anchorsFiltered = [];
			this.changeDetectorRef.detectChanges();

			//  the object in the List array that matches the selected interval
			const matchingInterval = this.payoutScheduleData.List.find(
				(item: any) => item.intervalName === this.selectedInterval
			);

			// Checking if a matching interval was found
			if (matchingInterval) {
				//To Set the default value after the user changes values for interval
				if (this.valueIntialized) {
					// console.log(this.userStateValue,this.userIntervalValue,matchingInterval,matchingInterval != this.userIntervalValue,matchingInterval.displayName )
					if (matchingInterval.displayName != this.userIntervalValue) {
						this.state.setValue(
							matchingInterval.States['0'].anchorName.toString()
						);
						this.tempBoolean = true;
					} else {
						this.state.setValue(this.userStateValue.toString());
						this.tempBoolean = false;
					}
				}

				this.anchorsFiltered = matchingInterval.States;
			} else {
				//  setting the anchorsFiltered array to an empty array
				this.anchorsFiltered = [];
			}
		});

		this.state.valueChanges.subscribe((anchor: any) => {
			this.selectedAnchor = anchor;
		});
	}
	ngAfterViewInit(): void {
		if (this._accountService.checkHeaders()) {
			/** *Getting the value of payout to autofill the payout dropdown */
			this._balanceService.getPayoutSchedule().subscribe((res: any) => {
				this.payoutScheduledInterval = res?.data?.interval;
				this.payoutScheduledAttribute = res?.data?.attribute;
				//console.log('payoutScheduledDate', res.data);
				this.selectedInterval = res?.data?.interval;
				this.selectedAnchor = res?.data?.attribute;
				this.interval.setValue(this.selectedInterval);
				this.state.setValue(this.selectedAnchor?.toString());

				this.userIntervalValue = this.selectedInterval;
				this.userStateValue = this.selectedAnchor?.toString();
				this.valueIntialized = true;
			});

			/** *Getting the value of stripe status to maintain different scenarios*/
			this._bankService.getStripeStatus().subscribe((res: any) => {
				this.stripeStatus = res?.data;
				console.log('status', this.stripeStatus);
				this.chargesEnabled = this.stripeStatus?.charges_enabled;
				this.payoutEnabled = this.stripeStatus?.payout_enabled;
				this.detailsSubmitted = this.stripeStatus?.details_submitted;

				/** *Checking that either user is verified with stripe or not */
				if (
					this.chargesEnabled == true &&
					this.payoutEnabled == true &&
					this.detailsSubmitted == true
				) {
					this.stripePrompt = true;
					this._bankService.changNotificationStatus(true); //Stripe Notification Banner Check to show the notification

					//Zaraz
					if (this.isBrowser)
						(window as any).zaraz?.track('stripe_verified', {
							user_id: JSON.parse(this.user)?.id,
						});
				} else {
					this.stripePrompt = false;
					this._bankService.changNotificationStatus(false);
				}
				this._bankService.changNotificationStatus(this.stripePrompt);

				/** *Checking that either user is verified with OPP or not */
				this._bankService.getPersonalVerification().subscribe((res: any) => {
					if (res?.errors?.code === '1005') {
						this.oppVerificationCheck = false;
					} else {
						this.oppVerificationCheck = true;
					}

					/** *getting the value of donation count to maintain first donation received*/
					this._profileService.getDonationCount().subscribe((res: any) => {
						this.firstDonationReceived = res?.data?.first_donation_received;

						//Maintaing all the scenarios with these checks that either to show OPP,stripe or both.
						if (
							this.firstDonationReceived === 0 &&
							this.stripeStatus.details_submitted === false &&
							this.oppVerificationCheck === true
						) {
							console.log('IF');
							this.showStripeAndOpp = true; //Will show OPP & Stripe
						} else if (
							this.firstDonationReceived === 1 &&
							this.stripeStatus.details_submitted === true &&
							this.oppVerificationCheck === true
						) {
							console.log('ELSEIF');
							this.showStripeAndOpp = true; //Will show Stripe & OPP
						} else if (
							this.firstDonationReceived === 1 &&
							this.stripeStatus.details_submitted === false &&
							this.oppVerificationCheck === true
						) {
							this.showStripeAndOpp = true;
						} else {
							console.log('ELSE');
							this.showStripeOnly = true;
						}
					});
				});
			});
		}
	}
	/*
	 * Flag To Disable Save Schedule Button
	 */
	flagValue() {
		this.tempBoolean = true;
	}

	/** *Save Payout Schedule*/
	saveSchedule() {
		let scheduleObj;
		this.isLoading = true;

		if (this.manualCheck == true) {
			scheduleObj = {
				interval: 'manual',
				attribute: '',
			};
		} else {
			scheduleObj = {
				interval: this.selectedInterval,
				attribute: this.selectedAnchor,
			};
		}

		this._bankService.schedulePayout(scheduleObj).subscribe((res: any) => {
			this._notificationService.openNotification(
				$localize`:@@payout_settings_payout_schedule_success_notification:Payout Scheduled Successfully`,
				'OK',
				'success'
			);
			this.isLoading = false;
		});
	}

	/** *Verification With Stripe */
	verifyWithStripe() {
		// let newTab = window.open();
		this.stripeVerificationCheck = true;
		this.isLoading = true;

		//Generate Url
		let returnURL: string = '';
		if (this.isBrowser)
			returnURL =
				window.location.protocol +
				'//' +
				window.location.hostname +
				'/' +
				this._accountService.getLocaleId() +
				'/profile/payout-settings';

		//=========================================================/
		// Change return URL for localhost, **For dev purpose only
		if (this.isBrowser)
			if (window.location.hostname == 'localhost') {
				returnURL = 'http://localhost:4200/profile/payout-settings';
			}

		//  Creating Obj for Editing Bank Account Details
		let obj: any = {
			return_url: returnURL,
		};

		//Redirecting To Stripe Verification Link
		if (this._accountService.checkHeaders()) {
			this._bankService
				.redirectToStripeVerification(obj)
				.subscribe((res: any) => {
					this.isLoading = false;
					// if (newTab != null) {
					if (this.isBrowser)
						if (window.open != null) {
							window.location.replace(res?.data?.url);
						} else {
							window.alert('Browser has blocked the popup window');
						}
					// } else {
					// }
					this.stripeVerificationCheck = false;
				});
		}
	}

	/** *Stripe Dashboard Redirection */
	stripeDashboard() {
		let newTab: any;
		if (this.isBrowser) newTab = window.open();
		this.stripeDashboardCheck = true;

		//Redirection To Stripe Dashboard
		this._bankService.redirectToStripeDashboard().subscribe((res: any) => {
			if (newTab != null) {
				newTab.location.href = res?.data?.url;
			}
			this.stripeDashboardCheck = false;
		});
	}

	/** *Radio Button Switching From Automatic To Manual */
	switchPayout(value: string) {
		if (value == 'manual') {
			this.manualCheck = true;
			this.tempBoolean = true;
		} else {
			this.manualCheck = false;
			this.tempBoolean = false;
		}
	}
}
