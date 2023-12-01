import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { APIService } from 'src/app/global/services/api.service';
import { FundraiserDonor } from '../models/donor';
import { MediaService } from './media.service';
import { FundraiserCardService } from 'src/app/shared/services/fundraiser-card.service';
import { AccountService } from '../../account/services/account.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Fundraiser } from '../models/fundraiser';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { Tools } from 'src/utilities/tools';
import { isPlatformBrowser } from '@angular/common';

type LOCALE = 'nl' | 'en' | 'es' | 'de' | 'fr';

@Injectable({
	providedIn: 'root',
})
/** *Fundraiser Service */
export class FundraiserService {
	API_URL: string = environment.apiUrl;
	FUNDRAISER_URL: string = environment.fundraiser_url;
	API_URL_V2: string = this.API_URL.replace('/v1', '/v2');
	ACCOUNT_API_V2: string = environment.ACCOUNT_API_V2;
	DONATION_API: string = environment.donation_url;
	PROJECT_URL: string = environment.project_url;
	FUNDRAISER_API_V2: string = environment.FUNDRAISER_API_V2;

	donorList: FundraiserDonor[] = [];
	currentFundraiser: Subject<Fundraiser> = new Subject<Fundraiser>();
	isBrowser: boolean = false;

	private readonly oppMetadataAPI = 'account/update/merchant/metadata';

