import {
	Component,
	EventEmitter,
	Inject,
	OnInit,
	Output,
	PLATFORM_ID,
	ViewChild,
} from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { LegacyProgressBarMode as ProgressBarMode } from '@angular/material/legacy-progress-bar';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { BalanceService } from '../balance.service';
import { interval, Subject, takeUntil, timer } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import {
	animate,
	state,
	style,
	transition,
	trigger,
} from '@angular/animations';
import { indexOf } from 'cypress/types/lodash';
import { DataSource } from '@angular/cdk/collections';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-payout-table',
	templateUrl: './payout-table.component.html',
	styleUrls: ['./payout-table.component.scss'],
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
/** *Payout Table Component */
export class PayoutTableComponent implements OnInit {
	displayedColumns: string[] = [
		'date_time',
		'payment_Status',
		'paymentID',
		'paymentAmount',
		//'action',
	];

	ELEMENT_DATA: any = [];
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	progressBarMode: ProgressBarMode = 'determinate';
	progressbarValue: number = 0;
	dataSource = new MatTableDataSource(this.ELEMENT_DATA);
	@ViewChild(MatPaginator) paginator: MatPaginator | any;
	isLoading: boolean = false;
	isPaginatorLoading: boolean = false;
	page: number = 1;
	pagesize: number = 10;
	count: number = 0;
	settlementRecivedCount: number = 0;
	downloadName = `Settlements-${new Date().toISOString()}`;
	@Output() openTransactionsForSettlememntId = new EventEmitter();
	columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
	settlementData: any = [];
	WithdrawalData: any = [];
	expandedElement: any | null;
	openCoverages = false;
	indexSelectedCoverage = 1;
	panelOpenState = false;
	isBrowser: boolean = false;

	constructor(
		private _notificationService: NotificationService,
		public media: MediaObserver,
		private _balanceService: BalanceService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}
	ngAfterViewInit() {
		// this.dataSource.paginator = this.paginator;
	}
	ngOnInit(): void {
		/** *Get The Settlements */
		this.getSettlements();
	}

	ngOnDestroy(): void {
		/** *Unsubscribe from all subscriptions */
		this._unsubscribeAll.complete();
		this.paginator.pageIndex = 0;
	}

	/** *Getting The Settlements */
	getSettlements() {
		this.startLoading();
		this.startPaginatorLoading();
		this._balanceService
			.getSettlementsOpp(this.page, this.pagesize)
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe(async (response: any) => {
				console.log(response);

				if (response && response.data && response.data.result) {
					let settlementObj = response.data.result;
					//   console.log(settlementObj);

					this.ELEMENT_DATA = this.filterData(settlementObj);
					this.settlementData.push(this.filterData(settlementObj));
					//   console.log('settel', this.settlementData);

					this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
					console.log(this.dataSource);
					this.dataSource.paginator = this.paginator;

					this.count = response.data.total;
					this.settlementRecivedCount = this.count;

					this.startDeterminateProgress();
					this.finishDeterminateProgress();
					this.endLoading();
				} else {
					console.error('Invalid response format');
				}
			});
	}

	/** *Saving The PDF */
	saveCsv(id: any) {
		let settlementByIdObj = {
			settlement_uid: id,
		};

		this._balanceService
			.getSettlementsByID(settlementByIdObj)
			.subscribe((data: any) => {
				let csvContent = 'data:text/csv;charset=utf-8,';
				csvContent +=
					[
						'Start Date',
						'End Date',
						'Payment Status',
						'Payment ID',
						'Amount',
					].join(',') + '\r\n';
				const settlementsObj = data.data.settlement_by_id;

				const row = [
					new Date(settlementsObj.period_start),
					new Date(settlementsObj.period_end),
					settlementsObj.status,
					settlementsObj.uid,
					settlementsObj.amount_payable.toFixed(2),
				];
				csvContent += row + '\r\n';

				const encodedUri = encodeURI(csvContent);
				let link: any;
				if (this.isBrowser) link = document.createElement('a');
				link.setAttribute('href', encodedUri);
				link.setAttribute(
					'download',
					`my_transactions_from_${this.downloadName}.csv`
				);
				link.innerHTML = 'Click Here to download';
				if (this.isBrowser) document.body.appendChild(link); // Required for FF
				link.click();
			});
		this._notificationService.openNotification(
			'PDF downloaded successfully',
			'OK',
			'success'
		);
	}

	changePage(event: any) {
		this.startLoading();
		this.startPaginatorLoading();
		let pageIndex = this.paginator.pageIndex + 1;
		let pageSize = this.paginator.pageSize;

		this._balanceService
			.getSettlementsOpp(pageIndex, pageSize)
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((res: any) => {
				let settlementObj = res?.data?.result;
				this.ELEMENT_DATA = this.filterData(settlementObj);
				this.settlementData = this.filterData(settlementObj);
				this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
				// this.dataSource.paginator = this.paginator;
				this.count = res?.data?.total;
				this.settlementRecivedCount = this.count;
				this.startDeterminateProgress();
				this.finishDeterminateProgress();
				this.endLoading();
			});
	}

	/** Pass start and end date to paremt component */

	openTransactions(settlement_id: any, specifications_id: any) {
		this.openTransactionsForSettlememntId.emit({
			settlement_id,
			specifications_id,
		});
	}

	/** *Filtering Data */
	filterData(sourcelist: any) {
		return sourcelist.map((source: any) => {
			//console.log("source::",source)
			return {
				date_time: new Date(source.settlements.date * 1000),
				payment_Status: source.settlements.status,
				paymentID: source.settlements.settlement_id,
				paymentAmount: (Math.abs(source.settlements.amount) / 100).toFixed(2),
				specifications_id: source.settlements.specification_id,
				withdrawal: source.withdrawal,
			};
		});
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
}

export interface PeriodicElement {
	date_time: Date;
	payment_Status: string;
	paymentID: string;
	paymentAmount: Number;
	specifications_id: string;
	withdrawal: [];
}
