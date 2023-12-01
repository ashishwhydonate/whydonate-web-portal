import { Image } from './image-interface';

/**
 * TITLE: Fundraiser Card Interface
 * DESCRIPTION: FundraiserCardData Interface to be used in FundraiserCardComponent
 * FIELD: backgroundImage, profileImage, title, name, description, donationReceivedAmount, donationTargetAmount, donationDaysLeft
 * AUTHOR: Vivek Patt
 */

export interface FundraiserCardData {
	backgroundImage: Image;
	background_video?: string;
	profileImage?: Image;
	title: string;
	name: string;
	description?: string;
	donationReceivedAmount: number;
	donationTargetAmount?: number;
	donationDaysLeft?: number;
	showDonationAmount: boolean;
	isChild?: boolean;
	parent?: any;
	currency?: string;
	currency_symbol?: string;
	currency_code?: string;
	connected_to?: string,
}