	constructor(
		private http: HttpClient,
		private _apiService: APIService,
		private _mediaService: MediaService,
		private _fundraiserCardService: FundraiserCardService,
		public accountService: AccountService,
		public httpClient: HttpClient,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	/*
	 * Function get a Fundraiser by Slug
	 * @param slug
	 * @returns
	 */

	getFundraiserBySlug(slug: string, locale: any) {
		let API_URL = environment.fundraiser_url;

		let url = 'fundraiser/get';
		let body = { params: { slug, language: locale } };
		return this.http.get(API_URL + url, body);
		// return this._apiService.get(url, body);
	}
	getFundraiserDescription(slug: string, locale: any) {
		let API_URL = environment.fundraiser_url;

		let url = 'fundraiser/description';
		let body = { params: { slug, language: locale } };
		return this.http.get(API_URL + url, body);
		// return this._apiService.get(url, body);
	}

	/*
	 * Function get a Fundraiser by Slug if user is Admin
	 * @param slug
	 * @returns
	 */
	getFundraiserBySlugForAdmin(slug: string, locale: any) {
		let API_URL = environment.fundraiser_url;
		let url = 'fundraiser/get';
		let headers = this.accountService.getHeaders();

		let body = { params: { slug: slug, language: locale }, headers };
		return this.http.get(API_URL + url, body);
	}
	/*
	 * Function get a Custom DonationForm Values for fundraiser by Slug if user is Admin
	 * @param slug
	 * @returns
	 */
	getFundraiserCustomDonationFormValuesBySlugForAdmin(slug: string) {
		let url = 'fundraiser/custom_donation_form';
		let headers = this.accountService.getHeaders();
		let body = { params: { slug }, headers };
		return this._apiService.tempGetNew(url, body);
	}

	/*
	 * Function to create a connected fundraiser
	 * @param data
	 * @returns
	 */
	createConnectedFundraiser(data: any) {
		let API_URL = environment.fundraiser_features_url;
		let url = 'fundraiser/local/';
		let body = data;
		let headers = this.accountService.getHeaders();
		return this.http.post(API_URL + url, JSON.parse(JSON.stringify(body)), {
			headers: headers,
		});
	}

	/*
	 * Function to create a Fundraiser
	 */
	createFundraiser(data: any) {
		let API_URL = environment.fundraiser_features_url;
		let url = 'fundraiser/local/';
		let body = data;
		let headers = this.accountService.getHeaders();
		return this.http.post(API_URL + url, JSON.parse(JSON.stringify(body)), {
			headers: headers,
		});
	}

	/*
	 * Function to update a Fundraiser
	 */
	updateFundraiser(data: any) {
		let url = 'project/fundraising/local/';
		let body = data;
		let headers = this.accountService.getHeaders();
		return this._apiService.post(
			url,
			JSON.parse(JSON.stringify(body)),
			headers
		);
	}

	/*
	 * Function to search locations for a Fundraiser
	 */
	searchLocations(data: any) {
		let url = 'local/location/local/';
		let body = data;
		let headers = this.accountService.getHeaders();
		return this._apiService.post(
			url,
			JSON.parse(JSON.stringify(body)),
			headers
		);
	}

	/*
	 * Function to update a Fundraiser - location, about, appeal
	 */
	updateFundraiserInformation(data: any) {
		let url = 'project/fundraising/local/';
		let body = data;
		let headers = this.accountService.getHeaders();
		return this._apiService.put(url, JSON.parse(JSON.stringify(body)), headers);
	}
	/*
	 * Function to update a Fundraiser -  appeal,title
	 */
	updateFundraiserInformationAppealTitle(data: any) {
		let API_URL: string = environment.fundraiser_url;
		let url = 'fundraiser/connected_update';
		let body = data;
		let headers = this.accountService.getHeaders();
		return this.http.put(API_URL + url, body, {
			headers: headers,
		});
		// return this._apiService.tempPutNew(
		// 	url,
		// 	JSON.parse(JSON.stringify(body)),
		// 	headers
		// );
	}

	/*
	 * Function to update a Connected Fundraiser - Location
	 */
	updateConnectedFundraiserLocation(data: any) {
		let API_URL: string = environment.fundraiser_url;
		let url = 'fundraiser/connected/update/location';
		let body = data;
		let headers = this.accountService.getHeaders();
		return this.http.put(API_URL + url, body, {
			headers: headers,
		});
		// return this._apiService.tempPutNew(
		// 	url,
		// 	JSON.parse(JSON.stringify(body)),
		// 	headers
		// );
	}

	/*
	 * Function to update a Connected Fundraiser - Socials
	 */
	updateConnectedFundraiserSocials(data: any) {
		let API_URL: string = environment.fundraiser_url;
		let url = 'fundraiser/connected/update/social';
		let body = data;
		let headers = this.accountService.getHeaders();
		return this.http.put(API_URL + url, body, {
			headers: headers,
		});
		// return this._apiService.tempPutNew(
		// 	url,
		// 	JSON.parse(JSON.stringify(body)),
		// 	headers
		// );
	}

	/*
	 * Function to update a Connected Fundraiser - Category
	 */
	updateConnectedFundraiserCategory(data: any) {
		let API_URL: string = environment.fundraiser_url;
		let url = 'fundraiser/connected/update/category';
		let body = data;
		let headers = this.accountService.getHeaders();
		return this.http.put(API_URL + url, body, {
			headers: headers,
		});
		// return this._apiService.tempPutNew(
		// 	url,
		// 	JSON.parse(JSON.stringify(body)),
		// 	headers
		// );
	}

	/*
	 * Function to update a Fundraiser - Target Amount
	 */
	updateFundraiserInformationTargetAmount(data: any) {
		let url = 'fundraiser/target_amount_form';
		let body = data;
		let headers = this.accountService.getHeaders();
		return this._apiService.tempPutNew(
			url,
			JSON.parse(JSON.stringify(body)),
			headers
		);
	}

	updateFundraiserLocation(data: any) {
		let API_URL: string = environment.fundraiser_features_url;
		let url = 'fundraiser/update/location';
		let body = data;
		let headers = this.accountService.getHeaders();
		return this.http.put(API_URL + url, body, {
			headers: headers,
		});
	}
	updateFundraiserTitleDescription(data: any) {
		let url = 'fundraiser/update/';
		let body = data;
		let formData = new FormData();
		formData.append('id', data.id);
		if (data.category_id != undefined) {
			formData.append('category_id', data.category_id);
		} else {
			formData.append('content', data.content);
			formData.append('description', data.description);
			formData.append('title', data.title);
		}
		let headers = this.accountService.getHeaders();
		let jwt = headers?.get('Authorization') || '';
		let options = {
			headers: new HttpHeaders().set('Authorization', jwt),
		};
		return this.http.put(this.FUNDRAISER_URL + url, formData, options);
		// return this._apiService.put(url, JSON.parse(JSON.stringify(body)), headers);
	}
	updateFundraiserDescription(data: any) {
		let url = 'fundraiser/update/about';
		let body = data;
		let formData = new FormData();
		formData.append('slug', data.slug);
		formData.append('appeal', '');
		formData.append('content', data.content);
		formData.append('description', data.description);
		// formData.append('title', data.title);

		let headers = this.accountService.getHeaders();
		let jwt = headers?.get('Authorization') || '';
		let options = {
			headers: new HttpHeaders().set('Authorization', jwt),
		};
		return this.http.patch(this.FUNDRAISER_URL + url, formData, options);
		// return this._apiService.put(url, JSON.parse(JSON.stringify(body)), headers);
	}
	updateFundraiserAppealDescription(data: any) {
		let url = 'fundraiser/update/about';
		let body = data;
		let formData = new FormData();
		formData.append('slug', data.slug);
		formData.append('appeal', data.appeal);
		formData.append('content', data.content);
		formData.append('description', '');
		// formData.append('title', data.title);

		let headers = this.accountService.getHeaders();
		let jwt = headers?.get('Authorization') || '';
		let options = {
			headers: new HttpHeaders().set('Authorization', jwt),
		};
		return this.http.patch(this.FUNDRAISER_URL + url, formData, options);
		// return this._apiService.put(url, JSON.parse(JSON.stringify(body)), headers);
	}
	updateFundraiserTitle(data: any) {
		let url = 'fundraiser/update/title';
		let body = data;
		let formData = new FormData();
		formData.append('slug', data.slug);
		formData.append('title', data.title);

		let headers = this.accountService.getHeaders();
		let jwt = headers?.get('Authorization') || '';
		let options = {
			headers: new HttpHeaders().set('Authorization', jwt),
		};
		return this.http.patch(this.FUNDRAISER_URL + url, formData, options);
		// return this._apiService.put(url, JSON.parse(JSON.stringify(body)), headers);
	}
	updateFundraiserInformationTranslation(data: any) {
		// let url = 'project/fundraising/local/translations/';
		let url = 'fundraiser/about/translation';
		let body = data;
		let headers = this.accountService.getHeaders();

		return this.http.post(
			this.FUNDRAISER_API_V2 + url,
			JSON.parse(JSON.stringify(body)),
			{ headers: headers }
		);
	}
	updateFundraiserTitleTranslation(data: any) {
		console.log('title data', data);
		// let url = 'project/fundraising/local/translations/';
		let url = 'fundraiser/update/title/translation';
		let body = data;
		let formData = new FormData();
		formData.append('title', data.title);
		formData.append('slug', data.slug);
		formData.append('currency_code', data.currency_code);
		formData.append('language_code', data.language_code);
		formData.append('is_auto', data.is_auto);
		let headers = this.accountService.getHeaders();
		let jwt = headers?.get('Authorization') || '';
		let options = {
			headers: new HttpHeaders().set('Authorization', jwt),
		};
		return this.http.post(this.FUNDRAISER_API_V2 + url, formData, options);
	}
	updateFundraiserDescriptionTranslation(data: any) {
		// let url = 'project/fundraising/local/translations/';
		let url = 'fundraiser/update/about/translation';
		let body = data;
		let formData = new FormData();
		// formData.append('title', data.title);
		formData.append('slug', data.slug);
		formData.append('appeal', '');
		formData.append('description', data.description);
		formData.append('content', data.content);
		formData.append('currency_code', data.currency_code);
		formData.append('language_code', data.language_code);
		formData.append('is_auto', data.is_auto);
		let headers = this.accountService.getHeaders();
		let jwt = headers?.get('Authorization') || '';
		let options = {
			headers: new HttpHeaders().set('Authorization', jwt),
		};
		return this.http.post(this.FUNDRAISER_API_V2 + url, formData, options);
	}
	updateFundraiserAppealDescriptionTranslation(data: any) {
		// let url = 'project/fundraising/local/translations/';
		let url = 'fundraiser/update/about/translation';
		let body = data;
		let formData = new FormData();
		// formData.append('title', data.title);
		formData.append('slug', data.slug);
		formData.append('appeal', data.appeal);
		formData.append('description', '');
		formData.append('content', data.content);
		formData.append('currency_code', data.currency_code);
		formData.append('language_code', data.language_code);
		formData.append('is_auto', data.is_auto);
		let headers = this.accountService.getHeaders();
		let jwt = headers?.get('Authorization') || '';
		let options = {
			headers: new HttpHeaders().set('Authorization', jwt),
		};
		return this.http.post(this.FUNDRAISER_API_V2 + url, formData, options);
	}

	createFundraiserInformationTranslation(data: any) {
		let url = 'project/fundraising/local/translations/';
		let body = data;
		let headers = this.accountService.getHeaders();
		return this._apiService.post(
			url,
			JSON.parse(JSON.stringify(body)),
			headers
		);
	}

	autoTranslateFundraiserInformation(data: any) {
		let url = 'media/translate/';
		let body = data;
		let headers = this.accountService.getHeaders();
		return this._apiService.post(
			url,
			JSON.parse(JSON.stringify(body)),
			headers
		);
	}
	autoTranslateNew(data: any) {
		let url = 'fundraiser/auto/translate';
		let body = data;
		let headers = this.accountService.getHeaders();
		return this.http.post(this.FUNDRAISER_API_V2 + url, body, {
			headers: headers,
		});
	}

	/*
	 * Function to update donor reply
	 * @param replyObject
	 * @returns
	 */
	updateDonorReply(replyObject: any) {
		let path = '/donation/donor/thanks';
		let body = replyObject;
		let headers = this.accountService.getHeaders();
		console.log('headers_____________', headers);

		return this.http.post(this.DONATION_API + path, JSON.stringify(body), {
			headers: headers,
		});
	}

	/*
	 * Function to add empty bank account after merchant is created
	 * @param params
	 * @returns
	 */
	addEmptyBank(data: any) {
		let API_URL = environment.ACCOUNT_API_V2;
		let url = 'account/bank ';
		let body = data;
		let headers = this.accountService.getHeaders();
		return this.http.put(API_URL + url, body, {
			headers: headers,
		});
	}

	// this API is used to show data of customer name and bank Account
	getoppaccount() {
		let API_URL = environment.ACCOUNT_API_V2;
		let url = 'account/bank ';
		let headers = this.accountService.getHeaders();
		return this.http.get(API_URL + url, {
			headers: headers,
		});
	}

	/*
	 * Function to add social media links to fundraiser
	 * @param params
	 * @returns
	 */

	async createSocialMedia(data: any) {
		let API_URL = environment.fundraiser_url;
		let path = 'fundraiser/create/socialmedia';
		let body = data;
		let headers = this.accountService.getHeaders();
		return await this.httpClient
			.post(API_URL + path, body, { headers: headers })
			.toPromise();
	}

	async addVideoBackground(data: any) {
		let API_URL = environment.fundraiser_url;
		let path = 'fundraiser/video/background';
		let body = data;
		let headers = this.accountService.getHeaders();
		return await this.httpClient
			.post(API_URL + path, body, { headers: headers })
			.toPromise();
	}

	/*
	 * Function to update social media links to fundraiser
	 * @param params
	 * @returns
	 */
	async updateSocialMedia(data: any) {
		let API_URL = environment.fundraiser_url;
		let path = 'fundraiser/create/socialmedia';
		let body = data;
		let headers = this.accountService.getHeaders();
		return await this.httpClient.post(API_URL + path, body, {
			headers: headers,
		});
	}

	/*
	 * Function to get donor list
	 * @param id
	 * @param pageNumber
	 * @returns
	 */
	// getDonorList(id: string, pageNumber: number) {
	// 	let url = `donation/orders/fundraising/local/?client=whydonate_staging&id=201&cursor=&limit=10&page=${pageNumber}`;
	// 	let body = { params: { id } };
	// 	return this._apiService.get(url, body);
	// }
	getDonorList(slug: string, pageNumber: number, lang: any) {
		console.log('ALL ', lang, pageNumber);
		let url = `/donation/orders/fundraising/local/?slug=${slug}&page=${pageNumber}&limit=20&language_code=${lang}`;
		return this.http.get(this.DONATION_API + url);
	}

	getDonorShort(slug: string, lang: any) {
		let url = `/donation/orders/fundraising/local/short?slug=${slug}&language_code=${lang}`;
		return this.http.get(this.DONATION_API + url);
	}
	/** *Get Updates */
	getUpdates(slug: string, locale: any, page: number) {
		// console.log(slug);
		// let url = 'project/fundraising/updates/';
		let API_URL = environment.fundraiser_url;

		let url = 'fundraiser/update';
		let body = { params: { slug, language: locale, page } };
		return this.http.get(API_URL + url, body);
		// return this._apiService.get(url, body);
	}

	/** *Get Updates */
	getRootsUpdates(slug: string) {
		// console.log(slug);
		let url = 'project/fundraising/rootupdates/';
		let body = { params: { fundraising_local: slug } };
		return this._apiService.get(url, body);
	}

	/** *Save Updates
	 * INFO: Since Updates translation only maintain translation counter part locale (check for example),
	 * it results into error when Updates's original locale do not match with fundraiser locale or page locale.
	 * So to solve this issue extra locale is passed which will be used if such problem occur with any update.
	 * For example:
	 * if Update 1 is created in en then in Updates translation table, locale will be nl, es, de, fr and en content will in Updates table
	 * then update 2 is created in nl then in Updates translation table, locale will be en, es, de, fr and nl content will be in Updates table
	 * now, if user edits Update 1 while on nl language, in backend, it will replace the en content with nl content in Updates table.
	 */
	saveUpdates(body: any) {
		// let url = 'project/fundraising/updates/';
		// let API_URL = environment.fundraiser_url;
		let url = 'fundraiser/update/translation';
		let options = {
			headers: this.accountService.getHeaders(),
		};
		return this.http.post(this.FUNDRAISER_API_V2 + url, body, options);
	}
	saveEditedUpdates(body: any) {
		// let url = 'project/fundraising/updates/';
		let API_URL = environment.fundraiser_url;
		let url = 'fundraiser/update';
		let options = {
			headers: this.accountService.getHeaders(),
		};
		return this.http.patch(API_URL + url, body, options);
	}
	/** Save updates translation */
	saveUpdatesTranslation(body: any) {
		let url = 'project/fundraising/local/translations/update/';
		let options = {
			headers: this.accountService.getHeaders(),
		};
		return this.http.post(this.API_URL + url, body, options);
	}

	/** *Creates Updates */
	createUpdates(slug: any, content: any) {
		// let url = 'project/fundraising/updates/';
		let API_URL = environment.fundraiser_url;
		let url = 'fundraiser/create/update';
		let body = {
			slug: slug,
			content: content,
		};
		let options = {
			headers: this.accountService.getHeaders(),
		};
		return this.http.post(API_URL + url, body, options);
	}

	/** *Delete Updates */
	deleteUpdates(updateId: any) {
		// let url = 'project/fundraising/updates/';
		let API_URL = environment.fundraiser_url;

		let url = 'fundraiser/update';
		let params = new HttpParams();
		params = params.set('update_id', updateId);
		let options = {
			headers: this.accountService.getHeaders(),
			params: params,
		};
		return this.http.delete(API_URL + url, options);
	}

	/** *Get Updates View */
	getUpdatesViewObj(updatesList: any, locale: string = ''): [{}] {
		console.log('UPDATED IN SERVICE ', updatesList);

		if (updatesList && updatesList?.result) {
			return updatesList?.result.map((result: any) => {
				if (Object.keys(result)?.length > 0) {
					return {
						date: this.toDateString(result?.created_at),
						content: this.getContent(result, locale),
						mediaList: this._mediaService.getViewMediaList(result?.image_list),
						sliderMediaList: this._mediaService.getSliderMediaList(
							result?.image_list
						),
					};
				} else {
					console.log('ERROR');
				}
			});
		} else {
			// console.log('updatesList.result is undefined or not an array');
			return [{}]; // Return an empty array or appropriate default value
		}
	}

	/** *Get Updates Edit Obj*/
	getUpdatesEditObj(updatesList: any, locale: string = ''): [{}] {
		if (updatesList && updatesList?.result) {
			// console.log('UPPPPPPPDATE', updatesList.result[0]);
			return updatesList?.result.map((result: any) => {
				return {
					id: result.id,
					date: this.toDateString(result?.created_at),
					content: this.getContent(result, locale), //result['content' + this.getLocaleSuffix(locale)],
					mediaList: this._mediaService.getMediaList(result?.image_list),
					sliderMediaList: this._mediaService.getSliderMediaList(
						result?.image_list
					),
					originalLocale: this.getOriginalLocaleFromContent(result),
					userLocale: locale,
					translation: this.getContentTranslation(result),
				};
			});
		} else {
			// console.log('updatesList.result is undefined or not an array');
			return [{}]; // Return an empty array or appropriate default value
		}
	}
	/** *Get Created Update */
	// getCreatedUpdate(result: any, locale: string = ''): {} {
	// 	return {
	// 		id: result.id,
	// 		date: this.toDateString(new Date().toJSON()),
	// 		content: result['content' + this.getLocaleSuffix(locale)],
	// 	};
	// }

	/** *Get To Data String */
	toDateString(createdAt: string) {
		let date = new Date(createdAt);
		let monthString = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];
		return `${date.getDate()} ${
			monthString[date.getMonth()]
		} ${date.getFullYear()}`;
	}

