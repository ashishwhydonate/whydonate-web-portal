import '@cypress/code-coverage/support';

// Import commands.js using ES2015 syntax:
import './commands';

// Exception Handling For Failed Tests
Cypress.on('fail', (e, runnable) => {
	console.log('---------------------------------------');
	console.log('Error: ', e);
	console.log('Runnable: ', runnable);
	console.log('Name: ', e.name);
	console.log('Stack: ', e.stack);
	console.log('Message: ', e.message);
	console.log('---------------------------------------');

	if (
		e.name === 'AssertionError' &&
		!e.message.includes(
			"Timed out retrying after 4000ms: Expected to find element: '.error-message', but never found it."
		)
	) {
		throw e;
	}
});

// Uncaught Exception
Cypress.on('uncaught:exception', (e, runnable) => {
	console.log('---------------------------------------');
	console.log('error', e);
	console.log('runnable', runnable);
	console.log('error', e.message);
	console.log('---------------------------------------');
	return false;
});
