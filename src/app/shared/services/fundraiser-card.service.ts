import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { FundraiserCardData } from '../interfaces/fundraiser-card-interface';
import { FundraiserCardDataCustomDonation } from '../interfaces/fundraiser-card-interface-custom-donation';
import { Image } from '../interfaces/image-interface';
import { AccountService } from 'src/app/pages/account/services/account.service';

@Injectable({
	providedIn: 'root',
})
export class FundraiserCardService {
	public _defaultBackgroundImage: Image;
	public _defaultProfileImagae: Image;
	public _fundraiserCardData: FundraiserCardData;

	constructor(private http: HttpClient, public accountService: AccountService) {
		this._defaultBackgroundImage = {
			src: 'https://res.cloudinary.com/whydonate/image/upload/dpr_auto,f_auto,q_auto,w_400/whydonate-staging/platform/visuals/fundraiser_default_bg',
			alt: 'fundraiser background image',
		};
		this._defaultProfileImagae = {
			src: 'https://res.cloudinary.com/whydonate/image/upload/dpr_auto,f_auto,q_auto,w_100/whydonate-production/platform/visuals/whydonate-logo-vierkant-licht',
			alt: 'profile avatar',
		};
		/** *Initialising Fundraiser Card Data */
		this._fundraiserCardData = {
			backgroundImage: this._defaultBackgroundImage,
			profileImage: this._defaultProfileImagae,
			title: '',
			name: '',
			description: '',
			donationReceivedAmount: 0,
			donationTargetAmount: 0,
			donationDaysLeft: 0,
			showDonationAmount: true,
			currency: '',
			currency_code: '',
			currency_symbol: '',
			connected_to: '',
		};
	}

	getFundraiserCardData(): FundraiserCardData {
		return this._fundraiserCardData;
	}

	setFundraiserCardData(
		_backgroundImage: Image,
		_profileImage: Image = { src: '' },
		_title: string,
		_name: string,
		_description: string = '',
		_donationReceivedAmount: number,
		_donationTargetAmount: number = 0,
		_donationDaysLeft: number,
		_showDonationAmount: boolean,
		_currency: string,
		_currency_code: string,
		_currency_symbol: string,
		_connected_to: string,
	): void {
		this._fundraiserCardData = {
			backgroundImage: _backgroundImage,
			profileImage: _profileImage,
			title: _title,
			name: _name,
			description: _description,
			donationReceivedAmount: _donationReceivedAmount,
			donationTargetAmount: _donationTargetAmount,
			donationDaysLeft: _donationDaysLeft,
			showDonationAmount: _showDonationAmount,
			currency: _currency,
			currency_code: _currency_code,
			currency_symbol: _currency_symbol,
			connected_to: _connected_to,
		};
	}

	/**
	 * DESCRIPTION: This function performs steps to get list of object having fundraiser card data and id, from Response data.
	 * functions called are - getSourceFromIndexList and filterFundraiserCardDataList.
	 * Returned object list of filterFundraiserCardDataList function is the return type of this function
	 * PARAM: ResponseData Response from Backend having data related to fundraising local
	 * RETURNS: FundraiserCardDataList
	 */
	getFundraiserCardDataList(ResponseData: any): {
		slug: string;
		fundraiserCardData: FundraiserCardData;
	}[] {
		let fundraiser_local_index_List = ResponseData.results;
		let sourceList = this.getSourceFromIndexList(fundraiser_local_index_List);
		let fundraiserCardDataList = this.filterFundraiserCardDataList(sourceList);
		return fundraiserCardDataList;
	}
	/**
	 * DESCRIPTION: This function performs steps to get list of object having fundraiser card data and id, from Response data.
	 * functions called are - getSourceFromIndexList and filterFundraiserCardDataList.
	 * Returned object list of filterFundraiserCardDataList function is the return type of this function
	 * PARAM: ResponseData Response from Backend having data related to fundraising local
	 * RETURNS: FundraiserCardDataList
	 */
	getFundraiserCardDataListElasticSearch(ResponseData: any): {
		slug: string;
		fundraiserCardData: FundraiserCardData;
	}[] {
		let fundraiser_local_index_List = ResponseData.results;
		let sourceList = this.getSourceFromIndexList(fundraiser_local_index_List);
		let fundraiserCardDataList =
			this.filterFundraiserCardDataListElasticSearch(sourceList);
		return fundraiserCardDataList;
	}