	/** *Get Locale Suffix - returns the content, either with suffix or without */
	getContent(update: any, locale: string) {
		return (
			update['content' + this.getLocaleSuffix(locale)] || update['content']
		);
	}
	getContentTranslation(updates: any) {
		let translationObj = (<any>Object).fromEntries(
			Object.entries(updates)
				.map((k) => k[0].includes('content_') && k)
				.filter((x) => x)
		);
		let orginalLocaleSuffix = this.getLocaleSuffix(
			this.getOriginalLocaleFromContent(updates)
		);
		translationObj['content' + orginalLocaleSuffix] = updates['content'];
		return translationObj;
	}

	getLocaleSuffix(locale: string) {
		console.log('LOCALE', locale);
		if (locale) {
			if (locale.includes('en')) return '_en';
			if (locale.includes('nl')) return '_nl';
			if (locale.includes('de')) return '_de';
			if (locale.includes('es')) return '_es';
			if (locale.includes('fr')) return '_fr';
		} else {
			/** *default, if notthing found */
			return '';
		}
	}

	// substract translateLocales from allLocales and returns the original locale
	getOriginalLocaleFromContent(updates: any) {
		let allLocales = ['nl', 'en', 'es', 'de', 'fr'];
		let translateLocales = this.getTranslatedLocales(updates);
		let originalLocale = allLocales.filter(
			(x) => !translateLocales.includes(x)
		)[0];
		return originalLocale;
	}
	// Filters update object and finds the locale from Key
	getTranslatedLocales(updates: any) {
		return Object.entries(updates)
			.map(([k]) => k.includes('content') && k.split('content_')[1])
			.filter((x) => x);
	}

