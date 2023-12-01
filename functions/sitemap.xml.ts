import * as builder from 'xmlbuilder';

// generate path for sitemap based on locale. for e.g.: "/sitemap-en.xml/1" , "/sitemap-nl.xml/10"
export const sitemapPaths = ['static'];
export const staticPaths = [
	'/',
	'/search',
	'/account/login',
	'/account/registration',
	'/account/forgot-password',
];
export const slugPaths = ['fundraising/slug', 'donate/slug'];
export const API_BASE_URL_PROD = 'https://fundraiser.whydonate.workers.dev/';
export const API_BASE_URL_DEV =
	'https://fundraiser-staging.whydonate.workers.dev/';
export const SITEMAP_PAGE_SIZE = 1200;

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

	const getPageCount = fetch(
		`${API_BASE_URL_PROD}sitemap/?page_size=${SITEMAP_PAGE_SIZE}&page=0`
	).then((response: Response) => response.json());

	const response = getPageCount.then(
		(res: any) => {
			var host = request.headers.get('host');

			var xml = builder
				.create('sitemapindex', {
					version: '1.0',
					encoding: 'UTF-8',
				})
				.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
				//.att('xmlns:xhtml', 'https://www.w3.org/1999/xhtml');

			xml.ele('sitemap').ele('loc', `https://${host}/sitemap-static.xml`);

			for (let i = 0; i < res?.data?.number_of_pages; i++) {
				xml.ele('sitemap').ele('loc', `https://${host}/sitemap-${i}.xml`);
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