	/**
	 * DESCRIPTION: get list of source from results
	 * PARAM: results
	 * RETURNS: source[]
	 * EXAMPLE: results: [
	 * 0:{ .., .., _source:{..fundraiser info..}, .., ..},
	 * 1:{ .., .., _source:{..fundraiser info..}, .., ..},
	 * 2:{ .., .., _source:{..fundraiser info..}, .., ..}
	 * ]
	 * source: [0:{..fundraiser info..}, 1:{..fundraiser info..}]
	 */
	// getSourceFromIndexList(results: any[]) {
	// 	return results.map((result: any) => result._source);
	// }
	getSourceFromIndexList(results: any[]) {
		if (!results) {
			return [];
		}
		return results.map((result: any) => result._source);
	}

	/**
	 * DESCRIPTION: get list of object having fundraiser card data and id, from source list
	 * PARAM: sourceList
	 * RETURNS: FundraiserCardDataList
	 * EXAMPLE:
	 * source: [
	 * 0:{..fundraiser info..},
	 * 1:{..fundraiser info..}]
	 * FundraiserCardDataList: [
	 * 0: {id:Number, fundraiserCardData:FundraiserCardData},
	 * 1: {id:Number, fundraiserCardData:FundraiserCardData},
	 * 2: {id:Number, fundraiserCardData:FundraiserCardData}]
	 */
	getBool(val: any) {
		return !!JSON.parse(String(val)?.toLowerCase());
	}

