import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Data } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { APIService } from 'src/app/global/services/api.service';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
/** *Dashboard Service */
export class DashboardService {
	API_URL: string = environment.apiUrl;
	ACCOUNT_API_V2: string = environment.ACCOUNT_API_V2;
	DONATION_URL: string = environment.DONATION_API_V2;
	PROJECT_URL: string = environment.FUNDRAISER_API_V2;
	NOTIF_URL: string = environment.fundraiser_features_url;
	FUNDRAISER_URL: string = environment.fundraiser_url;

	private readonly stopRecurringDonationAPI = 'donation/stop/recurring';
	private readonly profileAPI = 'account/profile/';
	private readonly transactionBalanceAPI = 'accounting/transaction/balance/';
	private readonly userFundraiserAPI =
		'fundraiser/get_user_fundraisers_status/';
	private readonly donationReceivedAPI = 'donation/order/receiver/';
	private readonly donationGivenAPI = 'donation/order/donor/';
	private readonly donationRecurringReceivedAPI = 'donation/recurring/received';
	private readonly donationRecurringGivenAPI = 'donation/recurring/given';
	private readonly cancelRecurringAPI = 'donation/order/cancel_periodic';
	private readonly fundraiserSummary = 'fundraiser/summary';
	private readonly donationSummary = 'donation/summary';
	private readonly myFundraisers = 'fundraiser/all/fundraiser/';
	private objectSource = new BehaviorSubject(Object);
	currentObject = this.objectSource.asObservable();
	private header!: HttpHeaders;
	isBrowser: boolean = false;
	constructor(
		public _accountService: AccountService,
		private _apiService: APIService,
		private http: HttpClient,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		this.header = this._accountService.getHeaders() as HttpHeaders;
	}

	changeObj(data: any) {
		this.objectSource.next(data);
	}
	/** *Profile data */
	getProfile() {
		this.header = this._accountService.getHeaders() as HttpHeaders;
		return this.http.get(environment.ACCOUNT_API_V2 + this.profileAPI, {
			headers: this.header,
		});
	}

	/** *Transaction Balance Amount */
	getTransactionBalance() {
		this.header = this._accountService.getHeaders() as HttpHeaders;
		return this._apiService.get(this.transactionBalanceAPI, {
			headers: this.header,
		});
	}

	// /** *My fundraiser Data OLD*/
	// getMyfundraisers(params: any) {
	// 	this.header = this._accountService.getHeaders() as HttpHeaders;

	// 	return this.http.get(`${this.FUNDRAISER_URL}${this.userFundraiserAPI}`, {
	// 		headers: this.header,
	// 		params: params,
	// 	});
	// }

	/** *My fundraiser Data */
	getMyfundraisersAll(params: any) {
		this.header = this._accountService.getHeaders() as HttpHeaders;
		return this.http.get(`${this.FUNDRAISER_URL}${this.myFundraisers}`, {
			headers: this.header,
			params,
		});
	}

	/** *Logic for Profile card data */
	filterProfileCardData(profileResponse: any, balanceResponse: any) {
		let default_logo =
			'https://res.cloudinary.com/whydonate/image/upload/w_45,dpr_auto,f_auto,q_auto/whydonate-staging/platform/visuals/whydonate_user.png';
		let obj = {
			image: profileResponse?.profile?.image || default_logo,
			name: profileResponse?.profile?.name || 'Hello, User',
			balance: parseFloat(balanceResponse).toFixed(2) || 0,
		};
		return obj;
	}

	/** *Logic for creating Steps To Do data */
	filterStepsToDoData(
		profileResponse: any,
		myFundraisersResponse: any,
		donationGivenResponse: any
	): any[] {
		return [
			{
				name: $localize`:@@dashboard_createAccount_step:Create account`,
				status: true,
				showStep: true,
			},
			{
				name: $localize`:@@dashboard_startFundraiser_step:Start fundraiser`,
				status: myFundraisersResponse?.count > 0 ? true : false,
				showStep: true,
			},
			{
				name: $localize`:@@dashboard_bankDetails_step:Add bank details`,
				status: profileResponse?.has_bank_information ? true : false,
				showStep: profileResponse?.profile?.is_receiver ? true : false,
				// showStep: true, // should allow to show it for newly registered users
			},
			{
				name: $localize`:@@dashboard_customizeBranding_step:Customize branding`,
				status: profileResponse?.profile?.is_default ? false : true,
				showStep: profileResponse?.profile?.is_receiver ? true : false,
				// showStep: true,
			},
			{
				name: $localize`:@@dashboard_makeADonation_step:Make a donation`,
				status: donationGivenResponse?.count > 0 ? true : false,
				showStep: myFundraisersResponse?.count > 0 ? true : false,
			},
		];
	}

	/** *Donation Received table */
	/** *Donation Received table */
	getDonationReceived(
		params = new HttpParams({
			fromObject: {
				['filter']: '',
				['sort_col']: 'created_at',
				['sort_direction']: 'asc',
				['page']: 1,
				['page_size']: 20,
				['from_date']: 0,
				['to_date']: new Date().getTime(),
				['currency']: 'eur',
			},
		})
	) {
		this.header = this._accountService.getHeaders() as HttpHeaders;
		return this.http.get(
			environment.DONATION_API_V2 + this.donationReceivedAPI,
			{
				headers: this.header,
				params,
			}
		);
	}
	getDonationReceivedObj(receivedDonationResponse: any) {
		return {
			count: receivedDonationResponse?.data?.count || 0,
			next: receivedDonationResponse?.data?.next,
			donationReceived: this.filterDonationReceivedData(
				receivedDonationResponse?.data
			),
		};
	}
	filterDonationReceivedData(receivedDonationResponse: any) {
		return receivedDonationResponse.results;
	}

