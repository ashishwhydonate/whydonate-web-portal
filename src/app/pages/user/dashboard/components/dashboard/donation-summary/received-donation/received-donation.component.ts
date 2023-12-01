import {
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
import { debounce, distinctUntilChanged } from 'rxjs/operators';
import { interval, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ThankDonarComponent } from 'src/app/shared/components/thank-donar/thank-donar.component';
import {
	LegacyProgressAnimationEnd as ProgressAnimationEnd,
	LegacyProgressBarMode as ProgressBarMode,
} from '@angular/material/legacy-progress-bar';
import { DashboardService } from '../../../../services/dashboard.service';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/pages/account/services/account.service';
/** *Received Donation Interface */
export interface ReceivedDonation {
	date: Date;
	userId: number;
	fundraiserName: string;
	status: string;
	amount: number;
	transaction: string;
	donorId: number;
	donorName: string;
	donorEmail: string;
	receiptName: string;
	address: string;
	city: string;
	zipcode: string;
	country: string;
	isAnonymous: boolean;
	donorReply: string;
	language_code: string;
}

let ELEMENT_DATA: ReceivedDonation[] = [];

@Component({
	selector: 'app-received-donation',
	templateUrl: './received-donation.component.html',
	styleUrls: ['./received-donation.component.scss'],
})
/** *Received Donation Component */
export class ReceivedDonationComponent implements OnInit, OnChanges {
	@Input() donationReceived!: any;
	@ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
	displayedColumns: string[] = [
		'date',
		'donor',
		'fundraiser_name',
		'language',
		'amount',
		'transaction',
		'action',
	];
	count!: number;
	dataSource = new MatTableDataSource(ELEMENT_DATA);
	isLoading!: boolean;
	isPaginatorLoading: boolean = false;
	progressBarMode: ProgressBarMode = 'determinate';
	progressbarValue: number = 0;
	range: UntypedFormGroup;
	searchInputForm: UntypedFormGroup;
	debounceDelay: number = 1000; //debounce delay for search input and category selectionChange
	API_URL: string = environment.apiUrl;
	RECEIPT_URL: string = 'accounting/receipt';
	ReceivedDonationFileName: string = `received-donation-${new Date().toISOString()}`;
	maxDate: Date = new Date();
	check: boolean = false;
	startDatePlace = $localize`:@@startDate_placeholder:Start date`;
	endDatePlace = $localize`:@@endDate_placeholder:End date`;
	searchPlace = $localize`:@@search_placeholder:search`;
	dateRangeTooltip = $localize`:@@date_range_tooltip:Select Date Range first`;

	public currentLanguageCode: string = '';
	csvCheck: boolean = false;
	csvLoading: boolean = false;
	languageIconPath: string =
		'https://res.cloudinary.com/whydonate/image/upload/v1689152641/whydonate-production/platform/svg-icons/';
	languageCodeTooltip = $localize`:@@donationSummary_received_donation_tooltip:This shows which language the donor speaks.`;

	constructor(
		private _dashboardService: DashboardService,
		private _notificationService: NotificationService,
		public dialog: MatDialog,
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
		if (changes.donationReceived.currentValue) {
			ELEMENT_DATA = this.dataFilter(this.donationReceived.donationReceived);
			this.dataSource = new MatTableDataSource(ELEMENT_DATA);
			// this.translate();
			this.count = this.donationReceived.count;
			if (!this.count) {
				this.searchInputForm?.disable();
				this.range?.disable();
			}
		}
	}

	ngOnInit(): void {
		if (this.accountService.checkHeaders()) {
			this.translate();
			this.paginator._intl.itemsPerPageLabel = $localize`:@@mat_paginator_label:items per page`;

			let startDateRange = this.range?.controls.start.value;
			let endDateRange = this.range?.controls.end.value;

			this._dashboardService
				.getDonationReceived(
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
					let donationReceivedObj =
						this._dashboardService.getDonationReceivedObj(res);
					if (donationReceivedObj?.count == 0) {
						this.check = true;
					} else {
						this.check = false;
					}
					ELEMENT_DATA = this.dataFilter(donationReceivedObj.donationReceived);

					this.dataSource = new MatTableDataSource(ELEMENT_DATA);
					this.translate();
					this.paginator.length = donationReceivedObj.count;
					// if (donationReceivedObj.count == 0) {
					// 	this.check = true;
					// }
					/** *loading flag and progress bar setting */
					this.startDeterminateProgress();
					this.finishDeterminateProgress();
				});
		}
	}

	ngAfterViewInit() {
		if (this.accountService.checkHeaders()) {
			this.range?.controls.end.valueChanges.subscribe((dateChange) => {
				let startDateRange = this.range?.controls.start.value;
				let endDateRange = this.range?.controls.end.value;
				if (endDateRange) {
					this.csvCheck = true;
					this.startLoading();
					this.startIndeterminateProgress();

					this._dashboardService
						.getDonationReceived(
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
						.subscribe((res: any) => {
							let donationReceivedObj =
								this._dashboardService.getDonationReceivedObj(res);
							ELEMENT_DATA = this.dataFilter(
								donationReceivedObj.donationReceived
							);

							this.dataSource = new MatTableDataSource(ELEMENT_DATA);
							this.translate();
							this.paginator.length = donationReceivedObj.count;
							// if (donationReceivedObj.count == 0) {
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
						.getDonationReceived(
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
							let donationReceivedObj =
								this._dashboardService.getDonationReceivedObj(res);
							ELEMENT_DATA = this.dataFilter(
								donationReceivedObj.donationReceived
							);
							this.dataSource = new MatTableDataSource(ELEMENT_DATA);
							this.translate();
							this.paginator.length = donationReceivedObj.count;

							this.finishDeterminateProgress();
						});
				});
		}
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
				.getDonationReceived(
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
					let csvContent = 'data:text/csv;charset=utf-8,';
					csvContent +=
						[
							'Date',
							'Name',
							'Fundraiser',
							'Status',
							'Language',
							'Donatie',
							'Details',
						].join(',') + '\r\n';
					const walletTransactions = transactions.data['results'];
					walletTransactions.forEach(function (rowArray: any) {
						const formattedDate = new Date(rowArray.created_at).toISOString();
						// const formattedDate = new Date(rowArray.created_at).toISOString().replace(/T/, ' ').replace(/Z/, '');
						const row = [
							formattedDate,
							// rowArray.created_at,
							rowArray.donor.full_name + ' ' + rowArray.donor.last_name,
							rowArray.fundraising_local.title,
							rowArray.status,
							rowArray.language_code.toUpperCase(),
							rowArray.amount,
							rowArray.donor.email,
						];
						csvContent += row + '\r\n';
					});
				});
		}
	}

	clearDateRange() {
		this.range.patchValue(
			{ start: '', end: '' },
			{
				onlySelf: true,
				emitEvent: false,
			}
		);
		this.csvCheck = false;
	}

	openDialog(ind: any): void {
		// this.replyMessage=true;
		const dialogRef = this.dialog.open(ThankDonarComponent, {
			width: '80vh',

			data: {
				count: {
					reply_message: ind.donorReply,
					id: ind.id,
				},
			},
		});
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
				.getDonationReceived(
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
					let donationReceivedObj =
						this._dashboardService.getDonationReceivedObj(res);
					ELEMENT_DATA = this.dataFilter(donationReceivedObj.donationReceived);
					this.dataSource = new MatTableDataSource(ELEMENT_DATA);
					this.translate();
					this.paginator.length = donationReceivedObj.count;

					this.finishDeterminateProgress();
				});
		}
	}

	downloadReceipt(transaction: string) {
		this.router.navigate(['/donate', 'receipt', 'download'], {
			queryParams: { id: transaction },
		});
		// let url = environment.apiUrl + 'accounting/receipt?order_id=' + transaction;
		// window.open(url, '_blank');
	}

	notifyCSVDownload() {
		this._notificationService.openNotification(
			$localize`:@@given_donation_csvDownload:CSV downloaded`,
			'',
			'success'
		);
	}

	dataFilter(sourceList: any) {
		if (!sourceList) {
			return [];
		} else {
			return sourceList.map((source: any) => {
				return {
					date: new Date(source?.created_at),
					userId: source?.user_id,
					fundraiserName: source?.fundraising_local?.title,
					status: source?.status,
					amount: source?.amount,
					transaction_id: source?.payment_transaction_id,
					donorId: source?.donor?.id,
					donorName: this.getDonorFullName(
						source?.donor?.full_name,
						source?.donor?.last_name
					),
					donorEmail: source?.donor?.email,
					receiptName: source?.name,
					address: source?.donor?.address,
					city: source?.donor?.city,
					zipcode: source?.donor?.zipcode,
					country: source?.donor?.country,
					isAnonymous: source?.is_anonymous
						? true
						: this.isNameAnonymous(source?.donor?.full_name),
					donorReply: source?.donor?.reply_message,
					id: source?.id,
					language_code: source?.language_code,
					symbol: source?.symbol,
				};
			});
		}
	}

	getDonorFullName(fname: string, lname: string) {
		if (this.isNameAnonymous(fname)) return 'Anonymous';
		else return fname + ' ' + lname;
	}

	isNameAnonymous(fname: string) {
		if (fname === 'Anonymous') return true;
		else return false;
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
