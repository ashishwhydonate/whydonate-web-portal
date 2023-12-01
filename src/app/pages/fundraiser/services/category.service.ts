import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from 'src/app/global/services/api.service';
import { FundraiserDonor } from '../models/donor';
import { MediaService } from './media.service';
import { FundraiserCardService } from 'src/app/shared/services/fundraiser-card.service';
import { AccountService } from '../../account/services/account.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Fundraiser } from '../models/fundraiser';
import { environment } from 'src/environments/environment';
import { Tools } from 'src/utilities/tools';
@Injectable({
	providedIn: 'root',
})
/** *Category Service */
export class CategoryService {
	constructor(
		public httpClient: HttpClient,
		public apiService: APIService,
		public _accountService: AccountService
	) {}

	/** *Get Category */
	getCategorylist() {
		let API_URL: string = environment.fundraiser_url;
		let path = 'fundraiser/category/list';
		let headers = this._accountService.getHeaders();
		let body = { headers };
		return this.httpClient.get(API_URL + path, body);
	}
	/** *Get Location */
	getLocation(term: string) {
		let API_URL: string = environment.fundraiser_url;
		let path = 'location';
		let lang = this._accountService.getLocaleId();
		let body = { params: { language_code: lang, query: term } };
		return this.httpClient.get(API_URL + path, body);
	}
}
