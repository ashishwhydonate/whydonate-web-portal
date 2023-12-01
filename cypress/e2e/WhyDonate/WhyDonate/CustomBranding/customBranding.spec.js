import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';

describe('Custom Branding Tests (account)', { tags: ['@accountTag'] }, () => {
    const email = 'yash@whydonate.nl'
    const password = 'Yash@123'

    beforeEach(() => {
        cy.visitAndVerify(environment.homeUrl + "/en");
        cy.loginUser(email, password); // Pass email and password as arguments
    });

    it('It Should have working Branding Page', () => {
        cy.wait(1000);
        // Navigate to the Custom Branding page
        cy.get('#headerCustomBranding').click();
        // Update branding settings
        cy.notDisabledAndVisible('#defaultSetting')
        cy.notDisabledAndVisible('#logo')
        const filePath = 'waves-light-8k-5120x2880.jpg';
        cy.get('input[type="file"]').attachFile(filePath);
        cy.notDisabledAndVisible('.mat-card-content > [fxfill=""] > .mat-focus-indicator')
        cy.notDisabledAndVisible('#mediumFont')
        cy.wait(1000);
        cy.get('#primaryColor').clear().type('#dad3c7');
        cy.notDisabledAndVisible('#primaryColor')
        cy.get('#secondaryColor').clear().type('#36454F');
        cy.notDisabledAndVisible('#selectTypo')
        cy.notDisabledAndVisible('#raleway')
        cy.intercept('PUT', environment.ACCOUNT_API_V2 + 'account/custom_branding/update').as('apiRequest');
        cy.notDisabledAndVisible('#saveChanges')
        cy.wait('@apiRequest').then((interception) => {
            cy.checkAPIResponseSuccess(interception)
        });
    });

    it('It Should have working discard Changes button', () => {
        cy.wait(1000);
        // Navigate to the Custom Branding page
        cy.notDisabledAndVisible('#headerCustomBranding');

        // Update branding settings
        cy.notDisabledAndVisible('#defaultSetting');
        cy.notDisabledAndVisible('#logo');
        const filePath = 'waves-light-8k-5120x2880.jpg';
        cy.get('input[type="file"]').attachFile(filePath);
        cy.notDisabledAndVisible('.mat-card-content > [fxfill=""] > .mat-focus-indicator');
        cy.notDisabledAndVisible('#mediumFont');
        cy.wait(1000);
        cy.get('#primaryColor').clear().type('#dad3c7');
        cy.notDisabledAndVisible('#primaryColor');
        cy.get('#secondaryColor').clear().type('#36454F');
        cy.notDisabledAndVisible('#selectTypo');
        cy.notDisabledAndVisible('#raleway');
        cy.notDisabledAndVisible('#discardChanges');
        cy.get('#saveChanges').should("be.disabled");
    });

    it('It Should have working Email Page', () => {
        cy.wait(1000);
        cy.intercept('PUT', environment.FUNDRAISER_API_V2 + 'fundraiser/email/text').as('apiRequest');

        // Make a POST request to log in and then proceed
        cy.notDisabledAndVisible('#headerCustomiseEmails');

        // Update "Thank You" email settings
        cy.notDisabledAndVisible('#thankYou');
        cy.get('#thankYouInput').clear().type('A wonderful sereni has taker surfac trees,to help you understand  your succession');
        cy.notDisabledAndVisible('#thankSave');
        cy.wait('@apiRequest').then((interception) => {
            cy.checkAPIResponseSuccess(interception)
        });

        // Update "Registration" email settings
        cy.notDisabledAndVisible('#registration');
        cy.get('#registerForConnected').clear().type('A wonderful sereni has taker surfac trees,to help you understand  your succession');
        cy.notDisabledAndVisible('#registerSave');
        cy.wait('@apiRequest').then((interception) => {
            cy.checkAPIResponseSuccess(interception)
        });
        // Update "Donation Received" email settings
        cy.notDisabledAndVisible('#donationReceived');
        cy.get('#donationReceivedConnected').clear().type('A wonderful sereni has taker surfac trees,to help you understand  your succession');
        cy.notDisabledAndVisible('#donationReceivedSave');
        cy.wait('@apiRequest').then((interception) => {
            cy.checkAPIResponseSuccess(interception)
        });
        // Update "Connected Fundraiser Created" email settings
        cy.notDisabledAndVisible('#connectedFundraiserCreated');
        cy.get('#connectedFundraiser').clear().type('A wonderful sereni has taker surfac trees,to help you understand  your succession');
        cy.notDisabledAndVisible('#connectedFundraiserSave');
        cy.wait('@apiRequest').then((interception) => {
            cy.checkAPIResponseSuccess(interception)
        });
        // Update "Connected Fundraiser Published" email settings
        cy.notDisabledAndVisible('#connectedFundraiserPublished');
        cy.get('#connectedFundraiserPublishedInput').clear().type('A wonderful sereni has taker surfac trees,to help you understand  your succession');
        cy.notDisabledAndVisible('#connectedPublishedSave');
        cy.wait('@apiRequest').then((interception) => {
            cy.checkAPIResponseSuccess(interception)
        });
        // Update "Connected Fundraiser Closed" email settings
        cy.notDisabledAndVisible('#connectedFundraiserClosed');
        cy.get('#connectedFundraiserClosedInput').clear().type('A wonderful sereni has taker surfac trees,to help you understand  your succession');
        cy.notDisabledAndVisible('#saveFundraiserClosed');
        cy.wait('@apiRequest').then((interception) => {
            cy.checkAPIResponseSuccess(interception)
        });
        // Send a test email
        cy.notDisabledAndVisible('#sendTestMail');
    });

})
