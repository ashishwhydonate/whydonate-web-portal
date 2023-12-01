import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { APIService } from 'src/app/global/services/api.service';
import { environment } from 'src/environments/environment';
import { Fundraiser } from '../../fundraiser/models/fundraiser';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CustomDonationFormData } from 'src/app/shared/interfaces/custom-donation-form-interface';
import { Image } from 'src/app/shared/interfaces/image-interface';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
	providedIn: 'root',
})

/*
 * Donation Service Module
 */
export class DonationService {
	selectedFundraiser: any;
	API_BASE_URL: string = environment.apiUrl;
	DONATION_API_V2: string = environment.DONATION_API_V2;
	FUNDRAISER_API_V2: string = environment.FUNDRAISER_API_V2;
	donationMadeData: any;
	data: any;
	selectedCurrency: BehaviorSubject<any> = new BehaviorSubject<any>({
		currency: '',
		symbol: '',
	});
	public _customDonationFormData: CustomDonationFormData;
	public _defaultBackgroundImage: Image;
	public _defaultProfileImage: Image;
	isBrowser: boolean = false;

	constructor(
		public apiService: APIService,
		public httpClient: HttpClient,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		this._defaultBackgroundImage = {
			src: 'https://res.cloudinary.com/whydonate/image/upload/dpr_auto,f_auto,q_auto,w_400/whydonate-staging/platform/visuals/fundraiser_default_bg',
			alt: 'fundraiser background image',
		};
		this._defaultProfileImage = {
			src: 'https://res.cloudinary.com/whydonate/image/upload/dpr_auto,f_auto,q_auto,w_100/whydonate-production/platform/visuals/whydonate-logo-vierkant-licht',
			alt: 'profile avatar',
		};
		/** *Initialising Custom Donation Form Data */
		this._customDonationFormData = {
			allow_child: true,
			amount: 0,
			amount_target: 0,
			amount_x: 0,
			backgroundImage: this._defaultBackgroundImage,
			custom_config_created_at: '',
			end_date: '',
			id: 0,
			image: this._defaultBackgroundImage,
			is_draft: true,
			is_findable: false,
			is_opened: false,
			monthly_first: '',
			monthly_second: '',
			monthly_third: '',
			monthly_forth: '',
			monthly_select: true,
			monthly_style: false,
			name: '',
			onetime_first: '',
			onetime_forth: '',
			onetime_second: '',
			onetime_third: '',
			onetime_select: true,
			onetime_style: false,
			other_amount: true,
			show_donation_details: true,
			slug: '',
			tip_enabled: true,
			title: '',
			unlimited: false,
			yearly_first: '',
			yearly_forth: '',
			yearly_second: '',
			yearly_select: true,
			yearly_style: false,
			yearly_third: '',
			currency: '',
			symbol: '',
			x_to_eur: 0,
			customdonationconfiguration_exists: false,
			min_donation_amount: 0,
			max_donation_amount: 0,
			primary_color: '',
			secondary_color: '',
		};
	}

	/*
	 * Function to make donations
	 * @param donationPayload
	 * @returns
	 */
	makeDonation(donationPayload: any) {
		let user: any;
		if (this.isBrowser) user = localStorage.getItem('user') || '{}';
		let headers;
		if (user != '{}' && user != null && user != undefined) {
			let jwt = JSON.parse(user)?.jwt?.jwt || null;
			if (jwt != null && jwt != undefined && jwt != '{}') {
				headers = new HttpHeaders().set('Authorization', `JWT ${jwt}`);
			}
		}
		this.donationMadeData = donationPayload;
		if (this.isBrowser)
			localStorage.setItem('donation', JSON.stringify(donationPayload));
		let url = 'donation/order/';
		if (user != '{}') {
			return this.httpClient.post(this.DONATION_API_V2 + url, donationPayload, {
				headers: headers,
			});
		} else {
			return this.httpClient.post(this.DONATION_API_V2 + url, donationPayload);
		}
	}

	// makeDonation(donationPayload: any) {
	// 	let user = localStorage.getItem('user') || '{}';
	// 	let headers;
	// 	try {
	// 		let jwt = JSON.parse(user)?.jwt?.jwt || null;
	// 		if (jwt != null || jwt != undefined || jwt != '{}') {
	//   		headers = new HttpHeaders().set('Authorization', `JWT ${jwt}`);
	// 	}}
	//  	catch (error) {
	// 	console.error('Error parsing JWT token:', error);
	// 	}
	// 	this.donationMadeData = donationPayload;
	// 	localStorage.setItem('donation', JSON.stringify(donationPayload));
	// 	let url = 'donation/order/';
	// 	if (headers) {
	// 	  return this.httpClient.post(this.DONATION_API_V2 + url, donationPayload, {
	// 		headers: headers,
	// 	  });
	// 	} else {
	// 	  return this.httpClient.post(this.DONATION_API_V2 + url, donationPayload);
	// 	}
	// }

	/** *Get Donation Receipt */
	getDonationReceipt() {
		return this.data;
	}

	getReceipt(transaction_id: string) {
		const path = 'donation/receipt';
		const url = environment.DONATION_API_V2 + path;
		return this.httpClient.post(url, {
			transaction_id: transaction_id,
		});
	}

	/*
	 * Function to retrieve order status
	 * @param orderId
	 * @returns
	 */
	getOrderStatus(orderId: any) {
		let url = 'donation/order/status/';
		return this.httpClient.get(this.DONATION_API_V2 + url, {
			params: { order_id: orderId },
		});
	}

	/*
	 * Function to update donor message
	 * @param data
	 * @returns
	 */
	saveDonorDetails(data: any) {
		let path = 'donation/donor/update/';
		return this.httpClient.post(this.DONATION_API_V2 + path, data, {
			headers: new HttpHeaders().set('content-type', 'application/json'),
		});
	}

