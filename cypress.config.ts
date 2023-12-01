import { defineConfig } from 'cypress';

export default defineConfig({
	videosFolder: 'cypress/videos',
	screenshotsFolder: 'cypress/screenshots',
	fixturesFolder: 'cypress/fixtures',
	video: false,

	e2e: {
		setupNodeEvents(on, config) {
			require('@cypress/code-coverage/task')(on, config);
		},

		chromeWebSecurity: false,

		// The base URL of the application under test.
		baseUrl: 'https://whydonate.in',

		// The ID of the Cypress dashboard project to report test results to.
		projectId: 'ca1hh3',

		// Pattern for matching test specification files.
		specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',

		// Environment variables for the test execution.
		env: {
			grepFilterSpecs: true,
			grepOmitFiltered: true,
			MAILOSAUR_API_KEY: 'BgVrTgrbPVwLP6qC09vsHAlsBQP3XBsu',
			MAILOSAUR_SERVER_ID: 'memod5h5',
			DB: {
				username: '4va89atg60xg6jt5lime',
				host: 'aws.connect.psdb.cloud',
				database: 'whydonate-staging',
				password: 'pscale_pw_WBJ03iAEpgWofJ5nTLB0cGfibPvyTTDfQLok6znbjzx',
			},
		},

		defaultCommandTimeout: 10000,
	},
});
