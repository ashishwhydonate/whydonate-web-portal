import {
	ChangeDetectorRef,
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { HttpParams } from '@angular/common/http';
import { debounce, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { interval, Subject, timer } from 'rxjs';
import * as moment from 'moment';
import { BalanceService } from './balance.service';
import { ReceivedDonation } from './balance.model';
// import { MatTableExporterDirective } from 'mat-table-exporter';
import {
	trigger,
	state,
	style,
	transition,
	animate,
} from '@angular/animations';
import {
	LegacyProgressAnimationEnd as ProgressAnimationEnd,
	LegacyProgressBarMode as ProgressBarMode,
} from '@angular/material/legacy-progress-bar';
import { MediaObserver } from '@angular/flex-layout';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { PayoutPopupComponent } from './payout-popup/payout-popup.component';
import { MatLegacyTabGroup as MatTabGroup } from '@angular/material/legacy-tabs';
import { BankService } from '../profile/services/bank.service';
import { Router } from '@angular/router';
import { ProfileService } from '../profile/services/profile.service';
import { DashboardService } from '../dashboard/services/dashboard.service';
import { AccountService } from '../../account/services/account.service';
import { CurrencySelectorService } from 'src/app/shared/services/currency-selector.service';

@Component({
	selector: 'app-balance',
	templateUrl: './balance.component.html',
	styleUrls: ['./balance.component.scss'],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition(
				'expanded <=> collapsed',
				animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
			),
		]),
	],
})
/** *Balance Component */
export class BalanceComponent implements OnInit, OnChanges {
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	@Input() donationReceived!: any;
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	// @ViewChild(MatTableExporterDirective, { static: true })
	// exporter!: MatTableExporterDirective;
	public panelOpenState = false;
	public expandedElement: any;
	public reset = false;
	formattedWalletTransactions = [];
	walletTransactions = [];
	donationReceivedCount: number = 0;
	ELEMENT_DATA: ReceivedDonation[] = [];
	public displayedColumns: string[] = [
		'date',
		'time',
		'fundraiser_name',
		'payment_mode',
		'amount',
		'type',
	];

	dataSource = new MatTableDataSource(this.ELEMENT_DATA);
	range: UntypedFormGroup;
	searchInputForm: UntypedFormGroup;
	debounceDelay: number = 1000; //debounce delay for search input and category selectionChange
	transactionBalance: any;
	isLoading: boolean = false;
	progressBarMode: ProgressBarMode = 'determinate';
	progressbarValue: number = 0;
	isMoreFundraiserExist: boolean = true;
	downloadName = `balance-${new Date().toISOString()}`;
	isCountLoading: boolean | undefined;
	invalidSelectedDate = false;
	keepGoing = false;
	MergedOrders = [];
	DateChunks = [];
	paymentStatusData: any;
	maxEndDate: Date = new Date();
	searchInputCheck: boolean = false;
	dateCheck: boolean = false;
	count2!: number;
	tempValue = 0;
	dateFilterCheck: boolean = false;
	csvCheck: boolean = false;
	csvLoading: boolean = false;
	componentLoading: boolean = false;
	public paginatorCount: number = 0;
	public indexControlling: number = 0;
	isPaginatorLoading: boolean = false;
	complianceStatusCheck: boolean = false;
	scheduledDate: any;
	approvedAmount: number = 0;
	oldBalanceTotal: number = 0;
	totalBalance: number = 0;
	approvedAmountCheck: boolean = false;
	balanceCheck: boolean = false;
	reservedAmount: number = 0;
	selectedTabIndex: number = 0;
	payout_enddate: any;
	payout_startdate: any;
	paymentId: any;
	settlement_id: any;
	specifications_id: any;
	dateRangeTooltip = $localize`:@@date_range_tooltip:Select Date Range first`;
	verificationTooltip = $localize`:@@balance_verification_tooltip:Please verify your bank account and identity to start receiving payouts.`;
	approvedPayoutTooltip = $localize`:@@balance_approvedPayout_tooltip:The approved amount reflects the transactions that can be paid out. Some type of payment methods, like Paypal, take a bit longer to get approved. More information can be found here(link).`;
	transactionTab = $localize`:@@balance_transaction_tab:Transactions`;
	payoutTab = $localize`:@@balance_payout_tab:Payouts (OPP)`;
	payoutTabMollie = $localize`:@@balance_payout_mollie:Payouts`;
	payoutTabStripe = $localize`:@@balance_payout_stripe:Payouts (Stripe)`;
	payoutTooltip = $localize`:@@balance_summary_payout_tooltip: DEMO DEMO DEMO`;
	payoutScheduledInterval: string = '';
	payoutScheduledAttribute: string = '';
	stripeStatus: any;
	chargesEnabled: any;
	payoutEnabled: any;
	detailsSubmitted: any;
	stripePrompt: boolean = false;
	oppVerificationCheck: boolean = false;

