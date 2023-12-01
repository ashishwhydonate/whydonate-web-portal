import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from 'src/app/global/services/api.service';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
/** *Balance Service */
export class BalanceService {
	API_URL: string = environment.apiUrl;
	WALLET_URL: string = environment.wallet_url;
	ACCOUNT_URL: string = environment.ACCOUNT_API_V2;
	ACCOUNTING_URL: string = environment.ACCOUNTING_API;
	private readonly transactionBalanceAPI = 'accounting/transaction/balance/';
	private readonly transactionListsAPI = 'accounting/transaction/';
	private readonly donationGivenAPI = 'donation/order/donor/';
	private readonly balanceTotal = 'balance';
	private readonly settlementOpp = 'account/settlements/opp';
	private readonly payouts = 'account/payouts';
	private readonly settlementById = '/settlement_by_id';
	private readonly withdrawalPayout = 'create-withdrawal';
	private readonly transactionsListOpp = 'accounting/transactions/opp';
	private readonly withdrawalOpp = 'accounting/withdrawal/opp';
	private readonly payoutScheduleAPI = 'account/stripe/payout/schedule';

	private header!: HttpHeaders;

	PaymentData = [
		{
			id: '1234112',
			status: 'Pending',
		},
		{
			id: '1234122',
			status: 'Pending',
		},
		{
			id: '1234222',
			status: 'Refund',
		},
		{
			id: '1234322',
			status: 'Approved',
		},
		{
			id: '1234422',
			status: 'Approved',
		},
		{
			id: '1234522',
			status: 'Pending',
		},
	];
	constructor(
		public _accountService: AccountService,
		private _apiService: APIService,
		private http: HttpClient
	) {
		/** *INFO: Below code stops API from failing on page reload */

		this.header = this._accountService.getHeaders() as HttpHeaders;
	}

	/** *FakeData for payment ID and Payment Status */
	getPaymentStatus() {
		return this.PaymentData;
	}

	/** *Get Total Balance */
	getTotalBalance(currency: string) {
		this.header = this._accountService.getHeaders() as HttpHeaders;
		return this.http.get(this.WALLET_URL + this.balanceTotal, {
			headers: this.header,
			params: { currency: currency },
		});
	}

	/** *Get Stripe Balance */
	getStripeBalance(currency: string) {
		this.header = this._accountService.getHeaders() as HttpHeaders;
		return this.http.get(
			environment.ACCOUNT_API_V2 + 'account/stripe/balance',
			{
				headers: this.header,
				params: { currency: currency },
			}
		);
	}

	/** *Get Settlements OPP */
	getSettlementsOpp(page: number, page_size: number) {
		this.header = this._accountService.getHeaders() as HttpHeaders;
		return this.http.get(
			this.ACCOUNT_URL +
				this.settlementOpp +
				`?page=${page}&limit=${page_size}`,
			{
				headers: this.header,
			}
		);
	}

	/** Get Withdrawal */
	getWithdrawalOpp(settlement_id: string, specification_id: string) {
		this.header = this._accountService.getHeaders() as HttpHeaders;
		return this.http.get(
			this.ACCOUNTING_URL +
				this.withdrawalOpp +
				`?settlement_id=${settlement_id}&specification_id=${specification_id}`,
			{
				headers: this.header,
			}
		);
	}

	/** *Get Payout Schedule */
	getPayoutSchedule() {
		this.header = this._accountService.getHeaders() as HttpHeaders;
		return this.http.get(`${this.ACCOUNT_URL}${this.payoutScheduleAPI}`, {
			headers: this.header,
		});
	}
	/** GET Settlements Mollie */
	getPayouts(page: number, page_size: number) {
		this.header = this._accountService.getHeaders() as HttpHeaders;
		return this.http.get(
			this.ACCOUNT_URL + this.payouts + `?page=${page}&limit=${page_size}`,
			{
				headers: this.header,
			}
		);
	}

	/** *Get Settlements By ID */
	getSettlementsByID(body: object) {
		this.header = this._accountService.getHeaders() as HttpHeaders;
		return this.http.post(this.WALLET_URL + this.settlementById, body, {
			headers: this.header,
		});
	}
	/** *Get Transaction Balance */
	getTransactionBalance() {
		this.header = this._accountService.getHeaders() as HttpHeaders;
		return this._apiService.get(this.transactionBalanceAPI, {
			headers: this.header,
		});
	}

