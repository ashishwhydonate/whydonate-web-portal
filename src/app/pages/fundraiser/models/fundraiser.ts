/**
 * This class is responsible for coupling the data of a fundraiser
 */

/** *Parent Class--------------------------------------------- */
export class Fundraiser {
	id: string;
	created_at: string;
	title: string;
	slug: string;
	description: string;
	category: Category;
	location_local: Location_local;
	end_date: string;
	amount_target: string;
	is_findable: boolean;
	unlimited: boolean;
	background: Background;
	information: Information[];
	socialmedia: SocialMedia;
	profile: FundraiserProfile;
	donation: FundraiserDonation;
	parent: string;
	completed: boolean;
	live: boolean;
	content: string;
	translations: FundraiserTranslations;
	created_on: string;
	is_draft: boolean;
	show_donation_details: boolean;
	is_opened: boolean;
	language_code: string;
	custom_style: FundraiserCustomStyle;
	custom_donation_configuration: FundraiserCustomDonationConfiguration;
	source: string;
	tip_enabled: boolean;
	deleted: boolean;
	last_donation_date: string;
	allow_child: boolean;
	appeal: string;
	root_fundraiser: string;
	image_list: FundraiserMediaList[];
	appeal_image_list: string;

	constructor(
		id: string = '',
		created_at: string = '',
		title: string = '',
		slug: string = '',
		description: string = '',
		category: Category,
		location_local: Location_local,
		end_date: string = '',
		amount_target: string = '',
		is_findable: boolean = false,
		unlimited: boolean = false,
		background: Background,
		information: Information[],
		socialmedia: SocialMedia,
		profile: FundraiserProfile,
		donation: FundraiserDonation,
		parent: string = '',
		completed: boolean = false,
		live: boolean = false,
		content: string = '',
		translations: FundraiserTranslations,
		created_on: string = '',
		is_draft: boolean = false,
		show_donation_details: boolean = false,
		is_opened: boolean = false,
		language_code: string = '',
		custom_style: FundraiserCustomStyle,
		custom_donation_configuration: FundraiserCustomDonationConfiguration,
		source: string = '',
		tip_enabled: boolean = false,
		deleted: boolean = false,
		last_donation_date: string = '',
		allow_child: boolean = false,
		appeal: string = '',
		root_fundraiser: string = '',
		image_list: FundraiserMediaList[],
		appeal_image_list: string = ''
	) {
		this.id = id;
		this.created_at = created_at;
		this.title = title;
		this.slug = slug;
		this.description = description;
		this.category = category ? category : new Category();
		this.location_local = location_local
			? location_local
			: new Location_local('', '', '', new Location(), '');
		this.end_date = end_date;
		this.amount_target = amount_target;
		this.is_findable = is_findable;
		this.unlimited = unlimited;
		this.background = background ? background : new Background();
		this.information = information;
		this.socialmedia = socialmedia ? socialmedia : new SocialMedia();
		this.profile = profile ? profile : new FundraiserProfile();
		this.donation = donation ? donation : new FundraiserDonation();
		this.parent = parent;
		this.completed = completed;
		this.live = live;
		this.content = content;
		this.translations = translations
			? translations
			: new FundraiserTranslations();
		this.created_on = created_on;
		this.is_draft = is_draft;
		this.show_donation_details = show_donation_details;
		this.is_opened = is_opened;
		this.language_code = language_code;
		this.custom_style = custom_style
			? custom_style
			: new FundraiserCustomStyle(
					'',
					'',
					'',
					'',
					'',
					'',
					'',
					'',
					false,
					new FundraiserParentInfo()
			  );
		this.custom_donation_configuration = custom_donation_configuration;
		this.source = source;
		this.tip_enabled = tip_enabled;
		this.deleted = deleted;
		this.last_donation_date = last_donation_date;
		this.allow_child = allow_child;
		this.appeal = appeal;
		this.root_fundraiser = root_fundraiser;
		this.image_list = image_list ? image_list : [];
		this.appeal_image_list = appeal_image_list;
	}
}

/** *Category Class--------------------------------------------- */
class Category {
	id: string;
	name: string;
	name_en: string;
	name_nl: string;
	name_be: string;
	name_de: string;
	name_fr: string;
	name_it: string;
	name_es: string;
	image: string;