	firstDonationReceived: any;
	activeOPPDonationCount: any;
	showOpp: boolean = false;
	showStripeAndOpp: boolean = false;
	showStripe: boolean = false;
	stripeDashboardCheck: boolean = false;
	stripePayoutInterval: string = '';
	state: any;
	stripeBalanceAvailable: number = 0;
	stripeBalancePending: number = 0;
	stripeBalanceTotal: number = 0;
	isStripePayoutLoading: boolean = false;
	currency: any;
	constructor(
		private _balanceService: BalanceService,
		public media: MediaObserver,
		public dialog: MatDialog,
		private _notificationService: NotificationService,
		private _bankService: BankService,
		private router: Router,
		private changeDetectorRef: ChangeDetectorRef,
		public _profileService: ProfileService,
		private _dashboardService: DashboardService,
		public _accountService: AccountService,
		public currencyService: CurrencySelectorService
	) {
		this.range = new UntypedFormGroup({
			start: new UntypedFormControl(),
			end: new UntypedFormControl(),
		});
		this.searchInputForm = new UntypedFormGroup({
			searchCtrl: new UntypedFormControl(),
		});
	}

	/** *----------------------------------------------------------------------------------------------------- */
	/** *Lifecycle hooks */
	/** *----------------------------------------------------------------------------------------------------- */

	/**
	 * On Changes
	 */
	ngOnChanges(changes: SimpleChanges): void {
		if (changes.donationReceived.currentValue) {
			this.ELEMENT_DATA = this.dataFilter(
				this.donationReceived.donationReceived
			);
			this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
			// this.paginator.length = this.donationReceived.count;
		}
	}

	/**
	 * On init
	 */
	ngOnInit(): void {
		// CLEAR FILTERS
		this.searchInputForm.get('searchCtrl')?.setValue('');
		this.clearDate(new Event('click'));

		if (this._accountService.checkHeaders()) {
			// GET STRIPE STATUS
			this._bankService.getStripeStatus().subscribe((res: any) => {
				this.stripeStatus = res?.data;
				this.chargesEnabled = this.stripeStatus?.charges_enabled;
				this.payoutEnabled = this.stripeStatus?.payout_enabled;
				this.detailsSubmitted = this.stripeStatus?.details_submitted;
				// Checking either user is verified with stripe or not
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
				// Checking either user is verified with OPP or not
				this._bankService.getPersonalVerification().subscribe((res: any) => {
					if (res?.errors?.code === '1005') {
						this.oppVerificationCheck = false;
					} else {
						this.oppVerificationCheck = true;
					}
					//Getting count value to check that either first donation is made or not
					this._profileService.getDonationCount().subscribe((res: any) => {
						this.firstDonationReceived = res?.data?.first_donation_received;
						//Getting count value to check that either recurring donation is in progress or not

						//Maintaing all the scenarios (OPP/STRIPE/BOTH)
						if (
							this.firstDonationReceived === 0 &&
							this.stripeStatus.details_submitted === false &&
							this.oppVerificationCheck === true
						) {
							this.showOpp = true; //WIll SHOW OPP ONLY
						} else if (
							this.firstDonationReceived === 1 &&
							this.stripeStatus.details_submitted === true &&
							this.oppVerificationCheck === true
						) {
							this.showStripeAndOpp = true;
							this.showOpp = true;
							this.showStripe = true; //Will SHOW Stripe & OPP
							this.getStripeBalance();
							this.getSelectedPayoutIntervalStripe();
						} else if (
							this.firstDonationReceived === 1 &&
							this.stripeStatus.details_submitted === false &&
							this.oppVerificationCheck === true
						) {
							this.showStripeAndOpp = true;
							this.showOpp = true;
							this.showStripe = true;
							this.getStripeBalance();
							this.getSelectedPayoutIntervalStripe();
						} else {
							this.showStripe = true; //WIll Show Stripe only
							//Retrieve Balance for stripe
							this.getStripeBalance();
							this.getSelectedPayoutIntervalStripe();
						}
					});
				});
			});

			/** *Gettins Payout Schedule Value to Autofill Dropdown */
			this._balanceService.getPayoutSchedule().subscribe((res: any) => {
				this.payoutScheduledInterval = res?.data?.interval;
				this.payoutScheduledAttribute = res?.data?.attribute;
			});

			this.scheduledDate = moment()
				.add(1, 'M')
				.startOf('month')
				.format('DD-MM-YYYY');

			/** *Complaince Status Check */
			this._bankService.getPersonalVerification().subscribe((res: any) => {
				if (res.data.status == 'unverified' || res.data.status == 'pending') {
					this.complianceStatusCheck = true;
				} else {
					this.complianceStatusCheck = false;
				}
				this.componentLoading = true;
			});

			this.getTransactionBalance();
			/** *Get donation received data */
			this.getDonationGiven();
		}
	}