	filterFundraiserCardDataListCustomDonation(
		sourceList: any[]
	): { slug: string; fundraiserCardData: FundraiserCardDataCustomDonation }[] {
		return sourceList.map((source: any) => {
			return {
				slug: source?.slug as string,
				fundraiserCardData: {
					backgroundImage: source?.backgroundImage,
					title: source?.title,
					name: '',
					donationReceivedAmount: (parseInt(source?.amount)
						? parseInt(source?.amount)
						: 0) as number,
					donationTargetAmount: source?.amount_target as number,
					donationDaysLeft: this.countDaysLeftToFundraiserEnd(
						source?.end_date
					) as number,
					showDonationAmount: this.getBool(source?.show_donation_details),
				},
			};
		});
	}
	/**
	 * DESCRIPTION: get list of object having fundraiser card data and id, from source list
	 * PARAM: sourceList
	 * RETURNS: FundraiserCardDataList
	 * EXAMPLE:
	 * source: [
	 * 0:{..fundraiser info..},
	 * 1:{..fundraiser info..}]
	 * FundraiserCardDataList: [
	 * 0: {id:Number, fundraiserCardData:FundraiserCardData},
	 * 1: {id:Number, fundraiserCardData:FundraiserCardData},
	 * 2: {id:Number, fundraiserCardData:FundraiserCardData}]
	 */
	filterFundraiserCardDataList(
		sourceList: any[]
	): { slug: string; fundraiserCardData: FundraiserCardData }[] {
		// console.log('sourceList22', sourceList[0].currency[0].symbol)
		return sourceList.map((source: any) => {
			return {
				slug: source?.slug as string,
				fundraiserCardData: {
					backgroundImage: {
						src: source ? this.getFundraiserBackgroundImage(source) : '',
						video: source?.background?.video || '',
					},
					profileImage: {
						src: this.getCloudinaryImageFileName(
							source?.profile?.image as string
						),
					},
					title: this.getFundraiserTitle(source),
					name: source?.profile?.name as string,
					description: this.trimDescription(
						this.getFundraiserDescription(source)
					),
					donationReceivedAmount: source?.donation?.amount as number,
					donationTargetAmount: source?.amount_target as number,
					donationDaysLeft: this.countDaysLeftToFundraiserEnd(
						source?.end_date
					) as number,
					showDonationAmount: source?.show_donation_details as boolean,
					isChild: source?.isConnected,
					currency: source?.currency
						? source?.currency[0]?.symbol
						: source?.currency_symbol
						? source?.currency_symbol
						: '€', // Use the OR operator
					currency_code: source?.currency_code,
					currency_symbol: source?.currency_symbol,
					connected_to: source?.connected_to,
				},
			};
		});
	}
	/**
	 * DESCRIPTION: get list of object having fundraiser card data and id, from source list
	 * PARAM: sourceList
	 * RETURNS: FundraiserCardDataList
	 * EXAMPLE:
	 * source: [
	 * 0:{..fundraiser info..},
	 * 1:{..fundraiser info..}]
	 * FundraiserCardDataList: [
	 * 0: {id:Number, fundraiserCardData:FundraiserCardData},
	 * 1: {id:Number, fundraiserCardData:FundraiserCardData},
	 * 2: {id:Number, fundraiserCardData:FundraiserCardData}]
	 */
	filterFundraiserCardDataListElasticSearch(
		sourceList: any[]
	): { slug: string; fundraiserCardData: FundraiserCardData }[] {
		return sourceList.map((source: any) => {
			return {
				slug: source.slug as string,
				fundraiserCardData: {
					backgroundImage: {
						src: this.getFundraiserBackgroundImageElasticSearch(source),
						video: source.video,
					},
					profileImage: {
						src: this.getCloudinaryImageFileName(
							source.profile?.background as string
						),
					},
					title: this.getFundraiserTitleElasticSearch(source),
					name: source?.profile?.name as string,
					description: this.trimDescription(
						this.getFundraiserDescriptionElasticSearch(source)
					),
					donationReceivedAmount: source?.donation as number,
					donationTargetAmount: source?.amount_target as number,
					donationDaysLeft: this.countDaysLeftToFundraiserEndElasticSearch(
						source?.end_date
					) as number,
					showDonationAmount: source?.show_donation_details as boolean,
					currency: source?.currency
						? source?.currency[0]?.symbol
						: source?.currency_symbol
						? source?.currency_symbol
						: '€', // Use the OR operator
				},
			};
		});
	}

	filterFundraiserCardDataListForMainfundraisers(
		sourceList: any[]
	): { slug: string; fundraiserCardData: any }[] {
		return sourceList?.map((source: any) => {
			return {
				slug: source?.slug as string,
				fundraiserCardData: {
					backgroundImage: {
						src: this.getMyFundraiserBackgroundImage(source),
					},
					title: source?.title as string,
					name: source?.profile?.name as string,
					// description: this.trimDescription(source?.description as string),
					donationReceivedAmount: source?.donations as number,
					donationTargetAmount: source?.amount_target as number,
					// donationDaysLeft: this.countDaysLeftToFundraiserEnd(
					// 	source?.end_date
					// ) as number,
					showDonationAmount: true,
					isChild: this.isChildFundraiser(source),
					parent: {
						backgroundImage: {
							src: this.getCloudinaryImageFileName(
								source?.background as string
							),
						},
						profileImage: {
							src: this.getCloudinaryImageFileName(
								source?.profile?.image as string
							),
						},
						title: source?.parent_title as string,
						// name: source?.parent?.profile?.name as string,
					},
				},
			};
		});
	}

	/** *INFO: return filename which is at the end 'cloudinary_url/FileName' */
	getCloudinaryImageFileName(imageSrc: string) {
		if (imageSrc) {
			let pathSplit = imageSrc.split('/');
			if (pathSplit.length > 1)
				return pathSplit[pathSplit.length - 1] as string;
		}
		return imageSrc;
	}