	/** *Withdrawal Payout */
	createPayoutWithdrawal(body: any) {
		this.header = this._accountService.getHeaders() as HttpHeaders;
		return this.http.post(this.WALLET_URL + this.withdrawalPayout, body, {
			headers: this.header,
		});
	}
	/** *Donation table */
	donationGiven(params: any) {
		this.header = this._accountService.getHeaders() as HttpHeaders;
		return this._apiService.get(this.donationGivenAPI, {
			headers: this.header,
			params,
		});
	}

	/** *Get Donation Received Object */
	getDonationReceivedObj(receivedDonationResponse: any) {
		return {
			count: receivedDonationResponse.count,
			next: receivedDonationResponse.next,
			donationReceived: this.filterDonationReceivedData(
				receivedDonationResponse
			),
		};
	}

	/** *Filter Donation Received Data */
	filterDonationReceivedData(receivedDonationResponse: any) {
		return receivedDonationResponse.results;
	}

	/** *Get Accounting Transactions */
	getAccountingTransactions(
		params = new HttpParams({
			fromObject: {
				['filter']: '',
				['sort_col']: 'created_at',
				['sort_direction']: 'asc',
				['page']: 1,
				['page_size']: 20,
				['from_date']: 0,
				['to_date']: new Date().getTime(),
			},
		})
	) {
		this.header = this._accountService.getHeaders() as HttpHeaders;
		return this.http.get(`${this.ACCOUNTING_URL}accounting/transactions`, {
			headers: this.header,
			params,
		});
	}

	/** *Transaction table */
	transaction(
		params = new HttpParams({
			fromObject: {
				['filter']: '',
				['sort_col']: 'created_at',
				['sort_direction']: 'asc',
				['page']: 1,
				['page_size']: 20,
				['from_date']: 0,
				['to_date']: new Date().getTime(),
				['currency']: '',
			},
		})
	) {
		this.header = this._accountService.getHeaders() as HttpHeaders;
		return this.http.get(`${this.ACCOUNTING_URL}accounting/transactions`, {
			headers: this.header,
			params,
		});
	}

	payoutTransaction(page: any, limit: any, paymentId: any) {
		this.header = this._accountService.getHeaders() as HttpHeaders;
		return this.http.get(
			`${this.ACCOUNTING_URL}accounting/payout/transactions?page=${page}&limit=${limit}&paymentId=${paymentId}`,
			{
				//
				headers: this.header,
			}
		);
	}

	/* Transactions list from OPP */
	getTransactionsOpp(
		settlement_id: any,
		specifications_id: any,
		page: any,
		perpage: any
	) {
		this.header = this._accountService.getHeaders() as HttpHeaders;
		return this.http.get(
			this.ACCOUNTING_URL +
				this.transactionsListOpp +
				`?page=${page}&limit=${perpage}&settlement_id=${settlement_id}&specification_id=${specifications_id}`,
			{
				headers: this.header,
			}
		);
	}
	/** *Transaction Given Obj */
	transactionGivenObj(receivedDonationResponse: any) {
		return {
			count: receivedDonationResponse.count,
			next: receivedDonationResponse.next,
			donationReceived: this.transactionGivenData(receivedDonationResponse),
		};
	}

	/** *Transaction Given Data */
	transactionGivenData(receivedDonationResponse: any) {
		return receivedDonationResponse.results;
	}

	/** *Donation List */
	transactionLists(
		params = new HttpParams({
			fromObject: {
				['filter']: '',
				['sort_col']: 'created_at',
				['sort_direction']: 'asc',
				['page']: 1,
				['page_size']: 20,
				['from_date']: 0,
				['to_date']: new Date().getTime(),
			},
		})
	) {
		this.header = this._accountService.getHeaders() as HttpHeaders;
		return this._apiService.get(this.donationGivenAPI, {
			headers: this.header,
			params,
		});
	}
	/** *Stripe Payout */
	payoutStripe(amount: number, currency: string) {
		this.header = this._accountService.getHeaders() as HttpHeaders;
		return this.http.post(
			environment.ACCOUNT_API_V2 + 'account/stripe/payout',
			{ amount: amount, currency: currency },
			{ headers: this.header }
		);
	}
}