	constructor(
		id: string = '',
		name: string = '',
		name_en: string = '',
		name_nl: string = '',
		name_be: string = '',
		name_de: string = '',
		name_fr: string = '',
		name_it: string = '',
		name_es: string = '',
		image: string = ''
	) {
		this.id = id;
		this.name = name;
		this.name_en = name_en;
		this.name_nl = name_nl;
		this.name_be = name_be;
		this.name_de = name_de;
		this.name_fr = name_fr;
		this.name_it = name_it;
		this.name_es = name_es;
		this.image = image;
	}
}

/** *Location Local Class--------------------------------------------- */
class Location_local {
	id: string;
	name: string;
	language_code: string;
	location: Location;
	country_name: string;

	constructor(
		id: string = '',
		name: string = '',
		language_code: string = '',
		location: Location,
		country_name: string = ''
	) {
		this.id = id;
		this.name = name;
		this.language_code = language_code;
		this.location = location ? location : new Location('', '', '');
		this.country_name = country_name;
	}
}

/** *Location Class--------------------------------------------- */
class Location {
	id: string;
	place_id: string;
	country_code: string;

	constructor(
		id: string = '',
		place_id: string = '',
		country_code: string = ''
	) {
		this.id = id;
		this.place_id = place_id;
		this.country_code = country_code;
	}
}

/** *Background Class--------------------------------------------- */
class Background {
	id: string;
	image: string;

	constructor(id: string = '', image: string = '') {
		this.id = id;
		this.image = image;
	}
}

/** *Information Class--------------------------------------------- */
class Information {
	id: string;
	title: string;
	text: string;
	video_url: string;
	image: string;

	constructor(
		id: string = '',
		title: string = '',
		text: string = '',
		video_url: string = '',
		image: string = ''
	) {
		this.id = id;
		this.title = title;
		this.text = text;
		this.video_url = video_url;
		this.image = image;
	}
}

/** *Social Media Class--------------------------------------------- */
class SocialMedia {
	id: string;
	facebook: string;
	twitter: string;
	google_plus: string;
	linked_in: string;
	email: string;

	constructor(
		id: string = '',
		facebook: string = '',
		twitter: string = '',
		google_plus: string = '',
		linked_in: string = '',
		email: string = ''
	) {
		this.id = id;
		this.facebook = facebook;
		this.twitter = twitter;
		this.google_plus = google_plus;
		this.linked_in = linked_in;
		this.email = email;
	}
}

/** *Fundraiser Profile Class---------------------------------------------------------------------- */

class FundraiserProfile {
	id: string;
	user: string;
	type: string;
	name: string;
	phone_number: string;
	mobile_number: string;
	is_receiver: boolean;
	image: string;
	deactivated: boolean;
	custom_logo: string;
	primary_color: string;
	secondary_color: string;
	fonts: string;
	button_radius: string;
	button_shadow: string;
	card_radius: string;
	card_shadow: string;
	is_default: boolean;
	connected_fundraisers: boolean;
	connected_fundraisers_message: string;
	thank_you_donor: boolean;
	thank_you_donor_message: string;
	apply_custom_branding: boolean;
	transactional_emails: boolean;
	new_fundraiser_emails: boolean;
	connect_fundraiser_emails: boolean;
	payouts_emails: boolean;
	fundraiser_published: boolean;
	fundraiser_published_message: string;
	fundraiser_closed: boolean;
	fundraiser_closed_message: string;
	donation_received: boolean;
	donation_received_message: string;
	thank_you_register: boolean;
	thank_you_register_message: string;
	message_received: boolean;