	/*
	 * Function to add donor message
	 * @param data
	 * @returns
	 */
	saveMessage(data: any) {
		let path = 'donation/donor/message/';
		return this.httpClient.post(this.API_BASE_URL + path, data, {
			headers: new HttpHeaders().set('content-type', 'application/json'),
		});
	}

	/*
	 * Set Selected Fundraiser
	 */
	setSelectedFundraiser(fundraiser: any) {
		this.selectedFundraiser = fundraiser;
	}

	/*
	 * Get Selected Fundraiser
	 */
	getSelectedFundraiser() {
		return this.selectedFundraiser;
	}

	/** *Empty Selected Fundraiser */
	emptySelectedFundraiser() {
		this.selectedFundraiser = undefined;
	}

	getDonationDone() {
		try {
			if (this.isBrowser)
				return JSON.parse(localStorage.getItem('donation') || '{}');
		} catch (error) {
			return {};
		}
	}

	setSelectedCurrency(currency: any) {
		this.selectedCurrency.next(currency);
	}

	getSelectedCurrency() {
		return this.selectedCurrency.getValue();
	}

	getAllCurrenciesList() {
		let path = 'donation/stripe/currencies';
		return this.httpClient.get(this.DONATION_API_V2 + path);
	}

	getDonationConfigurationOfFundraiser(slug: string, currency: string) {
		let path = 'fundraiser/donation/values';
		return this.httpClient.get(this.FUNDRAISER_API_V2 + path, {
			params: {
				slug: slug,
				currency: currency,
			},
		});
	}

	transformCustomDonationData(data: any): CustomDonationFormData {
		return {
			allow_child: data?.fundraiser_data?.allow_child,
			amount: parseFloat(data?.amount),
			amount_target: parseFloat(data?.fundraiser_data?.amount_target),
			amount_x: parseFloat(data?.amount_x),
			backgroundImage: {
				src: data?.fundraiser_data?.background?.image,
				video: data?.fundraiser_data?.background?.video,
			},
			custom_config_created_at:
				data?.customdonationconfiguration?.custom_config_created_at,
			end_date: data?.fundraiser_data?.end_date,
			id: data?.fundraiser_data?.id,
			image: {
				src: data?.fundraiser_data?.background?.image,
				video: data?.fundraiser_data?.background?.video,
			},
			is_draft: data?.fundraiser_data?.is_draft,
			is_findable: data?.fundraiser_data?.is_findable,
			is_opened: data?.fundraiser_data?.is_opened,
			monthly_first: data?.customdonationconfiguration?.monthly.default_1,
			monthly_second: data?.customdonationconfiguration?.monthly.default_2,
			monthly_third: data?.customdonationconfiguration?.monthly.default_3,
			monthly_forth: data?.customdonationconfiguration?.monthly.default_4,
			monthly_select: data?.customdonationconfiguration?.monthly.monthly_select,
			monthly_style:
				data?.customdonationconfiguration?.monthly_is_open_donation,
			name: data?.fundraiser_data.name,
			onetime_first: data?.customdonationconfiguration?.onetime.default_1,
			onetime_forth: data?.customdonationconfiguration?.onetime.default_4,
			onetime_second: data?.customdonationconfiguration?.onetime.default_2,
			onetime_third: data?.customdonationconfiguration?.onetime.default_3,
			onetime_select: data?.customdonationconfiguration?.onetime.onetime_select,
			onetime_style:
				data?.customdonationconfiguration?.onetime_is_open_donation,
			other_amount: data?.customdonationconfiguration?.other_amount,
			show_donation_details: data?.fundraiser_data?.show_donation_details,
			slug: data?.fundraiser_data?.slug,
			tip_enabled: data?.fundraiser_data?.tip_enabled,
			title: data?.fundraiser_data?.title,
			unlimited: data?.fundraiser_data?.unlimited,
			yearly_first: data?.customdonationconfiguration?.yearly.default_1,
			yearly_forth: data?.customdonationconfiguration?.yearly.default_4,
			yearly_second: data?.customdonationconfiguration?.yearly.default_2,
			yearly_select: data?.customdonationconfiguration?.yearly.yearly_select,
			yearly_style: data?.customdonationconfiguration?.yearly_is_open_donation,
			yearly_third: data?.customdonationconfiguration?.yearly.default_3,
			currency: data?.currency,
			symbol: data?.symbol,
			x_to_eur: parseFloat(data?.x_to_eur),
			customdonationconfiguration_exists:
				data?.customdonationconfiguration?.customdonationconfiguration_exists,
			min_donation_amount: parseFloat(
				data?.customdonationconfiguration?.min_donation_amount
			),
			max_donation_amount: parseFloat(
				data?.customdonationconfiguration?.max_donation_amount
			),
			primary_color: data?.customdonationconfiguration?.primary_color,
			secondary_color: data?.customdonationconfiguration?.secondary_color,
		};
	}

	getCustomDonationConfiguration(
		slug: string,
		currency: string
	): Observable<CustomDonationFormData> {
		return this.getDonationConfigurationOfFundraiser(slug, currency).pipe(
			map((response: any) => {
				const customDonationData = this.transformCustomDonationData(
					response?.data
				);
				// console.log('Custom Donation services:', customDonationData);
				return customDonationData;
			})
		);
	}

	getDefaultDonationCustomBranding(currency: string) {
		let path = 'fundraiser/default/custom_donation_form';
		return this.httpClient.get(this.FUNDRAISER_API_V2 + path, {
			params: {
				currency: currency,
			},
		});
	}
}