	/*
	 *Functions For Fundraiser Status
	 */
	updateFundraiserStatus(statusObject: JSON) {
		let API_URL = environment.fundraiser_url;
		let headers = this.accountService.getHeaders();
		let url = 'fundraiser/update/status';

		return this.http.post(API_URL + url, statusObject, {
			headers: headers,
		});
		// return this._apiService.post(
		// 	'project/fundraising/set_visible',
		// 	statusObject,
		// 	headers
		// );
	}

	/*
	 *Functions to Publish Fundraiser
	 */
	publishFundraiser(body: any) {
		let API_URL = environment.fundraiser_url;

		let headers = this.accountService.getHeaders();
		let url = `fundraiser/publish`;
		let obj = {
			slug: body?.slug,
		};
		return this.http.post(API_URL + url, obj, {
			headers: headers,
		});
		// return this._apiService.post('project/fundraising/publish/', body, headers);
	}

	/** *Update Merchant OPP metadata */
	async updateOppMetadata(body: any) {
		let headers = this.accountService.getHeaders();
		return await this.http
			.post(`${this.ACCOUNT_API_V2}${this.oppMetadataAPI}`, body, {
				headers: headers,
			})
			.toPromise();
	}
	/**
	 * API to create the Custom Donation Amount
	 */
	createCustomDonationAmount(customDonationAmountObj: object) {
		let headers = this.accountService.getHeaders();
		return this._apiService.post(
			'project/fundraising/local/custom/donation/',
			customDonationAmountObj,
			headers
		);
	}
	/**
	 * API to create the Custom Donation Amount
	 */
	createCustomDonationFormValuesBySlugForAdmin(
		customDonationAmountObj: object,
		slug: any
	) {
		let headers = this.accountService.getHeaders();
		return this._apiService.tempPostNew(
			`fundraiser/custom_donation_form/?slug=${slug}`,
			customDonationAmountObj,
			headers
		);
	}
	/**
	 * API to Update the Custom Donation Amount
	 */
	updateCustomDonationAmount(customDonationAmountObj: object) {
		let headers = this.accountService.getHeaders();
		return this._apiService.put(
			'project/fundraising/local/custom/donation/',
			customDonationAmountObj,
			headers
		);
	}
	/**
	 * API to Update the Custom Donation Amount
	 */
	updateCustomDonationFormValuesBySlug(
		customDonationAmountObj: object,
		slug: any
	) {
		let headers = this.accountService.getHeaders();
		return this._apiService.tempPutNew(
			`fundraiser/custom_donation_form/?slug=${slug}`,
			customDonationAmountObj,
			headers
		);
	}

