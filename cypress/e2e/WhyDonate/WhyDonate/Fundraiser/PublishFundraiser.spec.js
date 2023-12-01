import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';

describe('Publish Fundraiser Tests', () => {
    beforeEach(() => {
        cy.visitAndVerify(environment.homeUrl + "/en");
        cy.wait(2000);
    });

    it('Check if the user is not verified and cannot publish a fundraiser', () => {
        const slug = `new cypress ${new Date().getTime()}`;
        cy.loginUser(); // Pass email and password as arguments
        cy.createFundraiserWithVideo(slug);
    });
 
});