	constructor(
		id: string = '',
		user: string = '',
		type: string = '',
		name: string = '',
		phone_number: string = '',
		mobile_number: string = '',
		is_receiver: boolean = false,
		image: string = '',
		deactivated: boolean = false,
		custom_logo: string = '',
		primary_color: string = '',
		secondary_color: string = '',
		fonts: string = '',
		button_radius: string = '',
		button_shadow: string = '',
		card_radius: string = '',
		card_shadow: string = '',
		is_default: boolean = false,
		connected_fundraisers: boolean = false,
		connected_fundraisers_message: string = '',
		thank_you_donor: boolean = false,
		thank_you_donor_message: string = '',
		apply_custom_branding: boolean = false,
		transactional_emails: boolean = false,
		new_fundraiser_emails: boolean = false,
		connect_fundraiser_emails: boolean = false,
		payouts_emails: boolean = false,
		fundraiser_published: boolean = false,
		fundraiser_published_message: string = '',
		fundraiser_closed: boolean = false,
		fundraiser_closed_message: string = '',
		donation_received: boolean = false,
		donation_received_message: string = '',
		thank_you_register: boolean = false,
		thank_you_register_message: string = '',
		message_received: boolean = false
	) {
		this.id = id;
		this.user = user;
		this.type = type;
		this.name = name;
		this.phone_number = phone_number;
		this.mobile_number = mobile_number;
		this.is_receiver = is_receiver;
		this.image = image;
		this.deactivated = deactivated;
		this.custom_logo = custom_logo;
		this.primary_color = primary_color;
		this.secondary_color = secondary_color;
		this.fonts = fonts;
		this.button_radius = button_radius;
		this.button_shadow = button_shadow;
		this.card_radius = card_radius;
		this.card_shadow = card_shadow;
		this.is_default = is_default;
		this.connected_fundraisers = connected_fundraisers;
		this.connected_fundraisers_message = connected_fundraisers_message;
		this.thank_you_donor = thank_you_donor;
		this.thank_you_donor_message = thank_you_donor_message;
		this.apply_custom_branding = apply_custom_branding;
		this.transactional_emails = transactional_emails;
		this.new_fundraiser_emails = new_fundraiser_emails;
		this.connect_fundraiser_emails = connect_fundraiser_emails;
		this.payouts_emails = payouts_emails;
		this.fundraiser_published = fundraiser_published;
		this.fundraiser_published_message = fundraiser_published_message;
		this.fundraiser_closed = fundraiser_closed;
		this.fundraiser_closed_message = fundraiser_closed_message;
		this.donation_received = donation_received;
		this.donation_received_message = donation_received_message;
		this.thank_you_register = thank_you_register;
		this.thank_you_register_message = thank_you_register_message;
		this.message_received = message_received;
	}
}

/** *Fundraiser Donation Class----------------------------------------------------------------- */
class FundraiserDonation {
	amount: string;
	count: string;

	constructor(amount: string = '', count: string = '') {
		this.amount = amount;
		this.count = count;
	}
}

/** *Fundraiser Translations Class -------------------------------------------------------------- */

class FundraiserTranslations {
	title_nl: string;
	appeal_nl: string;
	description_nl: string;
	content_nl: string;
	is_auto_nl: boolean;
	title_de: string;
	appeal_de: string;
	description_de: string;
	content_de: string;
	is_auto_de: boolean;
	title_es: string;
	appeal_es: string;
	description_es: string;
	content_es: string;
	is_auto_es: boolean;
	title_en: string;
	appeal_en: string;
	description_en: string;
	content_en: string;
	is_auto_en: boolean;
	title_fr: string;
	appeal_fr: string;
	description_fr: string;
	content_fr: string;
	is_auto_fr: boolean;

	constructor(
		title_nl: string = '',
		appeal_nl: string = '',
		description_nl: string = '',
		content_nl: string = '',
		is_auto_nl: boolean = false,
		title_de: string = '',
		appeal_de: string = '',
		description_de: string = '',
		content_de: string = '',
		is_auto_de: boolean = false,
		title_es: string = '',
		appeal_es: string = '',
		description_es: string = '',
		content_es: string = '',
		is_auto_es: boolean = false,
		title_en: string = '',
		appeal_en: string = '',
		description_en: string = '',
		content_en: string = '',
		is_auto_en: boolean = false,
		title_fr: string = '',
		appeal_fr: string = '',
		description_fr: string = '',
		content_fr: string = '',
		is_auto_fr: boolean = false
	) {
		this.title_nl = title_nl;
		this.appeal_nl = appeal_nl;
		this.description_nl = description_nl;
		this.content_nl = content_nl;
		this.is_auto_nl = is_auto_nl;
		this.title_de = title_de;
		this.appeal_de = appeal_de;
		this.description_de = description_de;
		this.content_de = content_de;
		this.is_auto_de = is_auto_de;
		this.title_es = title_es;
		this.appeal_es = appeal_es;
		this.description_es = description_es;
		this.content_es = content_es;
		this.is_auto_es = is_auto_es;
		this.title_en = title_en;
		this.appeal_en = appeal_en;
		this.description_en = description_en;
		this.content_en = content_en;
		this.is_auto_en = is_auto_en;
		this.title_fr = title_fr;
		this.appeal_fr = appeal_fr;
		this.description_fr = description_fr;
		this.content_fr = content_fr;
		this.is_auto_fr = is_auto_fr;
	}
}

