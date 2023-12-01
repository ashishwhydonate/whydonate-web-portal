/**
 * TITLE: Custom Donation Form Interface
 * DESCRIPTION: CustomDonationForm Interface to be used in CustomDonationFormComponent
 * AUTHOR: Saif ur Rahman
 */

import { Image } from './image-interface';

export interface CustomDonationFormData {
	allow_child: boolean;
	amount: number;
	amount_target: number;
	amount_x: number;
	backgroundImage: Image;
	custom_config_created_at: string;
	end_date: string;
	id: number;
	image: Image;
	is_draft: boolean;
	is_findable: boolean;
	is_opened: boolean;
	monthly_first: string;
	monthly_second: string;
	monthly_third: string;
	monthly_forth: string;
	monthly_select: boolean;
	monthly_style: boolean;
	name: string;
	onetime_first: string;
	onetime_forth: string;
	onetime_second: string;
	onetime_third: string;
	onetime_select: boolean;
	onetime_style: boolean;
	other_amount: boolean;
	show_donation_details: boolean;
	slug: string;
	tip_enabled: boolean;
	title: string;
	unlimited: boolean;
	yearly_first: string;
	yearly_forth: string;
	yearly_second: string;
	yearly_select: boolean;
	yearly_style: boolean;
	yearly_third: string;
	currency: string;
	symbol: string;
	x_to_eur: number;
	customdonationconfiguration_exists: boolean;
	min_donation_amount: number;
	max_donation_amount: number;
	primary_color: string;
	secondary_color: string;
	background_video?: string;
}
