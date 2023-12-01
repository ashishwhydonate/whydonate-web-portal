import * as builder from 'xmlbuilder';
import { API_BASE_URL_PROD, SITEMAP_PAGE_SIZE } from '../sitemap.xml';

export async function onRequest(
	context: EventContext<unknown, any, Record<string, unknown>>
) {
	// Contents of context object
	const {
		request, // same as existing Worker API
		env, // same as existing Worker API
		params, // if filename includes [id] or [[path]]
		waitUntil, // same as ctx.waitUntil in existing Worker API
		next, // used for middleware or to fetch assets
		data, // arbitrary space for passing data between middlewares
	} = context;

	var page = Number(params.page) + 1;
	const getPageCount = fetch(
		`${API_BASE_URL_PROD}sitemap/?page_size=${SITEMAP_PAGE_SIZE}&page=${page}`
	).then((response: Response) => response.json());

	const response = getPageCount.then(
		(res: any) => {
			// console.log(params.page);
			// console.log(res?.data?.fundraising_locals);
			var host = request.headers.get('host');
			var xml = builder
				.create('urlset', {
					version: '1.0',
					encoding: 'UTF-8',
				})
				.att('xmlns', 'https://www.sitemaps.org/schemas/sitemap/0.9')
				//.att('xmlns:xhtml', 'https://www.w3.org/1999/xhtml');

			const languages = [
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

			for (let path of res?.data?.fundraising_locals) {
				languages.forEach((lang) => {
					const langLocale = getLangLocale(lang);
					const href = `https://${host}/${langLocale}/fundraising/${path.slug}`;
					xml
						.ele('url')
						.ele('loc', href)
						.up()
						.ele('link', {
							rel: 'alternate',
							hreflang: lang,
							href: href,
						})
						.up();
				});
			}
			var sitemapResponse = new Response(xml.end({ pretty: true }));
			sitemapResponse.headers.set('Content-Type', 'application/xml');
			return sitemapResponse;
		},
		(err) => {
			return new Response(`status: 500\nError: ${err.message}`, {
				status: 500,
			});
		}
	);

	waitUntil(getPageCount);
	return await response;
}
const getLangLocale = (localeHeader: string): string => {
	if (localeHeader.startsWith('nl')) {
		return 'nl';
	}
	if (localeHeader.startsWith('en')) {
		return 'en';
	}
	if (localeHeader.startsWith('es')) {
		return 'es';
	}
	if (localeHeader.startsWith('de')) {
		return 'de';
	}
	if (localeHeader.startsWith('fr')) {
		return 'fr';
	}
	return 'nl';
};
