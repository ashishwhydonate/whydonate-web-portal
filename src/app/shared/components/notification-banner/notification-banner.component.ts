import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BankService } from 'src/app/pages/user/profile/services/bank.service';

@Component({
	selector: 'app-notification-banner',
	templateUrl: './notification-banner.component.html',
})
export class NotificationBannerComponent implements OnInit {
	@Output() publish = new EventEmitter<any>();
	@Input() slug: string = '';
	@Input() isCurrentChildFundraiser: boolean = false;
	chargesEnabled!: boolean;
	payoutEnabled!: boolean;
	stripeStatus: any = {};
	detailsSubmitted!: boolean;
	oppVerificationCheck: boolean = false;
	showStripePrompt!: boolean;
	isSave: boolean = false;
	constructor(private _bankService: BankService, private router: Router) {}

	ngOnInit(): void {}
	emitPublishClick() {
		this.isSave = true;

		this._bankService.getStripeStatus().subscribe((res: any) => {
			this.stripeStatus = res?.data;
			this.chargesEnabled = this.stripeStatus?.charges_enabled;
			this.payoutEnabled = this.stripeStatus?.payout_enabled;
			this.detailsSubmitted = this.stripeStatus?.details_submitted;
			this._bankService.getPersonalVerification().subscribe((res: any) => {
				if (res?.errors?.code === '1005') {
					this.oppVerificationCheck = true;
				} else {
					this.oppVerificationCheck = false;
				}
				if (
					this.chargesEnabled === true &&
					this.payoutEnabled === true &&
					this.detailsSubmitted === true &&
					this.oppVerificationCheck === true
				) {
					this.showStripePrompt = false;
				} else if (
					this.chargesEnabled === false &&
					this.payoutEnabled === false &&
					this.detailsSubmitted === false &&
					this.oppVerificationCheck === false
				) {
					this.showStripePrompt = false;
				} else if (
					this.chargesEnabled === true &&
					this.payoutEnabled === true &&
					this.detailsSubmitted === true &&
					this.oppVerificationCheck === false
				) {
					this.showStripePrompt = false;
				} else {
					this.showStripePrompt = true;
				}

				// Route To Publish
				if (this.showStripePrompt == false) {
					this.publish.emit(true);
					// this.isSave = false;
				} else {
					this.router.navigate([
						'fundraising/stripe-prompt',
						{ slug: this.slug },
					]);
					// this.isSave = false;
				}
			});
		});
	}
}
