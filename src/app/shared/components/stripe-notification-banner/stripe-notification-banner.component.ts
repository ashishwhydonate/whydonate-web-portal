import { isPlatformBrowser } from '@angular/common';
import {
	Component,
	EventEmitter,
	Inject,
	OnInit,
	Output,
	PLATFORM_ID,
} from '@angular/core';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { BankService } from 'src/app/pages/user/profile/services/bank.service';

@Component({
	selector: 'app-stripe-notification-banner',
	templateUrl: './stripe-notification-banner.component.html',
	styleUrls: ['./stripe-notification-banner.component.scss'],
})
/** *Stripe Notification Banner Component */
export class StripeNotificationBannerComponent implements OnInit {
	stripeVerificationCheck: boolean = false;
	@Output() hideBar = new EventEmitter<any>();
	stripeStatus: any = {};
	isLoading: boolean = false;
	isBrowser: boolean = false;
	constructor(
		private _bankService: BankService,
		private _accountService: AccountService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	ngOnInit(): void {
		if (this._accountService.checkHeaders()) {
			//Getting Stripe Status for maintaing the notification banner
			this._bankService.getStripeStatus().subscribe((res: any) => {
				this.stripeStatus = res?.data;
				console.log('status notification bar', this.stripeStatus);
				if (this.stripeStatus != null && this.stripeStatus.status == 'new') {
				}
			});
		}
	}

	/** *Verify With Stripe Function */
	verifyWIthStripe() {
		if (this._accountService.checkHeaders()) {
			let newTab: any;
			if (this.isBrowser) newTab = window.open();
			this.stripeVerificationCheck = true;
			this.isLoading = true;
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
			//Redirecting To Stripe Verification Link
			this._bankService
				.redirectToStripeVerification(obj)
				.subscribe((res: any) => {
					this.isLoading = false;
					if (newTab != null) {
						newTab.location.href = res?.data?.url;
					} else {
						if (this.isBrowser)
							window.alert('Browser has blocked the popup window');
					}
					this.stripeVerificationCheck = false;
				});
		}
	}
}
