import { HttpParams } from '@angular/common/http';
import {
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
import { StopRecurringDonationComponent } from '../stop-recurring-donation/stop-recurring-donation/stop-recurring-donation.component';
import {
	MatLegacyDialog as MatDialog,
	MatLegacyDialogConfig as MatDialogConfig,
} from '@angular/material/legacy-dialog';
import { AccountService } from 'src/app/pages/account/services/account.service';

/** *Received Donation Interface */
export interface ReceivedDonation {
	date: Date;
	donorName: string;
	userId: number;
	period: number;
	fundraiserName: string;
	donorEmail: string;
	receiptName: string;
	address: string;
	city: string;
	zipcode: string;
	country: string;
	donorReply: string;
	amount: number;
	status: string;
	isAnonymous: boolean;
	mandate_uid: string;
}

let ELEMENT_DATA: ReceivedDonation[] = [];

@Component({
	selector: 'app-recurring-received-donation',
	templateUrl: './recurring-received-donation.component.html',
})
/** *Recurring Recurring Donation Component */
export class RecurringReceivedDonationComponent implements OnInit, OnChanges {
	@Input() donationRecurringReceived!: any;
	@Input()
	isToggled: boolean = true;
	@ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
	tooltip = $localize`:@@recurring-recieved_donation_mat_tooltip:This recurring donation has been closed. To start recurring
	donation again, Start a new monthly or yearly donation.`;
	displayedColumns: string[] = [
		'updated_at',
		'donor',
		'title',
		'amount',
		'pay_period',
		'donorId',
		'mandate_uid',
		'action',
	];
	count!: number;
	dataSource = new MatTableDataSource(ELEMENT_DATA);
	range: UntypedFormGroup;
	searchInputForm: UntypedFormGroup;
	debounceDelay: number = 1000; //debounce delay for search input and category selectionChange
	currentIndex: number = 1000;
	isLoading!: boolean;
	toggleValue: boolean = true;
	toggleOn: boolean = true;
	ischecked: boolean = true;
	showMessage: boolean = false;
	isPaginatorLoading: boolean = false;
	progressBarMode: ProgressBarMode = 'determinate';
	progressbarValue: number = 0;
	recurringReceivedDonationFileName: string = `recurring-received-donation-${new Date().toISOString()}`;
	maxDate: Date = new Date();
	check: boolean = false;
	startDatePlace = $localize`:@@startDate_placeholder:Start date`;
	endDatePlace = $localize`:@@endDate_placeholder:End date`;
	searchPlace = $localize`:@@search_placeholder:search`;
	dateRangeTooltip = $localize`:@@date_range_tooltip:Select Date Range first`;
	locale: string = '';
	csvCheck: boolean = false;
	csvLoading: boolean = false;
	constructor(
		private _dashboardService: DashboardService,
		private _notificationService: NotificationService,
		public dialog: MatDialog,
		private _accountService: AccountService
	) {
		this.range = new UntypedFormGroup({
			start: new UntypedFormControl(),
			end: new UntypedFormControl(),
		});
		this.searchInputForm = new UntypedFormGroup({
			searchCtrl: new UntypedFormControl(),
		});

		this.locale = this._accountService.getLocaleId();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.isToggled) {
			this.isToggled = changes.isToggled.currentValue;
		}

		if (changes.donationRecurringReceived.currentValue) {
			ELEMENT_DATA = this.dataFilter(
				this.donationRecurringReceived.donationRecurringReceived
			);
			this.dataSource = new MatTableDataSource(ELEMENT_DATA);
			this.count = this.donationRecurringReceived.count;
			if (!this.count) {
				this.searchInputForm?.disable({ emitEvent: false });
				this.range?.disable({ emitEvent: false });
			}
		}
	}
	ngOnInit(): void {
		this.paginator._intl.itemsPerPageLabel = $localize`:@@mat_paginator_label:items per page`;
		let startDateRange = this.range?.controls.start.value;
		let endDateRange = this.range?.controls.end.value;
		this._dashboardService
			.getRecurringReceivedDonation(
				new HttpParams({
					fromObject: {
						['language_code']: this.locale || 'nl',
						['page']: 1,
						['limit']: 20,
						['from_date']:
							Math.floor(startDateRange / 1000) || new Date().getTime() || 0,
						['to_date']:
							Math.floor(endDateRange / 1000) ||
							new Date().getTime() ||
							Math.floor(Date.now() / 1000),
						['filter']: '',
					},
				})
			)
			.subscribe((res) => {
				let donationRecurringReceivedObj =
					this._dashboardService.getRecurringReceivedDonationObj(res);
				if (donationRecurringReceivedObj.count == 0) {
					this.check = true;
				} else {
					this.check = false;
				}
				ELEMENT_DATA = this.dataFilter(
					donationRecurringReceivedObj.donationRecurringReceived
				);
				this.dataSource = new MatTableDataSource(ELEMENT_DATA);
				this.paginator.length = donationRecurringReceivedObj.count;
				// if (donationRecurringReceivedObj.count == 0) {
				// 	this.check = true;
				// }
				/** *loading flag and progress bar setting */
				this.startDeterminateProgress();
				this.finishDeterminateProgress();
			});
	}
	ngAfterViewInit() {
		// this.paginator.pageSizeOptions = [20];
		// this.dataSource.paginator = this.paginator;
		// this.paginator.page.subscribe((event) => {
		// 	const pageIndex = event.pageIndex;
		// 	const pageSize = event.pageSize;
		// });

		this.range?.controls.end.valueChanges.subscribe((dateChange) => {
			let startDateRange = this.range?.controls.start.value;
			let endDateRange = this.range?.controls.end.value;

			if (endDateRange) {
				this.csvCheck = true;
				this.startLoading();
				this.startIndeterminateProgress();

				this._dashboardService
					.getRecurringReceivedDonation(
						new HttpParams({
							fromObject: {
								['language_code']: this.locale || 'nl',
								['page']: 1,
								['limit']: 20,
								['from_date']:
									Math.floor(startDateRange / 1000) ||
									new Date().getTime() ||
									0,
								['to_date']:
									Math.floor(endDateRange / 1000) ||
									new Date().getTime() ||
									Math.floor(Date.now() / 1000),
								['filter']: '',
							},
						})
					)
					// ['to_date']: Math.floor(Date.now() / 1000),
					.subscribe((res) => {
						let donationRecurringReceivedObj =
							this._dashboardService.getRecurringReceivedDonationObj(res);
						ELEMENT_DATA = this.dataFilter(
							donationRecurringReceivedObj.donationRecurringReceived
						);
						this.dataSource = new MatTableDataSource(ELEMENT_DATA);
						this.paginator.length = donationRecurringReceivedObj.count;
						// if (donationRecurringReceivedObj.count == 0) {
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
						// // console.log(`query x: ${x}, y: ${y} are identical, api called interrupted`);
						// this.cancelLoadingAndProgress();
						this.cancelLoadingAndProgress();
						return true;
					}
					// if (this.isLoading && this.progressBarMode === 'query') {
					// 	//TODO: If true then, new API request made while one is already running. (user switchMap from rxjs to resolve this scenario: https://www.learnrxjs.io/learn-rxjs/operators/transformation/switchmap)
					// }
					return false;
				})
			)
			.subscribe((searchInput: any) => {
				/** *loading flag and progress bar setting */
				this.startLoading();
				this.startQueryProgress();
				let startDateRange = this.range?.controls.start.value;
				let endDateRange = this.range?.controls.end.value;
				this._dashboardService
					.getRecurringReceivedDonation(
						new HttpParams({
							fromObject: {
								['language_code']: this.locale || 'nl',
								['page']: 1,
								['limit']: 20,
								['from_date']: new Date(startDateRange).getTime() || 0,
								['to_date']: startDateRange
									? Math.floor(endDateRange / 1000) ||
									  Math.floor(Date.now() / 1000)
									: new Date().getTime(),
								['filter']: searchInput || '',
							},
						})
					)
					.subscribe((res) => {
						this.startDeterminateProgress();
						let donationRecurringReceivedObj =
							this._dashboardService.getRecurringReceivedDonationObj(res);
						ELEMENT_DATA = this.dataFilter(
							donationRecurringReceivedObj.donationRecurringReceived
						);
						this.dataSource = new MatTableDataSource(ELEMENT_DATA);
						this.paginator.length = donationRecurringReceivedObj.count;

						this.finishDeterminateProgress();
					});
			});
	}

	/** *Save CSV */
	saveCsv() {
		// 	/** To ensure To date is not empty default will be todays date. */
		this.csvLoading = true;
		let searchInput = this.searchInputForm.controls.searchCtrl.value;
		let startDateRange = this.range.controls.start.value;
		let endDateRange = this.range.controls.end.value;
		let pageIndex = this.paginator.pageIndex;
		let pageSize = this.paginator.pageSize;
		this._dashboardService
			.getRecurringReceivedDonation(
				new HttpParams({
					fromObject: {
						['filter']: searchInput || '',
						['language_code']: this.locale || 'nl',
						['page']: 1,
						['limit']: 20,
						['from_date']: Math.floor(startDateRange / 1000) || 0,
						['to_date']: Math.floor(endDateRange / 1000),

						// ['sort_col']: 'created_at',
						// ['sort_direction']: 'asc',
						// ['page']: pageIndex + 1,
						// ['page_size']: this.paginator.length,
						// ['from_date']: new Date(startDateRange).getTime() || 0,
						// ['to_date']: new Date(endDateRange).getTime() || new Date().getTime(),
					},
				})
			)
			.subscribe((transactions: any) => {
				console.log('transactions', transactions);
				let csvContent = 'data:text/csv;charset=utf-8,';
				csvContent +=
					['Date', 'Name', 'Interval', 'Fundraiser', 'Donation', 'Status'].join(
						','
					) + '\r\n';
				const walletTransactions = transactions['data']['result']['result'];
				walletTransactions.forEach(function (rowArray: any) {
					const row = [
						rowArray?.updated_at,
						rowArray?.name,
						rowArray?.pay_period,
						rowArray?.title,
						rowArray?.amount,
						rowArray?.status,
					];
					console.log(rowArray.status);
					csvContent += row + '\r\n';
				});

				//Refactored the download CSV button
				this._dashboardService.downloadCSV(
					csvContent,
					this.recurringReceivedDonationFileName
				);

				this._notificationService.openNotification(
					$localize`:@@balance_csvDownloaded_notification:CSV downloaded successfully`,
					'',
					'success'
				);
				this.csvLoading = false;
			});
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
		this.startPaginatorLoading();
		this.startIndeterminateProgress();
		let searchInput = this.searchInputForm?.controls.searchCtrl.value;
		let startDateRange = this.range?.controls.start.value;
		let endDateRange = this.range?.controls.end.value;
		let pageIndex = this.paginator.pageIndex;
		let pageSize = this.paginator.pageSize;
		this._dashboardService
			.getRecurringReceivedDonation(
				new HttpParams({
					fromObject: {
						['filter']: searchInput || '',
						['page']: pageIndex + 1,
						['limit']: pageSize,
						['language_code']: this.locale || 'nl',
						['from_date']: 0,
						['to_date']: Math.floor(Date.now() / 1000) || new Date().getTime(),
					},
				})
			)
			.subscribe((res) => {
				this.startDeterminateProgress();
				let donationRecurringReceivedObj =
					this._dashboardService.getRecurringReceivedDonationObj(res);
				ELEMENT_DATA = this.dataFilter(
					donationRecurringReceivedObj.donationRecurringReceived
				);
				this.dataSource = new MatTableDataSource(ELEMENT_DATA);
				this.paginator.length = donationRecurringReceivedObj.count;
				this.finishDeterminateProgress();
			});
	}

	dataFilter(sourceList: any) {
		if (!sourceList) {
			return [];
		} else {
			return sourceList.map((source: any) => {
				return {
					address: source.address,
					email: source.email,
					status: source.status,
					amount: source.amount,
					name: source.name,
					title: source.title,
					ownerEmail: source.ownerEmail,
					donorId: source.donorId,
					fundraiserSlug: source.slug,
					fundraiserName: source.title,
					city: source.city,
					pay_period: source.pay_period,
					zipcode: source.zipcode,
					country: source.country,
					mandate_uid: source.mandate_uid,
					updated_at: source.updated_at,
					isAnonymous: source.is_anonymous
						? true
						: this.isNameAnonymous(source.name),
				};
			});
		}
	}
	/** *Donor Full Name Check */
	getDonorFullName(fname: string, name: string) {
		console.log('full', fname + ' ' + name);
		if (this.isNameAnonymous(fname)) return 'Anonymous';
		else return fname + ' ' + name;
	}
	isNameAnonymous(fname: string) {
		if (fname === 'Anonymous') return true;
		else return false;
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
		// while user is giving input set the progress mode as indeterminate
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
	opendialog(e: any) {
		const dialogRef = this.dialog.open(StopRecurringDonationComponent, {});

		console.log(e);
		dialogRef.afterClosed().subscribe((result) => {
			if (result === 'Yes') {
				this.stopRecurringDonation(e);
			} else if (result === 'Cancel') {
			}
		});
	}
	stopRecurringDonation(e: any) {
		this.isLoading = true;
		this._dashboardService
			.stopRecurringDonationRecieved(
				e.mandate_uid,
				e.ownerEmail,
				e.donorId,
				e.fundraiserName,
				e.fundraiserSlug
			)
			.subscribe((res: any) => {
				this.isLoading = false;
				//  window.location.reload()
				console.log(res);
			});
		console.log('yes is clicked', e);
		console.log('this recurring donation is close');
	}
}
