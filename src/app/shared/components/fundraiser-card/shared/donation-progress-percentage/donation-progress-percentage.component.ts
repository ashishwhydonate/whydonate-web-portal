import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { FundraiserCardData } from 'src/app/shared/interfaces/fundraiser-card-interface';

@Component({
	selector: 'app-donation-progress-percentage',
	templateUrl: './donation-progress-percentage.component.html',
})
export class DonationProgressPercentageComponent implements OnInit, OnChanges {
	@Input() fundraiserCardData!: FundraiserCardData;
	@Input() showLabel = false;

	donation_target_amount!: number;
	donation_received_amount!: number;
	donation_progress_percentage!: number;
	/** *FLAGS */
	isShowBothDonationAndTargetAmount!: boolean;

	constructor() {}
	ngOnChanges(changes: SimpleChanges): void {
		this.initialiseFalgsAndValues();
		this.setDonationAmountAndTarget();
		this.setDonationProgressValue();
		this.setFlagForDonationAndTargetAmountView();
	}

	ngOnInit(): void {}

	initialiseFalgsAndValues() {
		this.donation_target_amount = 0;
		this.donation_received_amount = 0;
		this.donation_progress_percentage = 0;
		this.isShowBothDonationAndTargetAmount = false;
	}
	setDonationAmountAndTarget(): void {
		this.donation_received_amount =
			this.fundraiserCardData?.donationReceivedAmount || 0;

		this.donation_target_amount =
			this.fundraiserCardData?.donationTargetAmount || 0;
	}

	setFlagForDonationAndTargetAmountView(): void {
		if (this.isShowDonationAmount()) {
			this.isShowBothDonationAndTargetAmount =
				this.isDonationAmountExist() && this.isTargetAmountExist();
		}
	}
	/** * INFO: set percentage value for donation progress, condition to be true: show donation amount, donation amount not 0, donation target not 0 */
	setDonationProgressValue(): void {
		if (
			this.isShowDonationAmount() &&
			this.isDonationAmountExist() &&
			this.isTargetAmountExist()
		) {
			this.donation_progress_percentage =
				(this.donation_received_amount / this.donation_target_amount) * 100;
		}
	}

	/** *Helper functions */
	isShowDonationAmount(): boolean {
		return this.fundraiserCardData?.showDonationAmount || false;
	}
	isDonationAmountExist(): boolean {
		let _donationReceivedAmount =
			this.fundraiserCardData?.donationReceivedAmount || 0;

		return (
			_donationReceivedAmount >= 0 && Number.isInteger(_donationReceivedAmount)
		);
	}
	isTargetAmountExist(): boolean {
		return !!this.fundraiserCardData?.donationTargetAmount;
	}
}
