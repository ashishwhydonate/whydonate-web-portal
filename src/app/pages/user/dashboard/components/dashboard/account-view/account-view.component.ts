import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { CustomBrandingService } from 'src/app/pages/user/custom-branding/services/custom-branding.service';
import { BankService } from 'src/app/pages/user/profile/services/bank.service';
import { ProfileService } from 'src/app/pages/user/profile/services/profile.service';
import { PopupStartFundraiserComponent } from 'src/app/shared/components/popup-start-fundraiser/popup-start-fundraiser.component';

@Component({
	selector: 'app-account-view',
	templateUrl: './account-view.component.html',
	styleUrls: ['./account-view.component.scss'],
})
export class AccountViewComponent implements OnInit {
	complianceStatus: any;
	verificationStatus: boolean = false;
	pendingStatus: boolean = false;
	disapprovedStatus: boolean = false;
	initialStatus: boolean = false;
	overallCheck: boolean = false;
	accountData: any;
	isReceiver: boolean = false;
	notYetCheck: boolean = false;
	showOppOnly: boolean = false;
	showStripeAndOpp: boolean = false;
	showStripeOnly: boolean = false;
	oppVerificationCheck: boolean = false;
	chargesEnabled!: boolean;
	payoutEnabled!: boolean;
	detailsSubmitted!: boolean;
	stripeStatus: any = {};
	firstDonationReceived: number = 0;
	activeOPPDonationCount: any = {};
	constructor(
		private _bankService: BankService,
		public router: Router,
		public _dialog: MatDialog,
		public _customBrandingService: CustomBrandingService,
		private _profileService: ProfileService,
		public _accountService: AccountService
	) {}

	ngOnInit(): void {
		if (this._accountService.checkHeaders()) {
			this._bankService.getStripeStatus().subscribe((res: any) => {
				this.stripeStatus = res?.data;
				console.log('status', this.stripeStatus);
				this.chargesEnabled = this.stripeStatus?.charges_enabled;
				this.payoutEnabled = this.stripeStatus?.payout_enabled;
				this.detailsSubmitted = this.stripeStatus?.details_submitted;
				// console.log('this.detailsSubmitted', this.detailsSubmitted);
				this._profileService.getDonationCount().subscribe((res: any) => {
					this.firstDonationReceived = res?.data?.first_donation_received;
					console.log('first donation received', this.firstDonationReceived);
				});

				this._customBrandingService
					.getIsReceived()
					.subscribe((receivedValue: boolean) => {
						this.isReceiver = receivedValue;
						console.log('receivedValue', this.isReceiver);

						if (this.isReceiver) {
							this._bankService
								.getPersonalVerification()
								.subscribe((res: any) => {
									if (res?.errors?.code == '1005') {
										this.oppVerificationCheck = false;
									} else {
										this.oppVerificationCheck = true;
									}
									if (
										this.firstDonationReceived === 0 &&
										this.stripeStatus.details_submitted === false &&
										this.oppVerificationCheck === true
									) {
										this.showStripeAndOpp = true; //WIll SHOW OPP ONLY
									} else if (
										this.firstDonationReceived === 1 &&
										this.stripeStatus.details_submitted === true &&
										this.oppVerificationCheck === true
									) {
										this.showStripeAndOpp = true; //Will SHOW Stripe & OPP
									} else if (
										this.firstDonationReceived === 1 &&
										this.stripeStatus.details_submitted === false &&
										this.oppVerificationCheck === true
									) {
										this.showStripeAndOpp = true;
									} else {
										this.showStripeOnly = true; //WIll Show Stripe only
									}
									this.complianceStatus = res.data.status;
									this.accountData = res.data;
									console.log('compliance res', res);
									if (
										this.accountData?.contact_phonenumber == 'verified' &&
										this.accountData?.contact_verification == 'verified' &&
										this.accountData?.status == 'unverified'
									) {
										this.overallCheck = true;
									} else {
										this.overallCheck = false;
									}
									switch (this.complianceStatus) {
										case 'pending':
											this.pendingStatus = true;
											this.verificationStatus = false;
											this.disapprovedStatus = false;
											this.initialStatus = false;
											break;
										case 'verified':
											this.pendingStatus = false;
											this.verificationStatus = true;
											this.disapprovedStatus = false;
											this.initialStatus = false;
											break;
										case 'unverified':
											this.pendingStatus = false;
											this.verificationStatus = false;
											this.disapprovedStatus = true;
											this.initialStatus = false;
											break;
										default:
											this.pendingStatus = false;
											this.verificationStatus = false;
											this.disapprovedStatus = false;
											this.initialStatus = true;
											break;
									}
								});
						}
					});
			});
		}
	}

	routeToPayoutSettings() {
		this.router.navigate(['profile', 'payout-settings']);
	}
	routeToCustomBranding() {
		this.router.navigate(['custom-branding']);
	}
	routeToSearch() {
		this.router.navigate(['search']);
	}
	routeToStart() {
		const dialogRef = this._dialog.open(PopupStartFundraiserComponent, {
			width: '80%',
			height: 'fit-content',
			panelClass: 'fundraiser-popup',
		});
	}
}
