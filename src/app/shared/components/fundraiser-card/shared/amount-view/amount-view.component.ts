import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { FundraiserCardData } from 'src/app/shared/interfaces/fundraiser-card-interface';

@Component({
	selector: 'app-amount-view',
	templateUrl: './amount-view.component.html',
})
export class AmountViewComponent implements OnInit, OnChanges {
	@Input() fundraiserCardData!: FundraiserCardData;
	@Input() symbol!: any;

	donation_target_amount = 0;
	donation_received_amount = 0;
	currency_symbol: string = '';
	/** *FLAGS */
	isShowOnlyDonationAmountView!: boolean;
	isShowOnlyTargetAmountView!: boolean;
	isShowBothDonationAndTargetAmount!: boolean;
	/** *locale for currency pipe */
	locale: string;
	isObservingResize: any;
	targetElement!: Element;
	constructor(private _AccountService: AccountService) {
		/** *Getting locale from AccountService, for currency pipe */
		this.locale = this._AccountService.getLocaleId();
	}
	ngOnChanges(changes: SimpleChanges): void {
		if (Object.keys(changes.fundraiserCardData?.currentValue || {}).length) {
			this.initialiseFlags();
			this.setDonationAmountTarget();
			this.setViewFlags();
		}
	}

	ngOnInit(): void {}

	initialiseFlags() {
		this.isShowOnlyDonationAmountView = false;
		this.isShowOnlyTargetAmountView = false;
		this.isShowBothDonationAndTargetAmount = false;
	}

	/** * INFO: Set flags for isTargetAmountShow, isOnlyDonationAmountShow, isDonationAndTargetAmountShow, isDaysLeftShow */
	setViewFlags(): void {
		this.setFlagForDonationAmountView();
		this.setFlagForTargetAmountView();
		this.setFlagForDonationAndTargetAmountView();
	}
	setFlagForDonationAmountView(): void {
		if (this.isShowDonationAmount()) {
			this.isShowOnlyDonationAmountView =
				this.isDonationAmountExist() && !this.isTargetAmountExist();
		}
	}
	setFlagForTargetAmountView(): void {
		if (!this.isShowDonationAmount()) {
			this.isShowOnlyTargetAmountView = this.isTargetAmountExist();
		}
	}

	setFlagForDonationAndTargetAmountView(): void {
		if (this.isShowDonationAmount()) {
			this.isShowBothDonationAndTargetAmount =
				this.isDonationAmountExist() && this.isTargetAmountExist();
		}
	}

	/** *Helper functions */

	isShowDonationAmount(): boolean {
		return this.fundraiserCardData?.showDonationAmount || false;
	}
	isDonationAmountExist(): boolean {
		let _donationReceivedAmount =
			Math.round(this.fundraiserCardData?.donationReceivedAmount) || 0;
		return (
			_donationReceivedAmount >= 0 && Number.isInteger(_donationReceivedAmount)
		);
	}
	isTargetAmountExist(): boolean {
		return !!this.fundraiserCardData?.donationTargetAmount;
	}

	setDonationAmountTarget(): void {
		this.donation_received_amount =
			this.fundraiserCardData?.donationReceivedAmount || 0;

		this.donation_target_amount =
			this.fundraiserCardData?.donationTargetAmount || 0;
	}
}
