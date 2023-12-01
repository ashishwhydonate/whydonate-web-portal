import {
	Component,
	EventEmitter,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { LegacyProgressBarMode as ProgressBarMode } from '@angular/material/legacy-progress-bar';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { timer } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { BalanceService } from '../balance.service';

@Component({
	selector: 'app-payout-table-mollie',
	templateUrl: './payout-table-mollie.component.html',
	styleUrls: ['./payout-table-mollie.component.scss'],
})
export class PayoutTableMollieComponent implements OnInit {
	displayedColumns: string[] = [
		'date_time',
		'payment_Status',
		'paymentID',
		'paymentAmount',
		// 'action',
	];
	ELEMENT_DATA: any[] = [];
	progressBarMode: ProgressBarMode = 'determinate';
	progressbarValue: number = 0;
	dataSource = new MatTableDataSource(this.ELEMENT_DATA);
	@ViewChild(MatPaginator) paginator: MatPaginator | any;
	isLoading: boolean = false;
	isPaginatorLoading: boolean = false;
	page: number = 1;
	pagesize: number = 20;
	count: number = 0;
	settlementRecivedCount: number = 0;
	downloadName = `Settlements-${new Date().toISOString()}`;
	paymentIdDisabledStatus = $localize`:@@paymentIdDisabledStatus: At the moment we don't support transactions for manual payouts`;
	payout_paid = $localize`:@@payout_paid: Paid`;
	payout_withdrawn = $localize`@@:payout_withdrawn: Withdrawal`;
	payout_failed = $localize`@@:payout_failed: Failed`;
	payout_clearing = $localize`@@:payout_clearing: Clearing`;
	payout_transfer = $localize`@@:payout_transfer: Transfer`;
	payout_current = $localize`@@:payout_current: Current`;
	@Output() openTransactionsForSettlememntId = new EventEmitter();

	constructor(
		private _notificationService: NotificationService,
		public media: MediaObserver,
		private _balanceService: BalanceService
	) {}

	ngOnInit(): void {
		/** *Get The Settlements */
		this.getSettlements();
	}

	getSettlements() {
		this.startLoading();
		this._balanceService
			.getPayouts(this.page, this.pagesize)
			.subscribe((response: any) => {
				let settlementObj = response?.data?.result;
				this.ELEMENT_DATA = this.filterData(settlementObj);
				this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
				this.dataSource.paginator = this.paginator;
				this.count = response?.data?.count;
				this.settlementRecivedCount = this.count;
			});
		this.endLoading();
	}

	changePage(event: any) {
		this.startLoading();
		this.startPaginatorLoading();

		let pageIndex = this.paginator.pageIndex + 1;
		let pageSize = this.paginator.pageSize;

		this._balanceService
			.getPayouts(pageIndex, pageSize)
			.subscribe((res: any) => {
				this.startDeterminateProgress();
				let settlementObj = res?.data?.result;
				this.ELEMENT_DATA = this.filterData(settlementObj);
				this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
				//this.dataSource.paginator = this.paginator;
				this.count = res?.data?.count;
				this.settlementRecivedCount = this.count;
				this.startDeterminateProgress();
				this.finishDeterminateProgress();
				this.endLoading();
			});
	}

	/** Pass start and end date to paremt component */

	openTransactions(uid: any) {
		this.openTransactionsForSettlememntId.emit({ uid });
	}

	/** *Filtering Data */
	filterData(sourcelist: any) {
		return sourcelist?.map((source: any) => {
			let updated_date = new Date(source.updated_at);
			updated_date.setMonth(updated_date.getMonth() - 1);

			return {
				updated: new Date(source.created_at),
				time: new Date(source.created_at),
				status: source.status,
				uid: source.payment_id,
				amount_payable: source.amount,
				period_end: new Date(source.created_at),
				period_start: updated_date,
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

	getStatusTranslationKey(status: string): string {
		switch (status) {
			case 'paid':
				return this.payout_paid;
			case 'withdrawal':
				return this.payout_withdrawn;
			default:
				return this.payout_failed;
		}
	}
}
