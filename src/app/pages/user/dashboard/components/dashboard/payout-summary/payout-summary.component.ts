import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { BankService } from 'src/app/pages/user/profile/services/bank.service';

@Component({
	selector: 'app-payout-summary',
	templateUrl: './payout-summary.component.html',
	styleUrls: ['./payout-summary.component.scss'],
})
export class PayoutSummaryComponent {
	paymentTooltip = $localize`:@@payout_summary_payment_tooltip: DEMO DEMO DEMO`;
	payoutTooltip = $localize`:@@payout_summary_payout_tooltip: DEMO DEMO DEMO`;
	chargesEnabled!: boolean;
	payoutEnabled!: boolean;
	detailsSubmitted!: boolean;
	stripeStatus: any = {};
	accentText: boolean = false;

	constructor(
		public router: Router,
		private _bankService: BankService,
		public accountService: AccountService
	) {}

	ngOnInit(): void {
		if (this.accountService.checkHeaders()) {
			this._bankService.getStripeStatus().subscribe((res: any) => {
				this.stripeStatus = res?.data;
				this.chargesEnabled = this.stripeStatus?.charges_enabled;
				this.payoutEnabled = this.stripeStatus?.payout_enabled;
				this.detailsSubmitted = this.stripeStatus?.details_submitted;
				if (this.chargesEnabled == true && this.payoutEnabled == true) {
					this.accentText = true;
				}
			});
		}
	}
	redirectToPayout() {
		this.router.navigate(['/profile/payout-settings']);
	}
}