	/**
	 * AfterViewInit
	 */
	ngAfterViewInit() {
		this.startLoading();
		this.dataSource.paginator = this.paginator;

		this.range.controls.end.valueChanges.subscribe((dateChange) => {
			let startDateRange = this.range.controls.start.value;
			let endDateRange = this.range.controls.end.value;

			/** *Check the range of selected dates */
			if (startDateRange && endDateRange) {
				const getMonthCounts = this.diffInMonths(endDateRange, startDateRange);

				if (getMonthCounts >= 4) {
					this.invalidSelectedDate = true;
					this._notificationService.openNotification(
						'You can only select with three month',
						'OK',
						'error'
					);
					return;
				}
			}

			if (endDateRange) {
				this.csvCheck = true;
				this.startLoading();

				this._balanceService
					.transaction(
						new HttpParams({
							fromObject: {
								['filter']: '',

								['page']: 1,
								['page_size']: 20,
								['from_date']: new Date(startDateRange).getTime() / 1000 || 0,
								['to_date']:
									new Date(endDateRange).getTime() / 1000 ||
									new Date().getTime() / 1000,
							},
						})
					)
					.pipe(takeUntil(this._unsubscribeAll))
					.subscribe((res: any) => {
						this.walletTransactions = res.data['results'];
						let donationReceivedObj =
							this._balanceService.getDonationReceivedObj(res.data);
						let obj = this.removeTax(donationReceivedObj.donationReceived);
						if (obj.length == 0) {
							this.dateFilterCheck = true;
						}
						if (obj.length != 0) {
							this.dateFilterCheck = false;
						}
						this.ELEMENT_DATA = this.dataFilterNew(obj);
						this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);

						this.paginator.length = donationReceivedObj.count;
						this.donationReceivedCount = donationReceivedObj.count;
						this.startDeterminateProgress();
						this.finishDeterminateProgress();
						this.endLoading();
					});
			}
		});

