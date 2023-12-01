import { parse, serialize } from 'cookie';

const LANG_LOCALE = [
	'nl-nl',
	'en-en',
	'es-es',
	'de-de',
	'fr-fr',
	'nl-be',
	'fr-be',
	'fr-ch',
	'de-ch',
	'en-dk',
	'en-fi',
	'en-ie',
	'en-no',
	'en-se',
	'en-gb',
];
const WHYDONATE_LOCALE = ['nl', 'en', 'es', 'de', 'fr'];
const LOCALE_COOKIE = 'WD_locale'; //key for cookie.
const DEFAULT_LOCALE = 'nl'; // the attribute of index is nl because index file is moved fromm nl build folder to outter dist folder so nl is the default.
let CUREENT_LOCALE = DEFAULT_LOCALE; // will changed based on language detection.

/**
 * This middleware is responsible for intercepting request with or without locale in URL path
 * and then either set cookie or redirect to a url with the locale based on cookie or accepted-language.
 */

const handleRequest: PagesFunction = async (context) => {
	try {
		let { protocol, host, pathname } = new URL(context.request.url);
		CUREENT_LOCALE = getDetectedLocale(context); // Either used by document rewriter for replacing attribute or for redirecting

		const response = await context.next(); // wait for the next function to finish
		const startsWithValidPattern = new RegExp(
			getLocaleMatcherString().concat('|^/sitemap|^/robots') // adding sitemap and robots to the regex to allow them at the root
		);
		if (pathname.match(startsWithValidPattern)) {
			response.headers.set('Set-Cookie', getCookieSerializer(pathname));
			// return response;
			return rewriter(context).transform(response);
		}

		const redirectUrl = `${protocol}//${host}/${CUREENT_LOCALE}${pathname}`; // NOTE: KNOWN ISSUE: redirectUrl without adding '//' in between protocolo and host will work on local wrangler server but will not work when deployed so be carefull with redirection since the errors difficult to catch.
		return Response.redirect(redirectUrl, 302);
	} catch (err: any) {
		// catch and report and errors when running the next function
		console.log(err.message);
		return await context.next();
	}
};

// Attach `handleRequest` to all HTTP requests
export const onRequest = handleRequest;

class HeadHandler {
	context: EventContext<unknown, any, Record<string, unknown>>;
	constructor(context: EventContext<unknown, any, Record<string, unknown>>) {
		this.context = context;
	}
	element(element: Element) {
		// An incoming Head element
		setAltLinks(element, this.context);
		setCanonicalLinks(element, this.context);
	}
}
const rewriter = (
	context: EventContext<unknown, any, Record<string, unknown>>
) => new HTMLRewriter().on('head', new HeadHandler(context));

/**
 * Function to detect locale from cookie or accepted-language.
 * First, function will check if cookie exists, if does not exist then, get locale from accept-language
 *  */
const getDetectedLocale = (
	context: EventContext<unknown, any, Record<string, unknown>>
) => {
	// let cookie = parse(context.request.headers.get('Cookie') || '');
	// return cookie[LOCALE_COOKIE] != null &&
	// 	isCookieLocaleValid(cookie[LOCALE_COOKIE]) // if valid locale exist in cookie then use that, else use locale from 'Accept-Language' header
	// 	? cookie[LOCALE_COOKIE]
	// 	: getLocale(context?.request?.headers?.get('Accept-Language') || 'nl');

	const acceptLanguage =
		context?.request?.headers?.get('Accept-Language') || 'nl-NL';
	return getLocale(acceptLanguage);
};

// Function to return locale from a string
const getLocale = (localeHeader: string): string => {
	if (localeHeader.includes('nl')) {
		return 'nl';
	}
	if (localeHeader.includes('en')) {
		return 'en';
	}
	if (localeHeader.includes('es')) {
		return 'es';
	}
	if (localeHeader.includes('de')) {
		return 'de';
	}
	if (localeHeader.includes('fr')) {
		return 'fr';
	}
	return 'nl';
};

const getLangLocale = (localeHeader: string): string => {
	if (localeHeader.startsWith('nl')) {
		return 'nl-nl';
	}
	if (localeHeader.startsWith('en')) {
		return 'en-en';
	}
	if (localeHeader.startsWith('es')) {
		return 'es-es';
	}
	if (localeHeader.startsWith('de')) {
		return 'de-de';
	}
	if (localeHeader.startsWith('fr')) {
		return 'fr-fr';
	}
	return 'nl-NL';
};

// checks if valid locale exists
const isCookieLocaleValid = (locale: string) => {
	return !!WHYDONATE_LOCALE.find((l) => l === locale);
};

const getCookieSerializer = (pathname: string) => {
	return serialize(LOCALE_COOKIE, getLocale(pathname.substring(1, 3)), {
		path: '/',
		maxAge: 60 * 60 * 24 * 60, //set max age for 60 days
	});
};

const getLocaleMatcherString = (): string => {
	return WHYDONATE_LOCALE.map((x) => `^/${x}`).join('|');
};

export const setAltLinks = (
	element: Element,
	context: EventContext<unknown, any, Record<string, unknown>>
): any => {
	let { protocol, host, pathname } = new URL(context.request.url);
	let currentLocale = getLocale(pathname.substring(1, 5)); // Updated to extract 'nl-NL' format.
	getAltLinksFromLocale(pathname).map((x) => {
		let [locale, pathnameWithLocale] = x;
		element.append(
			`<link rel="alternate" hreflang="${locale}" href="${protocol}//${host}${pathnameWithLocale}">`,
			{
				html: true,
			}
		);
	});
	const xDefaultHref = `${protocol}//${host}/en${pathname.substring(3)}`;
	// Append the x-default link
	element.append(
		`<link rel="alternate" hreflang="x-default" href="${xDefaultHref}">`,
		{
			html: true,
		}
	);
};

// Function to set Canonical Links
export const setCanonicalLinks = (
	element: Element,
	context: EventContext<unknown, any, Record<string, unknown>>
): any => {
	let { protocol, host, pathname } = new URL(context.request.url);
	let currentLocale = getLocale(pathname.substring(1, 3));
	let xDefaultHref = `${protocol}//${host}${pathname}`;

	element.append(`<link rel="canonical" href="${xDefaultHref}" >`, {
		html: true,
	});
};

// const getAltLinksFromLocale = (pathname: string) => {
// 	//let currentLocale = getLangLocale(pathname.substring(1, 5));
// 	let currentLocale = 'nl'; // Updated to extract 'nl-NL' format.
// 	console.log('SEHBAN current locale', currentLocale);
// 	console.log('SEHBAN path name', pathname);
// 	return LANG_LOCALE.map((x) => {
// 		return [x, pathname.replace(currentLocale, x.substring(0, 2))];
// 	});
// };
const getAltLinksFromLocale = (pathname: string) => {
	const currentLocale = getLocale(pathname.substring(1, 5)); // Updated to extract 'nl-NL' format.
	const currentLanguage = currentLocale.split('-')[0]; // Extract only the language part
	return LANG_LOCALE.map((x) => {
		const [language, country] = x.split('-');
		const locale = `${language}-${country}`;
		const pathnameWithLocale = pathname.replace(currentLanguage, language);
		return [locale, pathnameWithLocale];
	});
};