	/** *connected fundraisers */
	getConnectedFundraisers(slug: string, page: number) {
		console.log('getConnectedfundraiser', this.getConnectedFundraisers);
		// let url = 'project/fundraising/local/connectedfundraisers/';
		let API_URL = environment.fundraiser_url;

		let url = 'fundraiser/connected';
		let body = { params: { slug, page } };
		return this.http.get(API_URL + url, body);

		// return this._apiService.get(url, body);
	}

	getConnectedFundraisersObj(data: any) {
		if (data.result) {
			let connectedFundraisersList = data.result;
			return this._fundraiserCardService.filterFundraiserCardDataList(
				connectedFundraisersList
			);
		}
		return [];
	}

	/** *Background image */
	updateFundraiserBackground(data: any) {
		let API_URL = environment.fundraiser_url;
		let url = 'fundraiser/background/';

		let headers = this.accountService.getHeaders();
		let jwt = headers?.get('Authorization') || '';
		const body = new FormData();
		body.append('image', data['image']);
		body.append('slug', data['slug']);

		/**
		 * NOTE: Sending blob with formData also requires to set "boundary" on content-type,
		 * so that backend can read the payload properly. Since boundary value is dynamic,
		 * avoid setting content-type for this and browser will automatically set it for you.
		 * EXAMPLE: 'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryPM0yMOPJKezkwGhC'
		 **/
		let options = {
			headers: new HttpHeaders().set('Authorization', jwt),
		};
		// IF Background Object is null OR id is null, we have to run post API instead of put API
		if (data['id'] != null || data['id'] != undefined) {
			body.append('id', data['id']);
			return this.http.put(API_URL + url, body, options);
		}
		return this.http.post(API_URL + url, body, options);
	}