/** *Fundraiser Custom Style Class ----------------------------------------------------------------------------- */
class FundraiserCustomStyle {
	custom_logo: string;
	primary_color: string;
	secondary_color: string;
	fonts: string;
	button_radius: string;
	button_shadow: string;
	card_radius: string;
	card_shadow: string;
	is_default: boolean;
	parent_info: FundraiserParentInfo;

	constructor(
		custom_logo: string = '',
		primary_color: string = '',
		secondary_color: string = '',
		fonts: string = '',
		button_radius: string = '',
		button_shadow: string = '',
		card_radius: string = '',
		card_shadow: string = '',
		is_default: boolean = false,
		parent_info: FundraiserParentInfo
	) {
		this.custom_logo = custom_logo;
		this.primary_color = primary_color;
		this.secondary_color = secondary_color;
		this.fonts = fonts;
		this.button_radius = button_radius;
		this.button_shadow = button_shadow;
		this.card_radius = card_radius;
		this.card_shadow = card_shadow;
		this.is_default = is_default;
		this.parent_info = parent_info
			? parent_info
			: new FundraiserParentInfo('', '');
	}
}

/** *Fundraiser Parent Info Class ----------------------------------------------------------------------------- */

class FundraiserParentInfo {
	name: string;
	user_id: string;

	constructor(name: string = '', user_id: string = '') {
		this.name = name;
		this.user_id = user_id;
	}
}

/** *Fundraiser Image List Class ---------------------------------------------------------------------------------- */

class FundraiserMediaList {
	id: string;
	title: string;
	text: string;
	video_url: string;
	image: string;

	constructor(
		id: string = '',
		title: string = '',
		text: string = '',
		video_url: string = '',
		image: string = ''
	) {
		this.id = id;
		this.title = title;
		this.text = text;
		this.video_url = video_url;
		this.image = image;
	}
}

/** *Fundraiser Custom Donation Configuration Class */

class FundraiserCustomDonationConfiguration {
	onetime_select: boolean;
	onetime_first: string;
	onetime_second: string;
	onetime_third: string;
	onetime_forth: string;
	onetime_style: boolean;
	monthly_select: boolean;
	monthly_first: string;
	monthly_second: string;
	monthly_third: string;
	monthly_forth: string;
	monthly_style: boolean;
	yearly_select: boolean;
	yearly_first: string;
	yearly_second: string;
	yearly_third: string;
	yearly_forth: string;
	yearly_style: boolean;
	other_amount: boolean;

	constructor(
		onetime_select: boolean = false,
		onetime_first: string = '',
		onetime_second: string = '',
		onetime_third: string = '',
		onetime_forth: string = '',
		onetime_style: boolean = false,
		monthly_select: boolean = false,
		monthly_first: string = '',
		monthly_second: string = '',
		monthly_third: string = '',
		monthly_forth: string = '',
		monthly_style: boolean = false,
		yearly_select: boolean = false,
		yearly_first: string = '',
		yearly_second: string = '',
		yearly_third: string = '',
		yearly_forth: string = '',
		yearly_style: boolean = false,
		other_amount: boolean = false
	) {
		this.onetime_select = onetime_select;
		this.onetime_first = onetime_first;
		this.onetime_second = onetime_second;
		this.onetime_third = onetime_third;
		this.onetime_forth = onetime_forth;
		this.onetime_style = onetime_style;
		this.monthly_select = monthly_select;
		this.monthly_first = monthly_first;
		this.monthly_second = monthly_second;
		this.monthly_third = monthly_third;
		this.monthly_forth = monthly_forth;
		this.monthly_style = monthly_style;
		this.yearly_select = yearly_select;
		this.yearly_first = yearly_first;
		this.yearly_second = yearly_second;
		this.yearly_third = yearly_third;
		this.yearly_forth = yearly_forth;
		this.yearly_style = yearly_style;
		this.other_amount = other_amount;
	}
}
