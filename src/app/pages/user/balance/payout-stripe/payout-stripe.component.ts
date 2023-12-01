import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { BankService } from '../../profile/services/bank.service';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-payout-stripe',
	templateUrl: './payout-stripe.component.html',
	styleUrls: ['./payout-stripe.component.scss'],
})

/*
 * Payout Stripe Component
 */
export class PayoutStripeComponent implements OnInit {
	stripeDashboardCheck: boolean = false;
	isBrowser: boolean = false;
	@Input() chargesEnabled: boolean = false;

	constructor(
		public _bankService: BankService,
		public _accountService: AccountService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	ngOnInit(): void {}

	/*
	 * Stripe Dashboard Redirection
	 */
	stripeDashboard() {
		if (this._accountService.checkHeaders()) {
			let newTab: any;
			if (this.isBrowser) newTab = window.open();
			this.stripeDashboardCheck = true;

			//Redirection To Stripe Dashboard
			this._bankService.redirectToStripeDashboard().subscribe((res: any) => {
				if (newTab != null) {
					newTab.location.href = res?.data?.url;
				}
				this.stripeDashboardCheck = false;
			});
		}
	}
}