	async uploadFundraiserBackground(data: any) {
		// let url = 'media/background/';
		let API_URL = environment.fundraiser_url;
		let url = 'fundraiser/background';
		let headers = this.accountService.getHeaders();
		let jwt = headers?.get('Authorization') || '';
		const formData = new FormData();
		formData.append('image', data['image']);
		formData.append('slug', data['slug']);

		/**
		 * NOTE: Sending blob with formData also requires to set "boundary" on content-type,
		 * so that backend can read the payload properly. Since boundary value is dynamic,
		 * avoid setting content-type for this and browser will automatically set it for you.
		 * EXAMPLE: 'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryPM0yMOPJKezkwGhC'
		 **/
		let options = {
			headers: new HttpHeaders().set('Authorization', jwt),
		};
		return await this.http.post(API_URL + url, formData, options).toPromise();
	}

	/** *Get Share Preset */
	getSharePreset(fundraising_id: any, amount: any) {
		let API_URL = environment.apiUrl;
		let url = 'donation/create/preset/link/';
		let body = { amount: amount, fundraising_local_id: fundraising_id };
		return this.http.post(API_URL + url, body);
	}

	/** *Static data for updates */
	getUpdatesListData() {
		return [
			{
				date: '13 october 2019',
				content:
					'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.',
				mediaList: [
					{
						id: 1469,
						image:
							'https://res.cloudinary.com/whydonate/image/upload/v1/whydonate-staging/user/fundraiser-body/efdc6dba-46ef-11ec-9996-4727a726a306_hz9i1l',
						text: 'update_331',
						title: null,
						video_url: null,
					},
					{
						id: 1470,
						image:
							'https://res.cloudinary.com/whydonate/image/upload/v1/whydonate-staging/user/fundraiser-body/f11b77b6-46ef-11ec-9996-4727a726a306_eto0yt',
						text: 'update_331',
						title: null,
						video_url: null,
					},
					{
						id: 1471,
						image: null,
						text: 'update_331',
						title: null,
						video_url: 'https://www.youtube.com/embed/-zNFZjRo9Cc',
					},
				],
			},
			{
				date: '13 august 2019',
				content:
					'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots .',
				mediaList: [
					{
						id: 1472,
						image:
							'https://res.cloudinary.com/whydonate/image/upload/v1/whydonate-staging/user/fundraiser-body/f11b77b6-46ef-11ec-9996-4727a726a306_eto0yt',
						text: 'update_331',
						title: null,
						video_url: null,
					},
				],
			},
			{
				date: '13 august 2019',
				content:
					'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.',
				mediaList: [
					{
						id: 1473,
						image: null,
						text: 'update_331',
						title: null,
						video_url: null,
					},
				],
			},
		];
	}

