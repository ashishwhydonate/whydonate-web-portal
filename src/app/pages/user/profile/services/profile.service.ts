import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { APIService } from 'src/app/global/services/api.service';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
	providedIn: 'root',
})
/** *Profile Service */
export class ProfileService {
	public profile: BehaviorSubject<any> = new BehaviorSubject(null);
	public profileUpdate = this.profile.asObservable();

	API_URL: string = environment.apiUrl;
	DONATION_URl: string = environment.donation_url;

	private readonly profileAPI = 'account/profile';
	ACCOUNT_API_V2: string = environment.ACCOUNT_API_V2;
	private readonly emailSettingsUpdateAPI = 'account/email/settings/';
	private readonly accountAPI = 'account/user/';
	private readonly bankAPI = 'account/bank/';
	private readonly apiKeyAPI = 'account/apiKey/';
	private readonly userAPI = 'account/user/login/';
	private readonly userDeactivate = 'account/profile/deactivate/';
	private readonly donationCountAPI = '/donation/count';
	private readonly activeOPPDonationCountAPI = 'account/active/opp/donations';
	private profileObj: any;
	private accountObj: any;
	private apiKeyObj: any;
	private emailObj: any;
	isBrowser: boolean = false;

	constructor(
		private accountService: AccountService,
		private http: HttpClient,
		private _apiService: APIService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}
	/**
	 * Get Method
	 */
	get(apiEndPoint: string): Observable<any> {
		let headers = this.accountService.getHeaders();
		// TODO: Refactor below get function to pass headers and params inside 1 object
		if (headers == undefined || headers == null) {
			return new Observable();
		} else {
			return this._apiService.get(apiEndPoint, { headers: headers });
		}
	}
	tempGet(apiEndPoint: string): Observable<any> {
		let headers = this.accountService.getHeaders();
		// TODO: Refactor below get function to pass headers and params inside 1 object
		if (headers == undefined || headers == null) {
			return new Observable();
		} else {
			return this._apiService.tempGet(apiEndPoint, { headers: headers });
		}
	}
	/**
	 * Put Method
	 */
	put(apiEndPoint: string, body: object) {
		return this.http.put(`${this.API_URL}${apiEndPoint}`, body);
	}

	/**
	 * Update User Method
	 * This method requires form data as body
	 */
	updateProfile(body: any) {
		let user: any;
		if (this.isBrowser) user = localStorage.getItem('user') || '{}';
		let headers;
		if (user != '{}' && user != null && user != undefined) {
			let jwt = JSON.parse(user)?.jwt?.jwt || null;
			if (jwt != null && jwt != undefined && jwt != '{}') {
				headers = new HttpHeaders().set('Authorization', `JWT ${jwt}`);
				console.log('jwt profile', headers);
			}
		}

		return this.http.put(this.ACCOUNT_API_V2 + this.profileAPI, body, {
			headers: headers,
		});
	}

	/**
	 * Update User Method
	 */
	updateUser(body: object) {
		let headers = this.accountService.getHeaders();
		return this.http.put(this.ACCOUNT_API_V2 + this.profileAPI, body, {
			headers: headers,
		});
	}
	/**
	 * Verify Password Method
	 */
	verifyPassword(body: any) {
		let headers = this.accountService.getHeaders();
		return this.http.post(
			this.ACCOUNT_API_V2 + 'account/user/login/',
			JSON.parse(JSON.stringify(body)),
			{
				headers: headers,
			}
		);
	}
	/**
	 * Get Profile Method
	 */
	getProfile() {
		let headers = this.accountService.getHeaders();
		return this.http.get(environment.ACCOUNT_API_V2 + this.profileAPI, {
			headers: headers,
		});
	}
	/**
	 * Get Active Donation OPP Method
	 */
	getActiveOPPDonationCount() {
		let headers = this.accountService.getHeaders();
		return this.http.get(
			environment.ACCOUNT_API_V2 + this.activeOPPDonationCountAPI,
			{
				headers: headers,
			}
		);
	}

	/**
	 * Emit profile update
	 */
	profileChange(data: any) {
		this.profile.next(data);
	}

	get getProfileObj() {
		return this.profileObj;
	}
	set setProfileObj(obj: any) {
		this.profileObj = obj;
	}
	/**
	 * Get Account Method
	 */
	getAccount() {
		let headers = this.accountService.getHeaders();
		return this.http.get(this.ACCOUNT_API_V2 + this.profileAPI, {
			headers: headers,
		});
	}

	get getAccountObj() {
		return this.accountObj;
	}
	set setAccountObj(obj: any) {
		this.accountObj = obj;
	}
	/**
	 * Get Reset Password Method
	 */
	resetPassword(body: object) {
		return this._apiService.post(this.userAPI, body);
	}
	/**
	 * Get Bank Method
	 */
	getBank() {
		let headers = this.accountService.getHeaders();
		this._apiService
			.get(this.bankAPI, { headers: headers })
			.subscribe((res: any) => {
				console.log(res);
			});
	}

	/** *Get Donation Count */
	getDonationCount() {
		let headers = this.accountService.getHeaders();
		return this.http.get(`${this.DONATION_URl}${this.donationCountAPI}`, {
			headers: headers,
		});
	}
	getApiKey() {
		let headers = this.accountService.getHeaders();
		return this.http.get(`${this.ACCOUNT_API_V2}${this.apiKeyAPI}`, {
			headers: headers,
		});
	}
	createApiKey(body: Object) {
		let headers = this.accountService.getHeaders();
		body;
		return this.http.post(`${this.ACCOUNT_API_V2}${this.apiKeyAPI}`, body, {
			headers: headers,
		});
	}
	updateApiKeyStatus(body: Object) {
		let headers = this.accountService.getHeaders();
		body;
		return this.http.put(`${this.ACCOUNT_API_V2}${this.apiKeyAPI}`, body, {
			headers: headers,
		});
	}
	get getApiKeyObj() {
		return this.apiKeyObj;
	}
	set setApiKeyObj(obj: any) {
		this.apiKeyObj = obj;
	}

	getEmail() {
		let headers = this.accountService.getHeaders();
		return this.http.get(this.ACCOUNT_API_V2 + this.profileAPI, {
			headers: headers,
		});
		// return this._apiService.get(this.profileAPI, { headers: headers });
	}
	get getEmailObj() {
		return this.emailObj;
	}
	set setEmailObj(obj: any) {
		this.emailObj = obj;
	}

	updateEmailSetting(body: object) {
		let headers = this.accountService.getHeaders();
		return this.http.put(
			`${this.ACCOUNT_API_V2}${this.emailSettingsUpdateAPI}`,
			body,
			{
				headers: headers,
			}
		);
	}

	getUserAccount() {
		let headers = this.accountService.getHeaders();
		return this.http.get(this.ACCOUNT_API_V2 + this.profileAPI, {
			headers: headers,
		});
	}

	updateUserAccount(payload: any) {
		let headers = this.accountService.getHeaders();
		return this.http.put(`${this.API_URL}account/user/`, payload, {
			headers: headers,
		});
	}

	deactivateAccount(body: object) {
		let headers = this.accountService.getHeaders();
		return this.http.post(
			`${this.ACCOUNT_API_V2}${this.userDeactivate}`,
			body,
			{
				headers: headers,
			}
		);
	}
}
