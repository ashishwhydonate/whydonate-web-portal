import { HttpParams } from '@angular/common/http';
import {
	AfterViewInit,
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import {
	LegacyProgressAnimationEnd as ProgressAnimationEnd,
	LegacyProgressBarMode as ProgressBarMode,
} from '@angular/material/legacy-progress-bar';
import { interval, timer } from 'rxjs';
import { debounce, distinctUntilChanged } from 'rxjs/operators';
import { DashboardService } from '../../../../services/dashboard.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/pages/account/services/account.service';

/** *Given Donation Interface */

export interface GivenDonation {
	date: Date;
	userId: number;
	fundraiserName: string;
	status: string;
	amount: number;
	transaction: string;
}

let ELEMENT_DATA: GivenDonation[] = [];

@Component({
	selector: 'app-given-donation',
	templateUrl: './given-donation.component.html',
})
/** *Given Donation Component */
export class GivenDonationComponent
	implements OnInit, AfterViewInit, OnChanges
{
	@Input() donationGiven!: any;
	@ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
	displayedColumns: string[] = [
		'date',
		'fundraiser_name',
		'amount',
		'transaction',
		'action',
	];
	count!: number;
	dataSource = new MatTableDataSource(ELEMENT_DATA);
	range: UntypedFormGroup;
	searchInputForm: UntypedFormGroup;
	debounceDelay: number = 1000; //debounce delay for search input and category selectionChange
	donationReceived: any;
	isLoading!: boolean;
	isPaginatorLoading: boolean = false;
	progressBarMode: ProgressBarMode = 'determinate';
	progressbarValue: number = 0;
	givenDonationFileName: string = `given-donation-${new Date().toISOString()}`;
	API_URL: string = environment.apiUrl;
	RECEIPT_URL: string = 'accounting/receipt';
	maxDate: Date = new Date();
	check: boolean = false;
	startDatePlace = $localize`:@@startDate_placeholder:Start date`;
	endDatePlace = $localize`:@@endDate_placeholder:End date`;
	searchPlace = $localize`:@@search_placeholder:search`;
	dateRangeTooltip = $localize`:@@date_range_tooltip:Select Date Range first`;

	csvCheck: boolean = false;
	csvLoading: boolean = false;
	constructor(
		private _dashboardService: DashboardService,
		private _notificationService: NotificationService,
		public router: Router,
		public accountService: AccountService
	) {
		this.range = new UntypedFormGroup({
			start: new UntypedFormControl(),
			end: new UntypedFormControl(),
		});
		this.searchInputForm = new UntypedFormGroup({
			searchCtrl: new UntypedFormControl(),
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.donationGiven.currentValue) {
			ELEMENT_DATA = this.dataFilter(this.donationGiven.donationGiven);
			this.dataSource = new MatTableDataSource(ELEMENT_DATA);
			this.translate();
			this.count = this.donationGiven.count;
			if (!this.count) {
				this.searchInputForm?.disable({ emitEvent: false });
				this.range?.disable({ emitEvent: false });
			}
		}
	}

	ngOnInit(): void {
		this.translate();
		this.paginator._intl.itemsPerPageLabel = $localize`:@@mat_paginator_label:items per page`;

		if (this.accountService.checkHeaders()) {
			let startDateRange = this.range?.controls.start.value;
			let endDateRange = this.range?.controls.end.value;
			this._dashboardService
				.getDonationGiven(
					new HttpParams({
						fromObject: {
							['filter']: '',
							['sort_col']: 'created_at',
							['sort_direction']: 'asc',
							['page']: 1,
							['page_size']: 20,
							['from_date']: startDateRange
								? new Date(startDateRange).getTime()
								: 0,
							['to_date']: startDateRange
								? new Date(endDateRange).getTime()
								: new Date().getTime(),
						},
					})
				)
				.subscribe((res) => {
					let donationGivenObj =
						this._dashboardService.getDonationGivenObj(res);
					if (donationGivenObj.count == 0) {
						this.check = true;
					} else {
						this.check = false;
					}
					ELEMENT_DATA = this.dataFilter(donationGivenObj.donationGiven);
					this.dataSource = new MatTableDataSource(ELEMENT_DATA);
					this.translate();
					this.paginator.length = donationGivenObj.count;
					// if (donationGivenObj.count == 0) {
					// 	this.check = true;
					// }
					/** *loading flag and progress bar setting */
					this.startDeterminateProgress();
					this.finishDeterminateProgress();
				});
		}
	}

	ngAfterViewInit() {
		this.range?.controls.end.valueChanges.subscribe((dateChange) => {
			let startDateRange = this.range?.controls.start.value;
			let endDateRange = this.range?.controls.end.value;
			if (endDateRange) {
				this.csvCheck = true;
				this.startLoading();
				this.startIndeterminateProgress();

				this._dashboardService
					.getDonationGiven(
						new HttpParams({
							fromObject: {
								['filter']: '',
								['sort_col']: 'created_at',
								['sort_direction']: 'asc',
								['page']: 1,
								['page_size']: 20,
								['from_date']: startDateRange
									? new Date(startDateRange).getTime()
									: 0,
								['to_date']: startDateRange
									? new Date(endDateRange).getTime()
									: new Date().getTime(),
							},
						})
					)
					.subscribe((res) => {
						let donationGivenObj =
							this._dashboardService.getDonationGivenObj(res);
						ELEMENT_DATA = this.dataFilter(donationGivenObj.donationGiven);
						this.dataSource = new MatTableDataSource(ELEMENT_DATA);
						this.translate();
						this.paginator.length = donationGivenObj.count;
						// if (donationGivenObj.count == 0) {
						// 	this.check = true;
						// }
						/** *loading flag and progress bar setting */
						this.startDeterminateProgress();
						this.finishDeterminateProgress();
					});
			}
		});

		this.searchInputForm?.controls.searchCtrl.valueChanges
			.pipe(
				debounce(() => {
					return interval(this.debounceDelay);
				}),
				distinctUntilChanged((x, y) => {
					/** *INFO: If no actual change then cancel the loading and Search */
					if (x === y) {
						// console.log(`query x: ${x}, y: ${y} are identical, api called interrupted`);
						this.cancelLoadingAndProgress();
						return true;
					}
					// if (this.isLoading && this.progressBarMode === 'query') {
					// 	//TODO: If true then, new API request made while one is already running. (user switchMap from rxjs to resolve this scenario: https://www.learnrxjs.io/learn-rxjs/operators/transformation/switchmap)
					// }
					return false;
				})
			)
			.subscribe((searchInput) => {
				/** *loading flag and progress bar setting */
				this.startLoading();
				this.startQueryProgress();

				let startDateRange = this.range?.controls.start.value;
				let endDateRange = this.range?.controls.end.value;
				this._dashboardService
					.getDonationGiven(
						new HttpParams({
							fromObject: {
								['filter']: searchInput || '',
								['sort_col']: 'created_at',
								['sort_direction']: 'asc',
								['page']: 1,
								['page_size']: 20,
								['from_date']: new Date(startDateRange).getTime() || 0,
								['to_date']:
									new Date(endDateRange).getTime() || new Date().getTime(),
							},
						})
					)
					.subscribe((res) => {
						this.startDeterminateProgress();
						let donationGivenObj =
							this._dashboardService.getDonationGivenObj(res);
						ELEMENT_DATA = this.dataFilter(donationGivenObj.donationGiven);
						this.dataSource = new MatTableDataSource(ELEMENT_DATA);
						this.translate();
						this.paginator.length = donationGivenObj.count;

						this._dashboardService
							.getDonationGiven(
								new HttpParams({
									fromObject: {
										['filter']: '',
										['sort_col']: 'created_at',
										['sort_direction']: 'asc',
										['page']: 1,
										['page_size']: 20,
										['from_date']: startDateRange
											? new Date(startDateRange).getTime()
											: 0,
										['to_date']: startDateRange
											? new Date(endDateRange).getTime()
											: new Date().getTime(),
									},
								})
							)
							.subscribe((res) => {
								let donationGivenObj =
									this._dashboardService.getDonationGivenObj(res);
								ELEMENT_DATA = this.dataFilter(donationGivenObj.donationGiven);
								this.dataSource = new MatTableDataSource(ELEMENT_DATA);
								this.translate();
								this.paginator.length = donationGivenObj.count;
								// if (donationGivenObj.count == 0) {
								// 	this.check = true;
								// }
								/** *loading flag and progress bar setting */
								this.startDeterminateProgress();
								this.finishDeterminateProgress();
							});
					});

				this.searchInputForm?.controls.searchCtrl.valueChanges
					.pipe(
						debounce(() => {
							return interval(this.debounceDelay);
						}),
						distinctUntilChanged((x, y) => {
							/** *INFO: If no actual change then cancel the loading and Search */
							if (x === y) {
								// console.log(`query x: ${x}, y: ${y} are identical, api called interrupted`);
								this.cancelLoadingAndProgress();
								return true;
							}
							// if (this.isLoading && this.progressBarMode === 'query') {
							// 	//TODO: If true then, new API request made while one is already running. (user switchMap from rxjs to resolve this scenario: https://www.learnrxjs.io/learn-rxjs/operators/transformation/switchmap)
							// }
							return false;
						})
					)
					.subscribe((searchInput) => {
						/** *loading flag and progress bar setting */
						this.startLoading();
						this.startQueryProgress();

						let startDateRange = this.range?.controls.start.value;
						let endDateRange = this.range?.controls.end.value;
						this._dashboardService
							.getDonationGiven(
								new HttpParams({
									fromObject: {
										['filter']: searchInput || '',
										['sort_col']: 'created_at',
										['sort_direction']: 'asc',
										['page']: 1,
										['page_size']: 20,
										['from_date']: new Date(startDateRange).getTime() || 0,
										['to_date']:
											new Date(endDateRange).getTime() || new Date().getTime(),
									},
								})
							)
							.subscribe((res) => {
								this.startDeterminateProgress();
								let donationGivenObj =
									this._dashboardService.getDonationGivenObj(res);
								ELEMENT_DATA = this.dataFilter(donationGivenObj.donationGiven);
								this.dataSource = new MatTableDataSource(ELEMENT_DATA);
								this.translate();
								this.paginator.length = donationGivenObj.count;

								this.finishDeterminateProgress();
							});
					});
			});
	}

	/** *Save CSV */
	saveCsv() {
		if (this.accountService.checkHeaders()) {
			/** To ensure To date is not empty default will be todays date. */
			this.csvLoading = true;

			let searchInput = this.searchInputForm.controls.searchCtrl.value;
			let startDateRange = this.range.controls.start.value;
			let endDateRange = this.range.controls.end.value;
			let pageIndex = this.paginator.pageIndex;
			let pageSize = this.paginator.pageSize;

			this._dashboardService
				.getDonationGiven(
					new HttpParams({
						fromObject: {
							['filter']: searchInput || '',
							['sort_col']: 'created_at',
							['sort_direction']: 'asc',
							['page']: pageIndex + 1,
							['page_size']: this.paginator.length,
							['from_date']: new Date(startDateRange).getTime() || 0,
							['to_date']:
								new Date(endDateRange).getTime() || new Date().getTime(),
						},
					})
				)
				.subscribe((transactions: any) => {
					console.log('transactions', transactions);
					let csvContent = 'data:text/csv;charset=utf-8,';
					csvContent +=
						['Date', 'Fundraiser', 'Status', 'Donation'].join(',') + '\r\n';
					const walletTransactions = transactions.data['results'];
					console.log('WALLET', walletTransactions);
					walletTransactions.forEach(function (rowArray: any) {
						const row = [
							rowArray.created_at,
							rowArray.fundraising_local.title,
							rowArray.status,
							rowArray.amount,
						];
						csvContent += row + '\r\n';
					});
				});
		}
	}

	clearDateRange() {
		console.log('clearDateRange');
		this.range.patchValue(
			{ start: '', end: '' },
			{
				onlySelf: true,
				emitEvent: false,
			}
		);
		this.csvCheck = false;
	}

	changePage(event: any) {
		if (this.accountService.checkHeaders()) {
			this.startPaginatorLoading();
			this.startIndeterminateProgress();

			let searchInput = this.searchInputForm?.controls.searchCtrl.value;
			let startDateRange = this.range?.controls.start.value;
			let endDateRange = this.range?.controls.end.value;
			let pageIndex = this.paginator.pageIndex;
			let pageSize = this.paginator.pageSize;

			this._dashboardService
				.getDonationGiven(
					new HttpParams({
						fromObject: {
							['filter']: searchInput || '',
							['sort_col']: 'created_at',
							['sort_direction']: 'asc',
							['page']: pageIndex + 1,
							['page_size']: pageSize,
							['from_date']: new Date(startDateRange).getTime() || 0,
							['to_date']:
								new Date(endDateRange).getTime() || new Date().getTime(),
						},
					})
				)
				.subscribe((res) => {
					this.startDeterminateProgress();
					let donationGivenObj =
						this._dashboardService.getDonationGivenObj(res);
					ELEMENT_DATA = this.dataFilter(donationGivenObj.donationGiven);
					this.dataSource = new MatTableDataSource(ELEMENT_DATA);
					this.translate();
					this.paginator.length = donationGivenObj.count;

					this.finishDeterminateProgress();
				});
		}
	}

	dataFilter(sourceList: any) {
		if (!sourceList) {
			return [];
		} else {
			return sourceList.map((source: any) => {
				return {
					date: new Date(source?.created_at),
					userId: source?.user_id,
					fundraiserName: source?.fundraising_local.title,
					status: source?.status,
					amount: source?.amount,
					transaction_id: source?.payment_transaction_id,
					symbol: source?.symbol,
				};
			});
		}
	}

	notifyCSVDownload() {
		this._notificationService.openNotification(
			$localize`:@@given_donation_csvDownload:CSV downloaded`,
			'',
			'success'
		);
	}

	progressAnimationEnd(e: ProgressAnimationEnd) {
		this.isLoading = false;
		this.isPaginatorLoading = false;
	}
	/** *Set isLoading to true. */
	startLoading() {
		this.isLoading = true;
	}
	startPaginatorLoading() {
		this.isPaginatorLoading = true;
	}

	/** *When user interacts with filter but no API is called yet. */
	startIndeterminateProgress() {
		/** *while user is giving input set the progress mode as indeterminate */
		this.progressBarMode = 'indeterminate';
	}

	/** *Mat Progress Bar - mode: query */
	startQueryProgress() {
		this.progressBarMode = 'query';
	}

	/** *Mat Progress Bar - mode: determinate & value: 0 */
	startDeterminateProgress() {
		this.progressBarMode = 'determinate';
		this.progressbarValue = 0;
	}

	/** *Mat Progress Bar - mode: determinate & value: 100 */
	cancelLoadingAndProgress() {
		this.progressBarMode = 'determinate';
		this.progressbarValue = 100;
		this.isLoading = false;
	}

	/**
	 *  On setting progressBarValue 100, matProgressBar emits progressAnimationEnd when animation ends.
	 * Thats right time to change loading related flags to false.
	 * NOTE: progressBatMode should be 'determinate' before calling this function
	 */
	finishDeterminateProgress() {
		let subscribe = timer(100).subscribe((val) => {
			this.progressbarValue = 100;
			subscribe.unsubscribe();
		});
	}

	downloadReceipt(transaction: string) {
		this.router.navigate(['/donate', 'receipt', 'download'], {
			queryParams: { id: transaction },
		});
	}

	/** *Translation of statuses */
	translate() {
		for (let i = 0; i < this.dataSource.data.length; i++) {
			switch (this.dataSource.filteredData[i].status) {
				case 'paid':
					this.dataSource.filteredData[
						i
					].status = $localize`:@@received_donation_paidStatus:paid`;
					break;
				case 'reversal':
					this.dataSource.filteredData[
						i
					].status = $localize`:@@received_donation_reversalStatus:reversal`;
					break;
				case 'chargeback':
					this.dataSource.filteredData[
						i
					].status = $localize`:@@received_donation_chargeBackStatus:chargeBack`;
					break;
			}
		}
	}
}
