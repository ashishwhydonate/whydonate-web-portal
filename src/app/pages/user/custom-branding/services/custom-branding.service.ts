import { Injectable } from '@angular/core';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { APIService } from 'src/app/global/services/api.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

type Flag = boolean;
type Message = string;
export interface profileId {
	id: number;
}
export interface ThankYou {
	thank_you_donor: Flag;
	thank_you_donor_message: Message;
}
export interface Register {
	thank_you_register: Flag;
	thank_you_register_message: Message;
}
export interface DonationReceived {
	donation_received: Flag;
	donation_received_message: Message;
}
export interface FundraiserCreated {
	connected_fundraisers: Flag;
	connected_fundraisers_message: Message;
}
export interface FundraiserPublished {
	fundraiser_published: Flag;
	fundraiser_published_message: Message;
}
export interface FundraiserClosed {
	fundraiser_closed: Flag;
	fundraiser_closed_message: Message;
}

export interface CustomEmail {
	customBranding: Flag;
	customLogo: string;
	primaryColor: string;
	secondaryColor: string;

	thankYouFlag: Flag;
	thankYouMessage: Message;

	registerFlag: Flag;
	registerMessage: Message;

	donationReceivedFlag: Flag;
	donationReceivedMessage: Message;

	fundraiserCreatedFlag: Flag;
	fundraiserCreatedMessage: Message;

	fundraiserPublishedFlag: Flag;
	fundraiserPublishedMessage: Message;

	fundraiserClosedFlag: Flag;
	fundraiserClosedMessage: Message;
}

export interface CustomBranding {
	customLogo: string;
	cardShadow: string;
	primaryColor: string;
	secondaryColor: string;
	customFont: string;
}
export interface CustomReceipt {
	customLogo: string;
	cardShadow: string;
	primaryColor: string;
	secondaryColor: string;
	customFont: string;
}

@Injectable({
	providedIn: 'root',
})
/** *Custom Branding Service */
export class CustomBrandingService {
	profileApi = 'account/profile/';
	updateTextAPI = 'fundraiser/email/text';
	testEmailApi = 'account/test/email/';
	profileData = {};
	// customEmail!: CustomEmail;
	customEmail: any;
	isReceived = new BehaviorSubject<boolean>(false);
	isReceived$ = this.isReceived.asObservable();
	API_URL: string = environment.apiUrl;
	FUNDRAISER_API_V2: string = environment.FUNDRAISER_API_V2;
	ACCOUNT_API_V2: string = environment.ACCOUNT_API_V2;

	emailEventName = [
		'donation successful',
		'user register event',
		'donation received',
		'fundraiser connected',
		'fundraiser published',
		'fundraiser ended',
	];

	constructor(
		private _accountService: AccountService,
		private http: HttpClient
	) {}

	getIsReceived() {
		return this.isReceived$;
	}
	setIsReceived(value: boolean) {
		return this.isReceived.next(value);
	}
	getProfile() {
		let headers = this._accountService.getHeaders();
		return this.http.get(environment.ACCOUNT_API_V2 + this.profileApi, {
			headers: headers,
		});
	}

	set setProfileObj(profile: any) {
		this.profileData = profile;
	}

	get getProfileObj(): any {
		return this.profileData;
	}

	get getBrandingObj() {
		return {
			isDefault: (this.profileData as any)?.is_default,
			customLogo:
				(this.profileData as any)?.custom_logo ||
				'https://res.cloudinary.com/whydonate/image/upload/w_92,h_25,dpr_auto,q_auto/whydonate-staging/platform/visuals/new_design_logo.svg',
			cardShadow: (this.profileData as any)?.card_shadow || 1,
			primaryColor: (this.profileData as any)?.primary_color || '#32bf55',
			secondaryColor: (this.profileData as any)?.secondary_color || '#363396',
			customFont: (this.profileData as any)?.fonts || 'Roboto',
		};
	}

	saveCustomBranding(formBody: any) {
		return this.put(formBody);
	}

