const DEFAULT_LOCALE = 'nl';
const CUREENT_LOCALE = 'de';

class DocumentHandler {
	private attributeName;
	constructor(attributeName: string) {
		this.attributeName = attributeName;
	}
	element(element: Element) {
		const attribute = element.getAttribute(this.attributeName);
		if (attribute) {
			element.setAttribute(
				this.attributeName,
				attribute.replace(DEFAULT_LOCALE, CUREENT_LOCALE)
			);
		}
	}
}

const handleRequest: PagesFunction = async (context) => {
	try {
		// wait for the next function to finish
		const response = await context.next();
		return rewriter.transform(response);
	} catch (err: any) {
		// catch and report and errors when running the next function
		console.log(err.message);
		return await context.next();
	}
};

// HTMLRewriter used in handleRequest function to serve different locale by replacing the default locale with the detected locale
const rewriter = new HTMLRewriter()
	.on('html', new DocumentHandler('lang'))
	.on('base', new DocumentHandler('href'));

// Attach `handleRequest` to all HTTP requests
export const onRequest = handleRequest;
