async function errorHandler(
	context: EventContext<unknown, any, Record<string, unknown>>
) {
	try {
		// wait for the next function to finish

		// if sitemap path pattern doesnot match, then throw error
		var sitemapPattern = new RegExp(/sitemap-(static|[0-9]*)\.xml/);
		var sitemapPath = context.request.url;
		if (!sitemapPattern.test(sitemapPath))
			throw new Error('Incorrect sitemap path');

		return await context.next();
	} catch (err: any) {
		// catch and report and errors when running the next function
		return new Response(`status: 500\nError: ${err.message}`, { status: 500 });
	}
}

// Attach `errorHandler` to all HTTP requests
export const onRequest = errorHandler;
