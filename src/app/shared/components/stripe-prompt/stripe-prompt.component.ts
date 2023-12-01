import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { BankService } from 'src/app/pages/user/profile/services/bank.service';

@Component({
	selector: 'app-stripe-prompt',
	templateUrl: './stripe-prompt.component.html',
	styleUrls: ['./stripe-prompt.component.scss'],
})
/** *Stripe Prompt Component */
export class StripePromptComponent implements OnInit {
	slug: string = '';
	stripeVerificationCheck: boolean = false;
	isLoading: boolean = false;
	isBrowser: boolean = false;
	constructor(
		private activatedRoute: ActivatedRoute,
		private _router: Router,
		private _bankService: BankService,
		private _accountService: AccountService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	ngOnInit(): void {
		//Getting the slug from the url
		this.slug = this.activatedRoute.snapshot.paramMap.get('slug') || '';
	}

	/** *Connect With Stripe Button */
	connectWithStripe() {
		this.stripeVerificationCheck = true;
		//Generate Url
		let returnURL: string = '';
		if (this.isBrowser)
			returnURL =
				window.location.protocol +
				'//' +
				window.location.hostname +
				'/' +
				this._accountService.getLocaleId() +
				'/profile/payout-settings';

		//=========================================================/
		// Change return URL for localhost, **For dev purpose only
		if (this.isBrowser)
			if (window.location.hostname == 'localhost') {
				returnURL = 'http://localhost:4200/profile/payout-settings';
			}

		//  Creating Obj for Editing Bank Account Details
		let obj: any = {
			return_url: returnURL,
		};
		//Redirection To Stripe Verification Page
		this._bankService
			.redirectToStripeVerification(obj)
			.subscribe((res: any) => {
				console.log('RESPONSE', res);
				if (this.isBrowser) window.open(res?.data?.url);
				this.stripeVerificationCheck = false;
			});
	}

	/** *Will Verify With Stripe Later Button */
	doItLater() {
		this.isLoading = true;
		this._router.navigate([`fundraising/${this.slug}`]);

		this.isLoading = false;
	}
}
