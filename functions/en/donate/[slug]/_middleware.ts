class MetaService {
	private META_KEYWORD = `Donate`;
	private META_DESCRIPTION = `Thank you for making a donation to`;
	private fundraiserApiRes: any;
	private title;
	private description;
	private url;
	private imageUrl;

	constructor(fundraiserApiRes: any, context: any) {
		let { protocol, host, pathname } = new URL(context.request.url);

		this.fundraiserApiRes = fundraiserApiRes;
		// Dynamic data used in MetaTags
		this.title = this.filterMetaTitle();
		this.description = this.filterMetaDescription();
		this.url = this.filterMetaUrl(host);
		this.imageUrl = this.filterMetaImage();
	}
	get getRobotsTagValue() {
		return this.isFundraiserIndexable() ? 'all' : 'noindex, nofollow';
	}
	get getTitle() {
		return this.title;
	}
	get getDescription() {
		return this.description;
	}
	get getUrl() {
		return this.url;
	}
	get getImageUrl() {
		return this.imageUrl;
	}

	// MAIN FUNCTION: calls set functions for Robot, Description and Social metaTag
	setMetaTag(ele: Element) {
		this.setRobotMeta(ele);
		this.setDescriptionMeta(ele);
		this.setSocialMeta(ele, this.filterOGMetaData());
		this.setSocialMeta(ele, this.filterTwitterMetaData());
	}

	// functions insert MetaTag in head with their respective values
	private setRobotMeta(ele: Element) {
		ele.prepend(`<meta name="robots" content="${this.getRobotsTagValue}">`, {
			html: true,
		});
	}
	private setDescriptionMeta(ele: Element) {
		ele.append(`<meta name="description" content="${this.getDescription}">`, {
			html: true,
		});
	}
	// This function updates Social Meta
	private setSocialMeta(ele: Element, meta_arr: any): void {
		try {
			for (const key in meta_arr) {
				if (Object.prototype.hasOwnProperty.call(meta_arr, key)) {
					ele.append(`<meta property="${key}" content="${meta_arr[key]}">`, {
						html: true,
					});
				}
			}
		} catch (error) {
			console.error(
				'Error in updateOgMeta function in meta-tag service : ',
				error
			);
		}
	}

	// Filter functions to extract data from fundraiser response
	private filterMetaTitle() {
		let currentFundraiser = this.fundraiserApiRes?.data?.result;
		let fundraising_title = currentFundraiser?.title || '';
		let fundraising_profile_name = currentFundraiser?.profile?.name || '';
		return (
			`${this.META_KEYWORD} ${fundraising_profile_name}` +
			` | ` +
			`${fundraising_title}`
		).substring(0, 70);
	}
	private filterMetaDescription() {
		let meta_description: string;
		let currentFundraiser = this.fundraiserApiRes?.data?.result;
		if (currentFundraiser?.appeal) {
			// Sanitize and escape html for appeal_string
			let appeal_string = currentFundraiser?.appeal || '';
			appeal_string = this.escapeHtml(appeal_string).substring(0, 140).trim();
			meta_description = `${appeal_string} | ${this.META_DESCRIPTION}`;
			return meta_description;
		}
		if (currentFundraiser?.content) {
			let content_string = currentFundraiser?.content || '';
			content_string = this.escapeHtml(content_string).substring(0, 140).trim();
			meta_description = `${content_string} | ${this.META_DESCRIPTION}`;
			return meta_description;
		}
		return this.META_DESCRIPTION;
	}

	// filter function to get data for Social MetaTags
	private filterOGMetaData() {
		return {
			'og:title': this.getTitle,
			'og:description': this.getDescription,
			'og:url': this.getUrl,
			'og:type': 'website',
			'og:image': this.getImageUrl,
		};
	}
	// filter function to get data for Social MetaTags
	private filterTwitterMetaData() {
		return {
			'twitter:title': this.getTitle,
			'twitter:description': this.getDescription,
			'twitter:url': this.getUrl,
			'twitter:image': this.getImageUrl,
			'twitter:card': 'summary_large_image',
		};
	}

	// Url to fundraiser page
	private filterMetaUrl(host: string) {
		let currentFundraiser = this.fundraiserApiRes?.data?.result;
		return `https://${host}/en/fundraising/${currentFundraiser?.slug}`;
	}
	// return background image url from currentFundraiser or return default background
	private filterMetaImage() {
		let currentFundraiser = this.fundraiserApiRes?.data?.result;
		let staticMetaImage =
			'https://res.cloudinary.com/whydonate/image/upload/dpr_auto,f_auto,q_auto/facebook_1.jpg';
		return currentFundraiser?.background?.image || staticMetaImage;
	}

	// Helpers
	private isFundraiserIndexable() {
		//Helper for getRobotsTagValue
		if (this.fundraiserApiRes?.data?.result?.is_draft === true) return false;
		if (this.fundraiserApiRes?.data?.result?.is_findable === false)
			return false;
		if (this.fundraiserApiRes?.data?.result?.deleted === true) return false;
		if (this.fundraiserApiRes?.data?.result?.live === false) return false;
		return true;
	}
	private escapeHtml(string_with_html: any) {
		// .(remove any tags).(remove double space)
		return string_with_html.replace(/<[^>]*>/g, ' ').replace(/\s\s+/g, ' ');
	}
}

