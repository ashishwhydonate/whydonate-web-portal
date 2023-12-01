/**
 * TITLE: Fundraiser Card Interface
 * DESCRIPTION: FundraiserCardData Interface to be used in FundraiserCardComponent
 * FIELD: backgroundImage, profileImage, title, name, description, donationReceivedAmount, donationTargetAmount, donationDaysLeft
 * AUTHOR: Vivek Patt
 */

export interface tableCsvData {
	created_at: string;
	description: string;
	status: string;
	amount: number;
	name: string;
	full_name: string;
	last_name: string;
	email: string;
	is_anonymous: boolean;
}