	getFundraiserBackgroundImageElasticSearch(source: any) {
		let backgroundImage;
		if (source?.background != null) {
			backgroundImage = this.getCloudinaryImageFileName(source?.background);
		}
		if (source?.parent?.background != null) {
			backgroundImage = this.getCloudinaryImageFileName(
				source?.parent?.background
			);
		}
		if (source?.root_fundraiser?.background != null) {
			backgroundImage = this.getCloudinaryImageFileName(
				source?.root_fundraiser?.background?.image
			);
		}
		return backgroundImage || '';
	}

	getFundraiserBackgroundImage(source: any) {
		let backgroundImage;

		if (source?.background != null) {
			backgroundImage = this.getCloudinaryImageFileName(
				source?.background?.image
			);
		}
		if (source?.parent?.background != null) {
			backgroundImage = this.getCloudinaryImageFileName(
				source?.parent?.background?.image
			);
		}
		if (source?.root_fundraiser?.background != null) {
			backgroundImage = this.getCloudinaryImageFileName(
				source?.root_fundraiser?.background?.image
			);
		}
		return backgroundImage || '';
	}

	getMyFundraiserBackgroundImage(source: any) {
		let backgroundImage;

		if (source?.background != null) {
			backgroundImage = this.getCloudinaryImageFileName(source?.background);
		}
		return backgroundImage || '';
	}
	getFundraiserTitle(source: any) {
		return this.getTranslatedText(source, 'title');
	}
	getFundraiserDescription(source: any) {
		return this.getTranslatedText(source, 'appeal');
	}
	/**
	 * Function to fetch correct translation for Title, Descrription for fundraiser card for elastic searxh
	 */

	getFundraiserTitleElasticSearch(source: any) {
		return this.getTranslatedTextElasticSearch(source, 'title');
	}
	getFundraiserDescriptionElasticSearch(source: any) {
		return this.getTranslatedTextElasticSearch(source, 'description');
	}
	getTranslatedTextElasticSearch(source: any, translationKey: string) {
		let locale = this.accountService.getLocaleId();
		// if local is same as fundraiser locale then get text directly, else check translation
		let translationText =
			source?.[`translation`]?.[`${translationKey}_${locale}`]?.trim() ||
			source?.[`${translationKey}`]?.trim();
		// If translation found, then return translation, else check parent and then return translation
		if (translationText) return translationText;
		else {
			// if local is same as fundraiser locale then get text directly, else check translation
			let parentTitleTranslation =
				source?.['parent']?.['parent_translations']?.[
					`${translationKey}_${locale}`
				]?.trim() || source?.['parent']?.[`${translationKey}`]?.trim();
			return parentTitleTranslation || '';
		}
	}
	/**
	 * Function to fetch correct translation for Title, Descrription for fundraiser card
	 */
	getTranslatedText(source: any, translationKey: string) {
		let locale = this.accountService.getLocaleId();
		// if local is same as fundraiser locale then get text directly, else check translation
		let translationText =
			source?.[`translations`]?.[`${translationKey}_${locale}`]?.trim() ||
			source?.[`${translationKey}`]?.trim();
		// If translation found, then return translation, else check parent and then return translation
		if (translationText) return translationText;
		else {
			// if local is same as fundraiser locale then get text directly, else check translation
			let parentTitleTranslation =
				source?.['parent']?.['parent_translations']?.[
					`${translationKey}_${locale}`
				]?.trim() || source?.['parent']?.[`${translationKey}`]?.trim();
			return parentTitleTranslation || '';
		}
	}
	/** *INFO function to trim length and add '...' as a postfix to the description, (slice at len 200 if desc len is more then 200, to avoid empty trim) */
	trimDescription(description: string): string {
		if (description?.length > 145)
			return description.slice(0, 140).trim() + '...';
		else return description;
	}
	isFundraiserEndDateUnlimited(_endDate: string) {
		if (_endDate != undefined || _endDate != null) {
			let startDate: Date = new Date(new Date().setHours(0, 0, 0, 0));
			let endDate: Date = new Date(new Date(_endDate).setHours(24, 0, 0, 0));
			if (startDate.getTime() < endDate.getTime()) {
				let Difference_In_Time = endDate.getTime() - startDate.getTime();
				let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
				let endDateDiff = Math.ceil(Difference_In_Days);
				if (endDateDiff > 15000) return true;
			}
		}
		return false;
	}
	countDaysLeftToFundraiserEnd(_endDate: string): number {
		if (_endDate == null) {
			return -1;
		}
		let daysLeft = this.getDateDiff(new Date(), new Date(_endDate));
		if (daysLeft >= 0 && daysLeft < 15000) {
			return daysLeft;
		} else {
			return -1;
		}
	}
	countDaysLeftToFundraiserEndElasticSearch(_endDate: string): number {
		let daysLeft = this.getDateDiff(new Date(), new Date(_endDate));

		if (daysLeft > 0 && daysLeft < 15000) {
			return daysLeft;
		} else {
			return -1;
		}
	}

