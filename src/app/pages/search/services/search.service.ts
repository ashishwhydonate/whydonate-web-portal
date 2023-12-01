import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIService } from 'src/app/global/services/api.service';
import { FundraiserCardData } from 'src/app/shared/interfaces/fundraiser-card-interface';
import { FundraiserCardService } from 'src/app/shared/services/fundraiser-card.service';

/**
 * DESCRIPTION: This class consist of search related service
 * FUNCTIONS: searchFundraiser, getSearchFundraiserCardDataList,
 * getDefaultParams, getSearchParams,
 * setQueryString, setCategory, setPage, setAllParams
 * EXAMPLE: searchFundraiser(getDefaultParams)
 * .subscribe((response) => {
 * getSearchFundraiserCardDataList(response.data)
 * })
 */

/** *Constant string lateral */
export const TYPE_ORGANISATION = 'organisation';
export const TYPE_PERSONAL = 'personal';

@Injectable({
	providedIn: 'root',
})
/** *Search Service */
export class SearchService {
	readonly DEFAULT_PAGE_SIZE = 20;
	private readonly searchAPI = 'fundraiser/search/';
	private readonly popularAPI = 'fundraiser/search/popular/';
	private readonly defaultParams = new HttpParams({
		fromObject: {
			['type']: 'personal,organisation',
			['page']: 0,
		},
	});
	params = new HttpParams();

	constructor(
		private _APIService: APIService,
		private _FundraiserCardService: FundraiserCardService
	) {}

	/**
	 * DESCRIPTION: Getter function for default search params (below PARAM shows param value on initial search page load request.)
	 * PARAM: query_string " " (Don't filter based on search query to show all results)
	 * PARAM: category " " (category id, e.g.- "1,2,3")
	 * PARAM: page 0 (Get first page of pagination if value is 0)
	 * PARAM: page_size 24 (It's Optional, If not defined then give default page size of 24)
	 * STATIC: sort_on : "-donation.amount" (Default value to get sorted data based on donation amount)
	 * STATIC: status : 1 (Default value 1, show fundraiser which are not completed )
	 * STATIC: target_amount : " " (Default empty)
	 */
	public get getDefaultParams(): HttpParams {
		return this.defaultParams;
	}
	/**
	 * DESCRIPTION: Getter function for search params
	 * THROWS: Throws error if called before setSearchParams function
	 * RETURNS: params: HttpParams
	 */
	public get getSearchParams(): HttpParams {
		return this.params;
	}
	/**
	 * DESCRIPTION: Getter function for search's category param value
	 */
	public get getCategoryParamValue(): string {
		return this.params.get('category') || '';
	}

	/**
	 * DESCRIPTION: Setter function for search params
	 */
	public set setParam(params: HttpParams) {
		this.params = params;
	}
	/**
	 * DESCRIPTION: Setter property to set query_string in params
	 */
	public set setQueryString(filter: string) {
		this.params = this.params.set('filter', `${filter}`);
	}
	/**
	 * DESCRIPTION: Setter property to set category in params
	 */
	public set setCategory(selected_category: string) {
		this.params = this.params.set('category', selected_category);
	}
	/**
	 * DESCRIPTION: Setter property to set page in params
	 */
	public set setPage(page: number) {
		this.params = this.params.set('page', page);
	}

	/**
	 * DESCRIPTION: set fundraiser type: organization
	 */
	public setTypeOrganisation() {
		this.params = this.params.set('type', TYPE_ORGANISATION);
	}
	/**
	 * DESCRIPTION: set fundraiser type: personal
	 */
	public setTypePersonal() {
		this.params = this.params.set('type', TYPE_PERSONAL);
	}
	/**
	 * DESCRIPTION: set fundraiser type: Both
	 */
	public setTypeBoth() {
		this.params = this.params.set(
			'type',
			`${TYPE_PERSONAL},${TYPE_ORGANISATION}`
		);
	}

	/**
	 * DESCRIPTION: search function to get the fundraisers
	 * PARAM: params use getters like getSearchParams or getDefaultParams to pass the params to this function
	 * RETURNS: Response data of type Observable. The actual response comes from Backend API, elastic search - fundraising-local-index
	 */
	searchFundraiser(params: HttpParams): Observable<any[]> {
		this.params = this.params.set('page', 0);
		return this._APIService.tempGetNew(this.searchAPI, { params });
	}
	getPopularFundraiser(): Observable<any[]> {
		let params = new HttpParams({
			fromObject: {
				['limit']: 3,
			},
		});
		return this._APIService.tempGetNew(this.popularAPI, { params });
	}

	/**
	 * TITLE: Wrapper function on getFundraiserCardDataList from FundraiserCardService
	 * DESCRIPTION: pass response data from search request as parameter and get data of type 'FundraiserCardData' with 'id' in a list of object
	 * PARAM: ResponseData - Response from elastic search - fundraising-local-index
	 * RETURNS: FundraiserCardDataList: { id:number, fundraiserCardData:FundraiserCardData }[ ]
	 */
	getSearchFundraiserCardDataList(ResponseData: any): {
		slug: string;
		fundraiserCardData: FundraiserCardData;
	}[] {
		return this._FundraiserCardService.getFundraiserCardDataList(ResponseData);
	}

	getSearchFundraiserCardDataListElasticSearch(ResponseData: any): {
		slug: string;
		fundraiserCardData: FundraiserCardData;
	}[] {
		return this._FundraiserCardService.getFundraiserCardDataListElasticSearch(
			ResponseData
		);
	}
}