	/** *FUNCTION TO DELETE A FUNDRAISER */
	deleteFundraiser(slug: string) {
		//let body = new FormData();
		//body.append('fundraising_local_id', fundraiserLocalId);
		let headers = this.accountService.getHeaders();
		return this.http.delete(this.FUNDRAISER_API_V2 + 'fundraiser', {
			params: { slug: slug },
			headers: headers,
		});
	}

	/**
	 * Function to check if slug is unique
	 */
	isSlugUnique(slug: string) {
		// let url = 'project/fundraising/local/slug/';
		let API_URL = environment.fundraiser_url;
		let url = 'fundraiser/slug/unique';
		let body = { params: { slug: slug } };
		// let headers = this.accountService.getHeaders();

		return this.http.get(API_URL + url, body);
	}
	/** *Upload Appeal Image List */
	uploadAppealImageList(formData: FormData) {
		let API_URL = environment.fundraiser_url;
		let url = 'fundraiser/image/list';
		let jwt: any;
		if (this.isBrowser)
			jwt = JSON.parse(localStorage.getItem('user') || '{}').jwt.jwt;
		let headers = new HttpHeaders().set('Authorization', `JWT ${jwt}`);

		return this.http.post(API_URL + url, formData, {
			headers: headers,
		});
	}

	/** *Getter and Setter for Current Fundraiser */
	getCurrentFundraiser() {
		return this.currentFundraiser;
	}

	setCurrentFundraiser(fundraiser: any) {
		this.currentFundraiser.next(fundraiser);
	}

	/**
	 * Function to replicate original translation inside fundraiser.translations so correct text is picked for title, appeal, content and description, after language is changed.
	 */
	filterFundraiserObj(fundraiser: Fundraiser) {
		if (!fundraiser) {
			return null;
		}
		fundraiser['translations'] = this.getFilteredTranslationObj(fundraiser);
		return fundraiser;
	}