	getDateDiff(_startDate: Date, _endDate: Date): number {
		let startDate: Date = new Date(_startDate.setHours(0, 0, 0, 0));
		let endDate: Date = new Date(_endDate.setHours(24, 0, 0, 0));
		if (startDate.getTime() < endDate.getTime()) {
			let Difference_In_Time = endDate.getTime() - startDate.getTime();
			let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
			return Math.ceil(Difference_In_Days);
		} else {
			return 0;
		}
	}
	// Check If the fundraiser is Child or Parent
	isChildFundraiser(currentFundraiser: any) {
		if (
			currentFundraiser.parent_title != null &&
			Object.keys(currentFundraiser.parent_title).length > 0
		) {
			return true;
		}
		return false;
	}

	/** *Static data, remove in future */
	getObjWithData(): FundraiserCardData {
		/** *NOTE: temporary static data */
		return {
			backgroundImage: {
				src: 'https://res.cloudinary.com/whydonate/image/upload/whydonate-production/user/fundraiser-background/ea74346e-c609-11eb-9ceb-51019c7614b5_vzl3jh',
				alt: 'fundraiser background image',
			},
			profileImage: {
				src: 'https://res.cloudinary.com/whydonate/image/upload/whydonate-production/user/profile/827a690e-1c41-11eb-8d04-6bef809e0ab9_s1u9a2',
				alt: 'profile avatar image',
			},
			title: 'Team Semmy goes Alpenbrevet voor Stichting Semmy',
			name: 'John Emmerik',
			description: this.trimDescription(
				`Onze hulp is nog steeds broodnodig om ervoor te zorgen dat onderzoek naar hersenstamkanker, de meest dodelijke vorm van kanker bij kinderen, door kan gaan. Stichting Semmy financiert onderzoek naar deze ziekte in Prinses Maxima Centrum Utrecht, Erasmus Medisch Centrun Rotterdam, en Universitair Ziekenhuis Antwerpen. In de Corona tijd is er nauwelijks geld binnengekomen maar zijn wel de verplichtingen jegens de ziekenhuizen voldaan. Snel extra geld is dus hard nodig. Een groep fietsvrienden, waar ik ook bij hoor, gaat nu de uitdaging aan om 4 september de fameuze Alpenbrevet tocht te fietsen. We hebben gekozen voor de Goldtour.`
			),
			donationReceivedAmount: 23505,
			donationTargetAmount: 80000,
			donationDaysLeft: 10,
			showDonationAmount: true,
		};
	}

	fundraiser() {
		let API_URL = environment.apiUrl;
		return this.http.get(API_URL + 'project/fundraising/local/popular/');
	}
}
