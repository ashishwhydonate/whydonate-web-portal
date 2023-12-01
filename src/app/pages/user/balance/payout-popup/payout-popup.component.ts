import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DialogData } from '../../custom-branding/components/custom-branding/branding/template/fundraiser-preview.component';
import { BalanceService } from '../balance.service';
import { CurrencySelectorService } from 'src/app/shared/services/currency-selector.service';

@Component({
	selector: 'app-payout-popup',
	templateUrl: './payout-popup.component.html',
	styleUrls: ['./payout-popup.component.scss'],
})
export class PayoutPopupComponent implements OnInit {
	balance: any;
	approvedAmount: any;
	amountCheck: boolean = false;
	currency: any;
	constructor(
		public notificationService: NotificationService,
		private _balanceService: BalanceService,
		public currencyService: CurrencySelectorService,
		public dialogRef: MatDialogRef<PayoutPopupComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.balance = this.data;
	}

	ngOnInit(): void {
		this.currency = this.currencyService.getSelectedCurrency();
		this._balanceService
			.getTotalBalance(this.currency?.currency)
			.subscribe((res: any) => {
				this.approvedAmount = res.data.balance.amount / 100;
				this.amountCheck = true;
			});
	}
	/** *Create Payout Withdrawal */
	createPayout() {
		let payoutObj = {
			amount: this.approvedAmount,
			currency: this.currency?.currency,
		};
		this._balanceService
			.createPayoutWithdrawal(payoutObj)
			.subscribe((response: any) => {
				console.log('RESPONSE POPUP', response);
				this.close();
			});
	}
	close() {
		this.dialogRef.close(true);
		this.notificationService.openNotification(
			'The payout has been accepted. You will receive the donations within 3 days on your bank account',
			'',
			'success'
		);
	}
	onCloseClick() {
		this.dialogRef.close();
	}
}