	getFilteredTranslationObj(fundraiser: Fundraiser) {
		let WHYDONATE_LOCALE: LOCALE[] = ['en', 'nl', 'es', 'de', 'fr'];
		const APPEAL = 'appeal';
		const CONTENT = 'content';
		const DESCRIPTION = 'description';
		const TITLE = 'title';
		const IS_AUTO = 'is_auto';
		return Object.assign(
			{},
			...Object.entries({ ...WHYDONATE_LOCALE }).map(([a, l]) => {
				let localeSuffix: `_${LOCALE}` =
					this.getLocaleSuffix(l as LOCALE) || '_nl';
				let _APPEAL = (APPEAL +
					localeSuffix) as `${typeof APPEAL}${typeof localeSuffix}`;
				let _CONTENT = (CONTENT +
					localeSuffix) as `${typeof CONTENT}${typeof localeSuffix}`;
				let _DESCRIPTION = (DESCRIPTION +
					localeSuffix) as `${typeof DESCRIPTION}${typeof localeSuffix}`;
				let _TITLE = (TITLE +
					localeSuffix) as `${typeof TITLE}${typeof localeSuffix}`;
				let _IS_AUTO = (IS_AUTO +
					localeSuffix) as `${typeof IS_AUTO}${typeof localeSuffix}`;
				return {
					[_APPEAL]:
						fundraiser?.['translations']?.[_APPEAL] || fundraiser?.[APPEAL],
					[_CONTENT]:
						fundraiser?.['translations']?.[_CONTENT] || fundraiser?.[CONTENT],
					[_DESCRIPTION]:
						fundraiser?.['translations']?.[_DESCRIPTION] ||
						fundraiser?.[DESCRIPTION],
					[_TITLE]:
						fundraiser?.['translations']?.[_TITLE] || fundraiser?.[TITLE],
					[_IS_AUTO]: fundraiser?.['translations']?.[_IS_AUTO] || true,
				};
			})
		);
	}

	isFundraiserClosed(currentFundraiser: any) {
		let isDeleted = currentFundraiser?.deleted === true;
		let isNotLive = currentFundraiser?.live === false;

		let isClosed = currentFundraiser?.is_opened == false;
		let isDraft = currentFundraiser?.is_draft === true;
		let isNotFindable = currentFundraiser?.is_findable === false;

		let isEnded: boolean = false;
		if (currentFundraiser?.end_date == null) {
			isEnded = false;
		} else {
			isEnded =
				this._fundraiserCardService.getDateDiff(
					new Date(),
					new Date(currentFundraiser?.end_date)
				) === 0;
		}
		return isClosed || isDraft || isDeleted || isNotLive || isEnded; //Removed the  isNotFindable from here
	}
	isFundraiserClosedNew(currentFundraiser: any) {
		let isDeleted = currentFundraiser?.deleted === true;
		let isNotLive = currentFundraiser?.live === false;

		// let isClosed = currentFundraiser?.is_opened == false;
		let isDraft = currentFundraiser?.is_draft === true;
		return isDraft || isDeleted || isNotLive; //Removed the  isNotFindable from here
	}

	isFundraiserEndDateUnlimited(date: string) {
		let endDateDiff = moment(date).diff(moment(), 'days');
		if (endDateDiff > 15000) return true;
		return false;
	}

	getDateDiff(startDate: Date, endDate: Date): number {
		let dateDiff = this._fundraiserCardService.getDateDiff(startDate, endDate);
		return dateDiff;
	}

	/*
	 * Function to check if logged in user is the admin of currently opened fundraiser
	 */
	isLoggedInUserAdminOfFundraiser(fundraiserLocalId: string) {
		let endpoint = this.FUNDRAISER_API_V2 + 'fundraiser/connected/is_owner';
		let body = {
			fundraiser_local_id: fundraiserLocalId,
		};
		let headers: HttpHeaders = this.accountService.getHeaders();
		return this.httpClient.post(endpoint, body, { headers: headers });
	}

	/** Function to post the donor list visibility changes */
	showDonationList(body: any) {
		let url = 'fundraiser/show/donations';
		let options = {
			headers: this.accountService.getHeaders(),
		};
		return this.http.post(this.FUNDRAISER_URL + url, body, options);
	}

	/** Get Stripe Charges Status API */
	getStripeChargesStatus(slug: any) {
		// let url = 'project/fundraising/local/slug/';
		let API_URL = environment.fundraiser_url;
		let url = 'fundraiser/payment/status';
		let body = { params: { slug: slug } };
		// let headers = this.accountService.getHeaders();

		return this.http.get(API_URL + url, body);
	}

	getAllCurrencies() {
		let url = '/donation/stripe/currencies';
		return this.http.get(this.DONATION_API + url);
	}

	getMaxTargetAmountByCurrency(currency: string) {
		let url = '/donation/stripe/currencies?currency=' + currency;
		return this.http.get(this.DONATION_API + url);
	}

	allowConnectedFundraiser(body: any) {
		let url = 'fundraiser/child';
		let headers: HttpHeaders = this.accountService.getHeaders();
		return this.http.patch(this.FUNDRAISER_URL + url, body, {
			headers: headers,
		});
	}
}
