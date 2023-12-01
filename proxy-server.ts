import * as express from 'express';
import * as path from 'path';

const getTranslatedServer = (lang) => {
	const distFolder = path.join(
		process.cwd(),
		`dist/whydonate-web-portal/server/${lang}`
	);
	const server = require(`${distFolder}/main.ejs`);
	return server.app(lang);
};

function run() {
	const port = process.env.PORT || 4200;

	// Start up the Node server
	const appFr = getTranslatedServer('fr');
	const appEn = getTranslatedServer('en');
	const appNl = getTranslatedServer('nl');
	const appDe = getTranslatedServer('de');
	const appEs = getTranslatedServer('es');

	const server = express();
	server.use('/fr', appFr);
	server.use('/en', appEn);
	server.use('/nl', appNl);
	server.use('/es', appEs);
	server.use('/de', appDe);
	server.use('', appEn);

	server.listen(port, () => {
		console.log(`Node Express server listening on http://localhost:${port}`);
	});
}

run();
