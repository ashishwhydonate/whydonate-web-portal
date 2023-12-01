import { Injectable } from '@angular/core';
import { APIService } from 'src/app/global/services/api.service';
import { ProfileService } from './profile.service';
import { BankAccount } from 'src/app/shared/interfaces/profile/bank-account-interface';
import {
	HttpClient,
	HttpErrorResponse,
	HttpHeaders,
} from '@angular/common/http';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
//** *Bank Service */
export class BankService {
	API_URL: string = environment.apiUrl;
	ACCOUNT_V2: string = environment.ACCOUNT_API_V2;
	private readonly bankAPI = 'account/bank/';
	private readonly verifyWithStripeAPI = 'account/stripe/onboarding';
	private readonly redirectToStripeDashboardAPI =
		'account/stripe/dashboard/link';
	private readonly getStripeStatusAPI = 'account/stripe/status';
	private readonly savePayoutScheduleAPI = 'account/stripe/payout/schedule';
	private readonly userAPI = 'account/user/login/';
	private readonly personalVerificationAPI = 'account/merchant/onboarding';
	header: HttpHeaders;
	private firstAccount = new BehaviorSubject(true);
	$firstAccount = this.firstAccount.asObservable();
	stripeNotification = new BehaviorSubject(true);
	$stripeNotification = this.stripeNotification.asObservable();
	constructor(
		private accountService: AccountService,
		public _APIService: APIService,
		private _ProfileService: ProfileService,
		private http: HttpClient
	) {
		this.header = this.accountService.getHeaders() as HttpHeaders;
	}

	/** *Behaviour Subject to change state of first account value in bank component */
	changeCheck(data: any) {
		this.firstAccount.next(data);
	}
	/** *Behaviour Subject to change state of first account value in bank component */
	changNotificationStatus(data: any) {
		this.stripeNotification.next(data);
	}
	/**
	 * Get Bank Method
	 */
	getBankAccount() {
		return this._ProfileService.get(this.bankAPI);
	}

	getTempAccount() {
		return this._ProfileService.tempGet(this.bankAPI);
	}

	getPersonalVerification() {
		let header = this.accountService.getHeaders();
		return this.http.get(
			`${this.ACCOUNT_V2}${this.personalVerificationAPI}`,

			{
				headers: header,
			}
		);
	}
	postTemAccount(body: object) {
		return this._APIService.post(this.bankAPI, body);
	}

	//** *Adding Bank Account */
	addBankAccount(body: object) {
		console.log('Object in service', body);
		let header = this.accountService.getHeaders();
		return this.http.post(`${this.ACCOUNT_V2}${this.bankAPI}`, body, {
			headers: header,
		});
	}

	//** *Update Bank Account */
	updateBankAccount(body: object) {
		let header = this.accountService.getHeaders();
		return this.http.put(`${this.ACCOUNT_V2}${this.bankAPI}`, body, {
			headers: header,
		});
	}

	/** *Add Personal Verification */
	addPersonalVerification(body: object) {
		let header = this.accountService.getHeaders();
		console.log('HEADER', header);
		return this.http.post(
			`${this.ACCOUNT_V2}${this.personalVerificationAPI}`,
			body,
			{
				headers: header,
			}
		);
	}
	/**
	 * Verify Password
	 */
	verifyPassword(body: object) {
		return this._APIService.post(this.userAPI, body);
	}
	/**
	 * Save Bank Account
	 */
	saveBankAccount(body: object) {
		return this.http.put(`${this.API_URL}${this.bankAPI}`, body, {
			headers: this.header,
		});
	}
	/** *Verify With Stripe */
	redirectToStripeVerification(obj: any) {
		let header = this.accountService.getHeaders();
		return this.http.get(
			`${this.ACCOUNT_V2}${this.verifyWithStripeAPI}?return_url=${obj.return_url}`,
			{
				headers: header,
			}
		);
	}
	/** *Redirect To Stripe Dashboard*/
	redirectToStripeDashboard() {
		let header = this.accountService.getHeaders();

		return this.http.get(
			`${this.ACCOUNT_V2}${this.redirectToStripeDashboardAPI}`,
			{
				headers: header,
			}
		);
	}
	/** *Get Stripe Status */
	getStripeStatus() {
		let header = this.accountService.getHeaders();

		return this.http.get(`${this.ACCOUNT_V2}${this.getStripeStatusAPI}`, {
			headers: header,
		});
	}
	/** *Save Payout schedule */
	schedulePayout(body: object) {
		let header = this.accountService.getHeaders();

		return this.http.post(
			`${this.ACCOUNT_V2}${this.savePayoutScheduleAPI}`,
			body,
			{
				headers: header,
			}
		);
	}
	/**
	 * Handle Error Method
	 */
	handleError(error: HttpErrorResponse) {
		return this._APIService.handleError(error);
	}
	/**
	 * Get Statis Bank
	 */
	getStaticBankAccount() {
		return {
			data: {
				account_holder: 'Test_Account_Holder',
				account_number: 'GB76XBQN09005404936562',
				swift_code: '',
			},
			errors: {},
			status: 200,
		};
	}
}
