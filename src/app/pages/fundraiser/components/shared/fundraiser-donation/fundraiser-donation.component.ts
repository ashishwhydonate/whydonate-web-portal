import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DonationService } from 'src/app/pages/donation/services/donation.service';
import { Fundraiser } from '../../../models/fundraiser';

// import { SharePopupComponent } from '../../view-fundraiser/share-fundraiser/share-popup/share-popup.component';

import { ShareDialogComponent } from '../../dialogs/share-dialog/share-dialog.component';
import { FundraiserService } from '../../../services/fundraiser.service';
import { MediaObserver } from '@angular/flex-layout';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { FundraiserCardData } from 'src/app/shared/interfaces/fundraiser-card-interface';
import { BankService } from 'src/app/pages/user/profile/services/bank.service';
@Component({
	selector: 'app-fundraiser-donation',
	templateUrl: './fundraiser-donation.component.html',
})
/** *Fundraiser Donation Component */
export class FundraiserDonationComponent implements OnInit {
	@Input() fundraiserCardData!: FundraiserCardData;
	@Input() targetAmount: number = 0;
	@Input() raisedAmount: number = 0;
	@Input() selectedFundraiser: Fundraiser | undefined;
	@Input() showEdits: boolean = false;
	@Input() isDraftOrClosed: boolean = false;
	@Input() isNewFundraiser: boolean = false;
	@Input() daysLeft: number = 0;
	@Input() isLoggedIn: boolean = false;
	@Input() isFindable: boolean = false;
	@Input() isOpen: boolean = false;
	@Input() isDraft: boolean = false;

	editDonationAmountURL: string = '/fundraising/donation-amount/';
	temp: boolean = false;
	progress: number = 0;
	disableDonation: boolean = false;
	donationService: any;
	router: any;
	currentFundraiser: any;
	slug: string = '';
	locale: string;
	stripeStatus: any;
	stripeNotificationCheck: boolean = false;
	donationToolTipMessage: string = 'The fundraiser has been closed';
	stripeChargeStatus!: boolean;
	constructor(
		donationService: DonationService,
		router: Router,
		private _AccountService: AccountService,
		public _media: MediaObserver,
		public dialog: MatDialog,
		public fundraiserService: FundraiserService,
		public _bankService: BankService
	) {
		this.locale = this._AccountService.getLocaleId();
		this.donationService = donationService;
		this.router = router;
	}

	ngOnInit(): void {
		/** *Get Stripe Verification Check to disable/enable donation button */
		if (this.isLoggedIn == true && this._AccountService.checkHeaders()) {
			this._bankService.getStripeStatus().subscribe((res: any) => {
				this.stripeStatus = res?.data;
				//Checking that either user is verified with Stripe or not
				if (
					this.stripeStatus?.charges_enabled == false &&
					this.stripeStatus?.payout_enabled == false &&
					this.stripeStatus?.details_submitted == false
				) {
					this.stripeNotificationCheck = true;
				} else {
					this.stripeNotificationCheck = false;
					this.donationToolTipMessage =
						'Account verification is mandatory to receive donation and payouts.';
				}
			});
		}

		if (this.targetAmount != 0) {
			this.progress = (this.raisedAmount / this.targetAmount) * 100;
			this.temp = true;
		}

		if (this.progress > 100) {
			this.disableDonation = false;
		}

		this.fundraiserService
			.getStripeChargesStatus(this.selectedFundraiser?.slug)
			.subscribe((res: any) => {
				this.stripeChargeStatus = res?.data?.status;
			});
	}
	/** *Donate */
	donate() {
		this.donationService.setSelectedFundraiser(this.selectedFundraiser);
		this.router.navigate(['donate/' + this.selectedFundraiser?.slug]);
	}

	openShareDialog() {
		this.dialog.open(ShareDialogComponent, {
			panelClass: 'max-w-100--panelClass',
			maxHeight: '89vh',
			maxWidth: '90vw',
			width: '95vw',
			data: {
				fundraiser: this.selectedFundraiser,
				data: this.fundraiserCardData,
			},
		});
	}

	goToEditAmount() {
		console.log('targetAmount', this.targetAmount);
		this.router.navigate([
			this.editDonationAmountURL,
			this.selectedFundraiser?.slug,
			{
				raisedAmount: this.raisedAmount,
				targetAmount: this.targetAmount,
				progress: this.progress,
			},
		]);
	}
}
