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
	// context.request.headers.set('Content-Type', 'text/plain');

	const robots = `User-agent: * \nDisallow: /en-base/* \nDisallow:/cdn-cgi/challenge-platform/* \nDisallow: /dashboard/* \nDisallow: /profile/* \nDisallow: /create/* \nDisallow: /update/* \nDisallow: /wp-admin/ \nAllow: /wp-admin/admin-ajax.php \nSitemap: https://whydonate.com/sitemap.xml`;
	return new Response(robots);
}
