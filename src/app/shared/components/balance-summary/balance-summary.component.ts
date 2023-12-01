import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BankService } from 'src/app/pages/user/profile/services/bank.service';
import { BalanceService } from 'src/app/pages/user/balance/balance.service';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { CurrencySelectorService } from '../../services/currency-selector.service';
import { is } from 'cypress/types/bluebird';

@Component({
	selector: 'app-balance-summary',
	templateUrl: './balance-summary.component.html',
	styleUrls: ['./balance-summary.component.scss'],
})
export class BalanceSummaryComponent {
	payoutTooltip = $localize`:@@balance_summary_payout_tooltip: DEMO DEMO DEMO`;
	pendingTooltip = $localize`:@@balance_summary_pending_tooltip: Money from WhyDonate that hasn't yet settled in Stripe.`;
	payoutReadyTooltip = $localize`:@@balance_summary_payoutReady_tooltip: Money that's awaiting payout by WhyDonate.`;
	noDonations: boolean = true;
	stripeBalanceAvailable: number = 0;
	stripeBalancePending: number = 0;
	stripeBalanceInTransit: number = 0;
	stripeBalanceTotal: number = 0;
	currency: any;
	isShowViewButton: boolean = false;
	currencyTooltip: string = 'This is currency';

	constructor(
		public router: Router,
		private _bankService: BankService,
		private _balanceService: BalanceService,
		public accountService: AccountService,
		public currencyService: CurrencySelectorService
	) {}

	ngOnInit(): void {
		//Code to check if view button is visible
		if (this.router.url.includes('/balance')) {
			this.isShowViewButton = false;
		} else {
			this.isShowViewButton = true;
		}

		this.currency = this.currencyService.getSelectedCurrency();

		this.currencyService.selectedCurrency.subscribe((res) => {
			this.currency = this.currencyService.getSelectedCurrency();
			if (this.accountService.checkHeaders()) {
				this._bankService.getStripeStatus().subscribe((res: any) => {
					if (res?.data?.status == false) {
						this.noDonations = true;
					} else {
						this._balanceService
							.getStripeBalance(this.currency?.currency)
							.subscribe((res: any) => {
								this.stripeBalanceAvailable =
									parseFloat(res?.data?.available) || 0;
								this.stripeBalancePending = parseFloat(res?.data?.pending) || 0;
								this.stripeBalanceInTransit =
									parseFloat(res?.data?.in_transit) || 0;
								this.stripeBalanceTotal =
									this.stripeBalanceAvailable +
									this.stripeBalancePending +
									this.stripeBalanceInTransit;
								this.noDonations = false;
							});
					}
				});
			}
		});
	}
	redirectToBalance() {
		this.router.navigate(['/balance']);
	}
}