	/** *Donation Given table */
	/** *Donation Given table */
	getDonationGiven(
		params = new HttpParams({
			fromObject: {
				['filter']: '',
				['sort_col']: 'created_at',
				['sort_direction']: 'asc',
				['page']: 1,
				['page_size']: 20,
				['from_date']: 0,
				['to_date']: new Date().getTime(),
				['currency']: 'eur',
			},
		})
	) {
		this.header = this._accountService.getHeaders() as HttpHeaders;
		return this.http.get(environment.DONATION_API_V2 + this.donationGivenAPI, {
			headers: this.header,
			params,
		});
	}
	getDonationGivenObj(givenDonationResponse: any) {
		return {
			count: givenDonationResponse?.data?.count || 0,
			next: givenDonationResponse?.data?.next,
			donationGiven: this.filterDonationGivenData(givenDonationResponse?.data),
		};
	}
	filterDonationGivenData(givenDonationResponse: any) {
		return givenDonationResponse.results;
	}

	/** *Recurring Received Donation table */
	getRecurringReceivedDonation(
		params = new HttpParams({
			fromObject: {
				['language_code']: 'en',
				['page']: 1,
				['limit']: 20,
				['from_date']: 0,
				['to_date']: Math.floor(Date.now() / 1000),
				['filter']: '',
				['currency']: 'eur',
			},
		})
	) {
		this.header = this._accountService.getHeaders() as HttpHeaders;
		return this.http.get(
			this.DONATION_URL + this.donationRecurringReceivedAPI,
			{
				headers: this.header,
				params,
			}
		);
	}
	getRecurringReceivedDonationObj(RecurringReceivedDonationResponse: any) {
		console.log(
			RecurringReceivedDonationResponse,
			'RecurringReceivedDonationResponse'
		);
		return {
			count: RecurringReceivedDonationResponse?.data?.result?.total || 0,
			next: RecurringReceivedDonationResponse?.next,
			donationRecurringReceived: this.filterRecurringReceivedDonationData(
				RecurringReceivedDonationResponse
			),
		};
	}
	filterRecurringReceivedDonationData(RecurringReceivedDonationResponse: any) {
		console.log(
			RecurringReceivedDonationResponse,
			'RecurringReceivedDonationResponse'
		);
		return RecurringReceivedDonationResponse.data?.result?.result;
	}

	/** *Recurring Given Donation table */
	getRecurringGivenDonation(
		params = new HttpParams({
			fromObject: {
				['language_code']: 'en',
				['page']: 1,
				['limit']: 20,
				['from_date']: 0,
				['to_date']: Math.floor(Date.now() / 1000),
				['filter']: '',
				['currency']: 'eur',
			},
		})
	) {
		this.header = this._accountService.getHeaders() as HttpHeaders;

		return this.http.get(this.DONATION_URL + this.donationRecurringGivenAPI, {
			headers: this.header,
			params,
		});
	}
	getRecurringGivenDonationObj(RecurringGivenDonationResponse: any) {
		return {
			count: RecurringGivenDonationResponse?.data?.result?.total || 0,
			next: RecurringGivenDonationResponse?.next,
			donationRecurringGiven: this.filterRecurringGivenDonationData(
				RecurringGivenDonationResponse
			),
		};
	}
	filterRecurringGivenDonationData(RecurringGivenDonationResponse: any) {
		return RecurringGivenDonationResponse.data.result?.result;
	}
	/** *Action from Recurring Given Donation table */
	cancelRecurringDonation(idParam: number) {
		let body = {
			id: idParam,
		};
		this.header = this._accountService.getHeaders() as HttpHeaders;
		return this.http.post(this.API_URL + this.cancelRecurringAPI, body, {
			headers: this.header,
		});
	}
	// this api is used to stop recurring donation
	stopRecurringDonationRecieved(
		mandate_uid: string,
		email: string,
		donorId: string,
		fundraiserName: string,
		fundraiserSlug: string
	) {
		const url = `https://${environment.domain}/en/fundraising/${fundraiserSlug}`;
		this.header = this._accountService.getHeaders() as HttpHeaders;
		return this.http.get(
			this.DONATION_URL +
				this.stopRecurringDonationAPI +
				`?mandate_uid=${mandate_uid}&email=${email}&donor_id=${donorId}&title=${fundraiserName}&fundraiser_url=${url}`,
			{
				headers: this.header,
			}
		);
	}

	/** This api is used to get fundraiser summary*/
	getFundraiserSummary() {
		let options = {
			headers: this._accountService.getHeaders(),
		};
		return this.http.get(this.PROJECT_URL + this.fundraiserSummary, options);
	}

	/** This api is used to get donation summary*/
	getDonationSummary() {
		let options = {
			headers: this._accountService.getHeaders(),
		};
		return this.http.get(this.DONATION_URL + this.donationSummary, options);
	}

	downloadCSV(transactions: any, value: any) {
		const encodedUri = encodeURI(transactions);
		let link: any;
		if (this.isBrowser) link = document.createElement('a');
		link.setAttribute('href', encodedUri);
		link.setAttribute('download', `${value}.csv`);
		link.innerHTML = 'Click Here to download';
		if (this.isBrowser) document.body.appendChild(link); // Required for FF
		link.click();
	}
}
function Injet(): (
	target: typeof DashboardService,
	propertyKey: undefined,
	parameterIndex: 3
) => void {
	throw new Error('Function not implemented.');
}
