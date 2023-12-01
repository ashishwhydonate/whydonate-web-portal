import { Image } from './image-interface';

/**
 * TITLE: Fundraiser Card Interface
 * DESCRIPTION: FundraiserCardData Interface to be used in FundraiserCardComponent
 * FIELD: backgroundImage, profileImage, title, name, description, donationReceivedAmount, donationTargetAmount, donationDaysLeft
 * AUTHOR: Vivek Patt
 */

export interface FundraiserCardDataCustomDonation {
	backgroundImage: any;
	title: any;
	name: any;
	donationReceivedAmount: number;
	donationTargetAmount?: number;
	donationDaysLeft?: number;
	showDonationAmount: boolean;
	isChild?: boolean;
	parent?: any;
}