	set setcustomEmailObj(value: any) {
		this.customEmail = value;
	}
	get getCustomEmailObj(): CustomEmail {
		let profile = this.getProfileObj;
		this.customEmail = {
			customBranding: profile?.apply_custom_branding,
			customLogo:
				profile?.custom_logo ||
				'https://res.cloudinary.com/whydonate/image/upload/w_92,h_25,dpr_auto,q_auto/whydonate-staging/platform/visuals/new_design_logo.svg',
			primaryColor: profile?.primary_color || '#32bf55',
			secondaryColor: profile?.secondary_color || '#363396',

			thankYouFlag: profile?.thank_you_donor,
			thankYouMessage: profile?.thank_you_donor_message,

			registerFlag: profile?.thank_you_register,
			registerMessage: profile?.thank_you_register_message,

			donationReceivedFlag: profile?.donation_received,
			donationReceivedMessage: profile?.donation_received_message,

			fundraiserCreatedFlag: profile?.connected_fundraisers,
			fundraiserCreatedMessage: profile?.connected_fundraisers_message,

			fundraiserPublishedFlag: profile?.fundraiser_published,
			fundraiserPublishedMessage: profile?.fundraiser_published_message,

			fundraiserClosedFlag: profile?.fundraiser_closed,
			fundraiserClosedMessage: profile?.fundraiser_closed_message,
		};
		return this.customEmail;
	}
	get getEmailCustomBrandingObj(): {
		primaryColor: string;
		secondaryColor: string;
	} {
		return {
			primaryColor: (this.profileData as any).primary_color || '#32bf55',
			secondaryColor: (this.profileData as any).secondary_color || '#363396',
		};
	}

	saveCustomEmail(
		customEmail:
			| ThankYou
			| Register
			| DonationReceived
			| FundraiserCreated
			| FundraiserPublished
			| FundraiserClosed
	) {
		// console.log(customEmail);
		let _profileId: profileId = { id: (this.profileData as any)?.id };
		let body = Object.assign(customEmail, _profileId);
		console.log(body);
		let headers = this._accountService.getHeaders();
		return this.http.put(this.FUNDRAISER_API_V2 + this.updateTextAPI, body, {
			headers: headers,
		});
	}

	applyCustomBrandingToEmail(flag: boolean) {
		let path = 'account/custom_branding_to_email/update';
		let headers = this._accountService.getHeaders();
		let body = { apply_custom_branding_to_email: flag };
		return this.http.put(environment.ACCOUNT_API_V2 + path, body, {
			headers: headers,
		});
	}

	calculateCardShadow(cardShadow: string) {
		let card_shadow = Number(cardShadow);
		if (card_shadow > 3) {
			return '4';
		}
		if (card_shadow > 1) {
			return '2';
		}
		return '1';
	}

	sendTestEmail(index: number, message: any, customBrandingFlag: any) {
		let body = {
			event: this.getEventName(index),
			title: 'My test fundraiser',
			message: message,
		};
		!message && delete body.message;
		return this.post(body);
	}

	getEventName(index: number) {
		return this.emailEventName[index];
	}

	put(body: any) {
		let headers = this._accountService.getHeaders();
		return this.http.put(this.API_URL + this.profileApi, body, {
			headers: headers,
		});
	}
	receipt_message(body: any) {
		let headers = this._accountService.getHeaders();
		return this.http.put(
			environment.ACCOUNTING_API + 'accounting/receipt',
			body,
			{
				headers: headers,
			}
		);
	}
	post(body: any) {
		let headers = this._accountService.getHeaders();
		return this.http.post(this.ACCOUNT_API_V2 + this.testEmailApi, body, {
			headers: headers,
		});
	}

	convertBase64toBlob(
		b64Data: any,
		contentType = 'image/png',
		sliceSize = 512
	) {
		let base64ImageContent = b64Data.replace(
			/^data:image\/(png|jpg|jpeg|webp);base64,/,
			''
		);
		const byteCharacters = atob(base64ImageContent);
		const bytesLength = byteCharacters.length;
		const slicesCount = Math.ceil(bytesLength / sliceSize);
		const byteArrays = new Array(slicesCount);

		for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
			const begin = sliceIndex * sliceSize;
			const end = Math.min(begin + sliceSize, bytesLength);

			const bytes = new Array(end - begin);
			for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
				bytes[i] = byteCharacters[offset].charCodeAt(0);
			}
			byteArrays[sliceIndex] = new Uint8Array(bytes);
		}
		const imageBlob = new Blob(byteArrays, { type: contentType });
		return imageBlob;
	}
}