// HeadHandler class is used by HTMLRewriter inside fundraisingRequestHandler.
// HeadHandler.element() will be called on 'head' element found and it will add meta tag inside the head element.
class HeadHandler {
	context: any;
	fundraiserApiRes: any;
	constructor(fundraiserApiRes: any, context: any) {
		this.fundraiserApiRes = fundraiserApiRes;
		this.context = context;
	}
	element(element: Element) {
		// An incoming Head element
		let metaService = new MetaService(this.fundraiserApiRes, this.context);
		metaService.setMetaTag(element);
	}
}
class TitleHandler {
	context: any;
	fundraiserApiRes: any;
	constructor(fundraiserApiRes: any, context: any) {
		this.fundraiserApiRes = fundraiserApiRes;
		this.context = context;
	}
	element(element: Element) {
		// An incoming Title element
		let metaService = new MetaService(this.fundraiserApiRes, this.context);
		element.setInnerContent(metaService.getTitle);
	}
}

// Main function to handle request for /fundraising/[slug]
const fundraisingRequestHandler: PagesFunction = async (context) => {
	try {
		// Dynamic slug from contex
		let slug = context.params.slug;
		let API_ENDPOINT = 'https://fundraiser.whydonate.workers.dev/';
		let { protocol, host, pathname } = new URL(context.request.url);
		if (host != 'whydonate.com') {
			API_ENDPOINT = 'https://fundraiser-staging.whydonate.workers.dev/';
		}

		// Api to get fundraiser details
		const getFundraiserAPI = fetch(
			`${API_ENDPOINT}fundraiser/get?slug=${slug}&language=en`
		).then((response: Response) => response.json());

		// wait for the next function to finish
		const response = await context.next();

		let [fundraiserApiRes, fundraisingResponse] = await Promise.all([
			getFundraiserAPI,
			response,
		]);

		let metaService = new MetaService(fundraiserApiRes, context);
		fundraisingResponse.headers.set(
			'X-Robots-Tag',
			`${metaService.getRobotsTagValue}`
		);
		return rewriter(fundraiserApiRes, context).transform(fundraisingResponse);
	} catch (err: any) {
		// catch and report and errors when running the next function
		console.log(err.message);
		return await context.next();
	}
};
const rewriter = (
	fundraiserApiRes: any,
	context: EventContext<unknown, any, Record<string, unknown>>
) =>
	new HTMLRewriter()
		.on('head', new HeadHandler(fundraiserApiRes, context))
		.on('title', new TitleHandler(fundraiserApiRes, context));

// Attach `fundraisingRequestHandler` to all HTTP requests
export const onRequest = fundraisingRequestHandler;