		this.searchInputForm.controls.searchCtrl.valueChanges
			.pipe(
				debounce(() => {
					this.startLoading();
					return interval(this.debounceDelay);
				}),
				distinctUntilChanged((x, y) => {
					/** *INFO: If no actual change then cancel the loading and Search */
					if (x === y) {
						return true;
					}
					return false;
				})
			)
			.subscribe((searchInput) => {
				let startDateRange = this.range.controls.start.value;
				let endDateRange = this.range.controls.end.value;
				let pageIndex = this.paginator.pageIndex;

				this._balanceService
					.transaction(
						new HttpParams({
							fromObject: {
								['filter']: searchInput || '',

								['page']: 1,
								['page_size']: 20,
								['from_date']: new Date(startDateRange).getTime() || 0,
								['to_date']:
									new Date(endDateRange).getTime() / 1000 ||
									new Date().getTime() / 1000,
							},
						})
					)
					.pipe(takeUntil(this._unsubscribeAll))
					.subscribe((transactions: any) => {
						this.startDeterminateProgress();
						let donationReceivedObj =
							this._balanceService.getDonationReceivedObj(transactions.data);
						let obj = this.removeTax(donationReceivedObj.donationReceived);
						this.ELEMENT_DATA = this.dataFilterNew(obj);
						var res: any = this.ELEMENT_DATA.filter(function (el: any) {
							return el
								? el?.payment_method
										?.toLowerCase()
										.includes(searchInput.toLowerCase()) ||
										el?.fundraiserName
											?.toLowerCase()
											.includes(searchInput.toLowerCase()) ||
										el?.donation?.includes(searchInput.toLowerCase()) ||
										el?.amount?.includes(searchInput.toLowerCase())
								: {};
						});
						this.searchInputCheck = false;
						if (res.length == 0) {
							this.searchInputCheck = true;
						} else {
							this.searchInputCheck = false;
						}
						// this.formatData(res);
						this.dataSource = new MatTableDataSource(res);
						searchInput.length == 0
							? (this.paginator.length = Math.round(this.paginatorCount / 4))
							: (this.paginator.length = transactions.data.count);

						this.endLoading();
						this.finishDeterminateProgress();
					});
			});
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		/** *Unsubscribe from all subscriptions */
		this._unsubscribeAll.complete();
		this.paginator.pageIndex = 0;
	}

	/** *----------------------------------------------------------------------------------------------------- */
	/** Public methods */
	/** ----------------------------------------------------------------------------------------------------- */

	/** *Clear the date picker */
	clearDate(event: any) {
		event.stopPropagation();

		if (!this.range.controls.start.value && !this.range.controls.end.value) {
			return;
		}

		this.reset = false;

		this.range.reset();

		/** *Get donation received data */
		this.ngOnInit();
		this.csvCheck = false;
	}

	/** *Get difference between two date */
	diffInMonths(endDateRange: Date, startDateRange: Date) {
		var timeDiff = Math.abs(endDateRange.getTime() - startDateRange.getTime());

		return Math.round(timeDiff / (2e3 * 3600 * 365.25));
	}

	returnIndex(index: number) {
		return index + 4;
	}

	changePage(event: any) {
		if (this._accountService.checkHeaders()) {
			if (this.paymentId != undefined) {
				this.startPaginatorLoading();
				let pageIndex = this.paginator.pageIndex + 1;
				let pageSize = this.paginator.pageSize;
				this.startLoading();

				this._balanceService
					.payoutTransaction(pageIndex, pageSize, this.paymentId)
					.pipe(takeUntil(this._unsubscribeAll))
					.subscribe(
						(res: any) => {
							let obj = this.removeTaxOpp(res?.data?.results);
							this.ELEMENT_DATA = this.dataFilterNew(obj);
							this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
							this.donationReceivedCount = res?.data?.count;

							this.paginator.length = res?.data?.count;
							this.reset = true;

							this._notificationService.openNotification(
								'Balance record fetched successfully',
								'OK',
								'success'
							);

							this.endLoading();
						},
						(error) => {
							this._notificationService.openNotification(
								'No balance record found',
								'OK',
								'error'
							);
						}
					);
			} else {
				this.startPaginatorLoading();
				let startDateRange = this.range.controls.start.value;
				let endDateRange = this.range.controls.end.value;
				let searchInput = this.searchInputForm.controls.searchCtrl.value;
				let pageIndex = this.paginator.pageIndex;
				let pageSize = this.paginator.pageSize;
				this.startLoading();

				this._balanceService
					.transaction(
						new HttpParams({
							fromObject: {
								['filter']: searchInput || '',

								['page']: pageIndex + 1,
								['page_size']: 20,
								['from_date']: new Date(startDateRange).getTime() || 0,
								['to_date']:
									new Date(endDateRange).getTime() / 1000 ||
									new Date().getTime() / 1000,
							},
						})
					)
					.pipe(takeUntil(this._unsubscribeAll))
					.subscribe(
						(res: any) => {
							let donationReceivedObj =
								this._balanceService.getDonationReceivedObj(res.data);

							let obj = this.removeTax(donationReceivedObj.donationReceived);
							this.ELEMENT_DATA = this.dataFilterNew(obj);
							this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);

							this.donationReceivedCount = donationReceivedObj.count;

							this.reset = true;

							this._notificationService.openNotification(
								'Balance record fetched successfully',
								'OK',
								'success'
							);

							this.endLoading();
						},
						(error) => {
							this._notificationService.openNotification(
								'No balance record found',
								'OK',
								'error'
							);
						}
					);
			}
		}
	}

	/** Get data form payout tab mollie */

	recivedDateFromSettlement(event: any) {
		this.ngOnDestroy();
		this.selectedTabIndex = 0;
		this.changeDetectorRef.detectChanges();
		this.startPaginatorLoading();
		this.csvCheck = false;
		let searchInput = this.searchInputForm.controls.searchCtrl.value;
		this.paymentId = event.uid;
		let pageIndex = this.paginator.pageIndex + 1;
		let pageSize = this.paginator.pageSize;
		this.startLoading();

		this._balanceService
			.payoutTransaction(pageIndex, pageSize, this.paymentId)
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe(
				(res: any) => {
					let donationReceivedObj = this._balanceService.getDonationReceivedObj(
						res.data
					);

					let obj = this.removeTax(donationReceivedObj.donationReceived);
					this.ELEMENT_DATA = this.dataFilterNew(obj);
					this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
					// this.paginatorCount = donationReceivedObj.count;
					this.donationReceivedCount = donationReceivedObj.count;
					// this.paginator.length = this.ELEMENT_DATA.length;
					this.paginator.length = donationReceivedObj.count;
					this.reset = true;

					this._notificationService.openNotification(
						'Balance record fetched successfully',
						'OK',
						'success'
					);

					this.endLoading();
				},
				(error) => {
					this._notificationService.openNotification(
						'No balance record found',
						'OK',
						'error'
					);
				}
			);
	}

	/* recived data from payout opp */

	recivedDateFromSettlementOpp(event: any) {
		if (this._accountService.checkHeaders()) {
			this.ngOnDestroy();
			this.csvCheck = true;
			this.selectedTabIndex = 0;
			this.changeDetectorRef.detectChanges();
			this.startPaginatorLoading();
			this.csvCheck = true;
			this.settlement_id = event.settlement_id;
			this.specifications_id = event.specifications_id;
			let pageIndex = this.paginator.pageIndex + 1;
			let pageSize = this.paginator.pageSize;
			this.startLoading();

			this._balanceService
				.getTransactionsOpp(
					this.settlement_id,
					this.specifications_id,
					pageIndex,
					pageSize
				)
				.pipe(takeUntil(this._unsubscribeAll))
				.subscribe(
					(res: any) => {
						let obj = this.removeTaxOpp(res?.data?.result);
						this.ELEMENT_DATA = this.dataFilterOpp(obj);
						this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
						this.donationReceivedCount = res?.data?.count;
						this.paginator.length = res?.data?.count;
						this.reset = true;

						this._notificationService.openNotification(
							'Balance record fetched successfully',
							'OK',
							'success'
						);

						this.endLoading();
					},
					(error) => {
						this._notificationService.openNotification(
							'No balance record found',
							'OK',
							'error'
						);
					}
				);
		}
	}

	saveCsv() {
		if (this._accountService.checkHeaders()) {
			/** To ensure To date is not empty default will be todays date. */
			this.csvLoading = true;

			if (this.paymentId != undefined) {
				let pageIndex = 1;
				let pageSize = 20000;

				this._balanceService
					.payoutTransaction(pageIndex, pageSize, this.paymentId)
					.pipe(takeUntil(this._unsubscribeAll))
					.subscribe((res: any) => {
						let csvContent = 'data:text/csv;charset=utf-8,';
						csvContent +=
							[
								'Created At',
								'Type',
								'Amount',
								'Description',
								'Payment Method',
							].join(',') + '\r\n';
						const walletTransactions = res?.data?.result;
						walletTransactions.forEach(function (rowArray: any) {
							const row = [
								rowArray.created_at,
								rowArray.type,
								rowArray.amount,
								rowArray.title ? rowArray.title : '-',
								rowArray.payment_method ? rowArray.payment_method : '-',
							];
							csvContent += row + '\r\n';
						});

						//Refactored the download CSV button
						this._dashboardService.downloadCSV(csvContent, this.downloadName);

						this._notificationService.openNotification(
							'CSV downloaded successfully',
							'',
							'success'
						);
						this.csvLoading = false;
					});
			} else {
				let searchInput = this.searchInputForm.controls.searchCtrl.value;
				let startDateRange = this.range.controls.start.value;
				let endDateRange = this.range.controls.end.value;
				let pageIndex = this.paginator.pageIndex;
				let pageSize = this.paginator.pageSize;

				this._balanceService
					.transaction(
						new HttpParams({
							fromObject: {
								['filter']: searchInput || '',
								['from_date']: new Date(startDateRange).getTime() || 0,
								['to_date']:
									new Date(endDateRange).getTime() / 1000 ||
									new Date().getTime() / 1000,
							},
						})
					)
					.subscribe((transactions: any) => {
						let csvContent = 'data:text/csv;charset=utf-8,';
						csvContent +=
							[
								'Created At',
								'Type',
								'Amount',
								'Description',
								'Payment Method',
							].join(',') + '\r\n';
						const walletTransactions = transactions.data['results'];
						walletTransactions.forEach(function (rowArray: any) {
							const row = [
								rowArray.created_at,
								rowArray.type,
								rowArray.amount,
								rowArray ? rowArray.title : '-',
								rowArray ? rowArray.payment_method : '-',
							];
							csvContent += row + '\r\n';
						});

						//Refactored the download CSV button
						this._dashboardService.downloadCSV(csvContent, this.downloadName);

						this._notificationService.openNotification(
							'CSV downloaded successfully',
							'',
							'success'
						);
						this.csvLoading = false;
					});
			}
		}
	}

	dataFilter(sourceList: any) {
		if (sourceList) {
			return sourceList.map((source: any) => {
				return {
					date: new Date(source?.created_at),
					time: new Date(source?.created_at),
					userId: source?.user_id,
					fundraiserName: source?.title,
					status: source?.status,
					amount: source?.amount,
					transaction: source?.payment_transaction_id,
					donorId: source?.id,
					donorEmail: source?.donor?.email,
					receiptName: source?.name,
					address: source?.donor?.address || '',
					city: source?.donor?.city || '',
					zipcode: source?.donor?.zipcode || '',
					country: source?.donor?.country || '',
					donorReply: source?.donor?.reply_message || '',
				};
			});
		} else {
			return [];
		}
	}

	dataFilterNew(sourceList: any) {
		console.log('SEHBAN source', sourceList);
		if (sourceList) {
			return sourceList
				.map((source: any) => {
					if (
						source &&
						source.created_at &&
						source.title &&
						source.amount &&
						source.type &&
						source.payment_method &&
						source.symbol
					) {
						return {
							date: new Date(source?.created_at),
							time: new Date(source?.created_at),
							fundraiserName: source?.title,
							amount: source?.amount,
							type: source?.type,
							payment_method: source?.payment_method,
							cost: source?.amount,
							commission: source?.amount,
							donation: source?.amount,
							symbol: source?.symbol,
						};
					} else {
						return {
							date: null,
							time: null,
							fundraiserName: '',
							amount: 0,
							type: '',
							payment_method: '',
							cost: 0,
							commission: 0,
							donation: 0,
							symbol: source?.symbol,
						};
					}
				})
				.filter((source: any) => source !== null); // Remove null elements
		} else {
			return [];
		}
	}

	dataFilterOpp(sourceList: any) {
		if (sourceList) {
			return sourceList.map((source: any) => {
				return {
					date: new Date(source?.created_at),
					// date: new Date(source?.settlements.date * 1000),
					// date: source?.settlements?.date
					// 	? new Date(source.settlements.date * 1000)
					// 	: '',
					time: new Date(source?.created_at),
					// time: new Date(source?.settlements.date * 1000),
					// time: source?.settlements?.date
					// 	? new Date(source.settlements.date * 1000)
					// 	: '',
					fundraiserName: source?.title,
					amount: source?.amount,
					type: source?.type,
					wallet_id: source?.wallet_id,
					object_id: source?.object_id,
					payment_method: source.payment_method ? source.payment_method : '',
					cost: source?.amount,
					commission: source?.amount,
					donation: source?.amount,
				};
			});
		} else {
			return [];
		}
	}

	dataFilterTransaction(sourceList: any) {
		let tempArr: any = [];

		let dummyCheck = 0;
		let size = 0;
		for (let source = 0; source < sourceList.length; source++) {
			let incrementOne = 1;
			let incrementTwo = 2;
			let incrementThree = 3;

			if ((source % 4) - dummyCheck === 0 && sourceList[source].order) {
				let obj = {
					date: new Date(sourceList[source].created_at),
					time: new Date(sourceList[source].created_at),
					fundraiserName: sourceList[source].order?.fundraising_local?.title
						? sourceList[source].order?.fundraising_local?.title
						: '',
					amount: sourceList[source].amount,
					type: sourceList[source].type,
					wallet_id: sourceList[source].wallet_id,
					object_id: sourceList[source].object_id,
					payment_method: sourceList[source].order?.payment_method
						? sourceList[source].order?.payment_method
						: '',
					tax: sourceList[source]?.amount,
					cost: sourceList[source + incrementOne]?.amount,
					commission: sourceList[source + incrementTwo]?.amount,
					donation: sourceList[source + incrementThree]?.amount,
				};
				tempArr.push(obj);
			} else if (source % 4 === 0 && !sourceList[source].order) {
				let obj = {
					date: new Date(sourceList[source].created_at),
					time: new Date(sourceList[source].created_at),
					fundraiserName: sourceList[source].order?.fundraising_local?.title
						? sourceList[source].order?.fundraising_local?.title
						: '',
					amount: sourceList[source].amount,
					type: sourceList[source].type,
					wallet_id: sourceList[source].wallet_id,
					object_id: sourceList[source].object_id,
					payment_method: sourceList[source].order?.payment_method
						? sourceList[source].order?.payment_method
						: '',
					cost: sourceList[source + 1]?.amount,
					commission: sourceList[source + 2]?.amount,
					donation: sourceList[source + 3]?.amount,
				};
				tempArr.push(obj);

				dummyCheck = 1;
			}
		}
		this.endLoading();
		return tempArr;
	}
	/** *Count 4 Ids from donation object*/
	count(id: any, obj: any) {
		let countCheck = 0;
		for (let i = 0; i < obj.length; i++) {
			if (obj[i].object_id == id) {
				countCheck++;
			}
		}
		return countCheck;
	}

	parseToFloat(num: string) {
		return parseFloat(num);
	}
	formatData(walletTransactions: any) {
		this.startLoading();
		let groupedTransactionsYears: any = [];

		groupedTransactionsYears = [
			...Object.values(
				walletTransactions?.reduce(
					(h: any, a: any) =>
						Object.assign(h, {
							[moment(a.created_at).year()]: (
								h[moment(a.created_at).year()] || []
							).concat(a),
						}),
					{}
				)
			),
		];

		for (let i = 0; i < groupedTransactionsYears.length; i++) {
			this.startLoading();

			groupedTransactionsYears[i] = [
				...Object.values(
					groupedTransactionsYears[i]?.reduce(
						(h: any, a: any) =>
							Object.assign(h, {
								[moment(a.created_at).month()]: (
									h[moment(a.created_at).month()] || []
								).concat(a),
							}),
						{}
					)
				),
			];
		}

		let groupedTransactionsYearsReverse = groupedTransactionsYears.reverse();

		groupedTransactionsYearsReverse.forEach((year: any) => {
			groupedTransactionsYearsReverse[year] = year.reverse();
		});

		let formattedWalletTransactionsYears: any = [];

		groupedTransactionsYearsReverse.forEach((year: any) => {
			this.startLoading();
			formattedWalletTransactionsYears[moment(year[0][0].created_at).year()] =
				year.map((w: Array<any>) => {
					return {
						year: moment(w[0].created_at).year(),
						month: moment(w[0].created_at).format('MMMM YYYY'),
						data: [
							...Object.values(
								w.reduce(
									(h, a) =>
										Object.assign(h, {
											[a.object_id]: (h[a.object_id] || []).concat(a),
										}),
									{}
								)
							),
						].reverse(),
					};
				});
		});

		this.formattedWalletTransactions = formattedWalletTransactionsYears;
		this.formattedWalletTransactions.reverse();
		this._notificationService.openNotification(
			'Balance record fetched successfully',
			'OK',
			'success'
		);

		this.endLoading();
	}

	/**
	 * Get Transaction Balance
	 */
	getTransactionBalance() {
		if (this._accountService.checkHeaders()) {
			this.componentLoading = false;
			this.currency = this.currencyService.getSelectedCurrency();

			this._balanceService
				.getTotalBalance(this.currency?.currency)
				.subscribe((balance: any) => {
					this.reservedAmount = balance?.data?.balance?.amount_reserved / 100;
					this.totalBalance = balance?.data?.balance?.amount / 100;

					this.donationReceived = this.totalBalance + this.reservedAmount || 0;
					this.approvedAmount = this.totalBalance;
					if (this.totalBalance == 0) {
						this.approvedAmountCheck = true;
					} else {
						this.approvedAmountCheck = false;
					}
					this.balanceCheck = true;
				});

			this.componentLoading = true;
		}
	}

	/**
	 * Get donation given received
	 */
	getDonationGiven() {
		if (this._accountService.checkHeaders()) {
			/* loading flag and progress bar setting */
			const param = new HttpParams({
				fromObject: {
					['filter']: '',

					['page']: 1,
					['page_size']: 20,
					['from_date']: 0,
					['to_date']: new Date().getTime() / 1000,
				},
			});

			this.startLoading();
			this._balanceService
				.transaction(param)
				.pipe(takeUntil(this._unsubscribeAll))
				.subscribe((res: any) => {
					let donationReceivedObj = this._balanceService.getDonationReceivedObj(
						res.data
					);

					let obj = this.removeTax(donationReceivedObj.donationReceived);
					this.ELEMENT_DATA = this.dataFilterNew(obj);
					this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
					this.paginatorCount = donationReceivedObj.count;
					this.donationReceivedCount = donationReceivedObj.count;
					this.paginator.length = donationReceivedObj.count;

					this.endLoading();
				});
		}
	}
	adjustData(obj: any) {
		return this.removeClearing(obj);
	}

	/** *Removing clearing amount */
	removeClearing(obj: any): any {
		return obj.filter(function (val: any) {
			return val.type !== 'clearing';
		});
	}

	/** *Removing clearing amount */
	removeTax(obj: any): any {
		if (!obj) {
			return {};
		} else {
			return obj.filter(function (val: any) {
				return val.type !== 'tax';
			});
		}
	}

	/** Remove tax amount */

	removeTaxOpp(obj: any): any {
		if (!obj) {
			return {};
		} else {
			return obj.filter(function (val: any) {
				return val.type !== 'tax';
			});
		}
	}

	/** *Removing incomplete IDs from the object */
	removeExtra(obj: any) {
		for (let i = 0; i < obj.length; i++) {
			let size = this.count(obj[i].object_id, obj);
			if (size != 4 && obj[i].type != 'clearing') {
				obj.splice(i, size);
			}
		}
		return obj;
	}

	/** *Set isLoading to true. */
	startLoading() {
		this.isLoading = true;
	}

	/** *Set isLoading to false. */
	endLoading() {
		this.isLoading = false;
	}
	startPaginatorLoading() {
		this.isPaginatorLoading = true;
	}
	startDeterminateProgress() {
		this.progressBarMode = 'determinate';
		this.progressbarValue = 0;
	}
	finishDeterminateProgress() {
		let subscribe = timer(100).subscribe((val) => {
			this.progressbarValue = 100;
			subscribe.unsubscribe();
		});
	}

	/** *When user interacts with filter but no API is called yet. */
	startIndeterminateProgress() {
		/** *while user is giving input set the progress mode as indeterminate */
		this.progressBarMode = 'indeterminate';
	}
	getDonationOfTransactionSet(transactionSet: any[]) {
		return transactionSet.find((t: { type: string }) => t.type === 'donation');
	}

	getNetOfTransactionSet(transactionSet: any[]) {
		let donation = transactionSet.find(
			(t: { type: string }) => t.type === 'donation'
		);
		return +donation.amount;
	}

	getPackagePriceOfTransactionSet(transactionSet: any[]) {
		return transactionSet.find((t: { type: string }) => t.type === 'package');
	}

	getNetOfPackageTransactionSet(transactionSet: any[]) {
		return transactionSet.reduce(
			(a: string | number, b: { amount: string | number }) => +a + +b.amount,
			0
		);
	}

	getClearingAmountOfTransactionSet(transactionSet: any[]) {
		return transactionSet.find((t: { type: string }) => t.type === 'clearing');
	}

	/** *Payout Redirection */
	redirectToPayoutSettings() {
		this.router.navigate(['profile/payout-settings']);
	}

	openDialog() {
		const dialogRef = this.dialog.open(PayoutPopupComponent, {
			width: '416px',
			height: '320px',
			data: {
				amount: this.donationReceived,
			},
		});

		dialogRef.afterClosed().subscribe((result) => {});
	}

	/** *Get Selected Payout Interval Stripe */
	getSelectedPayoutIntervalStripe() {
		this._balanceService.getPayoutSchedule().subscribe((res: any) => {
			this.stripePayoutInterval = res?.data?.interval;
		});
	}

	getStripeBalance() {
		this.currency = this.currencyService.getSelectedCurrency();
		if (this._accountService.checkHeaders()) {
			this._balanceService
				.getStripeBalance(this.currency?.currency)
				.subscribe((res: any) => {
					this.stripeBalanceAvailable = parseFloat(res?.data?.available) || 0;
					this.stripeBalancePending = parseFloat(res?.data?.pending) || 0;
					this.stripeBalanceTotal =
						this.stripeBalanceAvailable + this.stripeBalancePending;
				});
		}
	}

	/** *Strip Payout Function*/
	payoutStripe() {
		if (this.stripeBalanceAvailable > 1) {
			this.currency = this.currencyService.getSelectedCurrency();
			this.isStripePayoutLoading = true;
			this._balanceService
				.payoutStripe(this.stripeBalanceAvailable, this.currency?.currency)
				.subscribe((res: any) => {
					this.isStripePayoutLoading = false;
					if (res?.errors?.code == 'balance_insufficient') {
						this._notificationService.openNotification(
							$localize`:@@balance_stripe_payout_insufficientBalance:You have insufficient balance in your stripe account.`,
							'OK',
							'error'
						);
					} else {
						this._notificationService.openNotification(
							$localize`:@@balance_stripe_payout_successful:Payout done successfully.`,
							'OK',
							'success'
						);
					}
					this.getStripeBalance();
				});
		} else {
			this._notificationService.openNotification(
				$localize`:@@balance_stripe_payout_insufficientBalance:You have insufficient balance in your stripe account.`,
				'OK',
				'error'
			);
		}
	}
}
