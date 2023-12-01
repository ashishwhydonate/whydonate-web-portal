class MetaService {
	private context: any;
	private title = `Geld inzamelen Goed Doel & Crowdfunding Goed Doel`;
	private description = `Geld inzamelen & Crowdfunding voor Goed Doel. De beste Crowdfunding & Fondsenwerving Site voor Goede Doelen & Particulieren!`;
	private url = `https://whydonate.com/nl/organisation`;
	private imageUrl = `https://res.cloudinary.com/whydonate/image/upload/dpr_auto,f_auto,q_auto/facebook_1.jpg`;

	constructor(context: any) {
		this.context = context;
		let { protocol, host, pathname } = new URL(context.request.url);
		this.url = 'https://' + host + '/nl/organisation';
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
		this.setDescriptionMeta(ele);
		this.setSocialMeta(ele, this.filterOGMetaData());
		this.setSocialMeta(ele, this.filterTwitterMetaData());
	}

	// functions insert MetaTag in head with their respective values
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
}

// HeadHandler class is used by HTMLRewriter inside fundraisingRequestHandler.
// HeadHandler.element() will be called on 'head' element found and it will add meta tag inside the head element.
class HeadHandler {
	context: any;
	fundraiserApiRes: any;
	constructor(context: any) {
		this.context = context;
	}
	element(element: Element) {
		// An incoming Head element
		let metaService = new MetaService(this.context);
		metaService.setMetaTag(element);
	}
}
class TitleHandler {
	context: any;
	fundraiserApiRes: any;
	constructor(context: any) {
		this.context = context;
	}
	element(element: Element) {
		// An incoming Title element
		let metaService = new MetaService(this.context);
		element.setInnerContent(metaService.getTitle);
	}
}

async function handleRequest(
	context: EventContext<unknown, any, Record<string, unknown>>
) {
	const res = await context.next();
	return rewriter(context).transform(res);
}

const rewriter = (
	context: EventContext<unknown, any, Record<string, unknown>>
) =>
	new HTMLRewriter()
		.on('head', new HeadHandler(context))
		.on('title', new TitleHandler(context));

export const onRequest = handleRequest;
