import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';
import { getVideoIdFromUrl } from 'cypress/e2e/WhyDonate/custom/helper.js';

describe('Edit Fundraiser', { tags: ['@fundraiserTag'] }, () => {
    const slug = 'tip-enabled-donations'
    const language_code = 'en'

    beforeEach(() => {
        cy.visitAndVerify(environment.homeUrl + '/en');
        cy.wait(2000);

        cy.loginUser()

        cy.intercept('GET', `${environment.fundraiser_url}fundraiser/get?slug=${slug}&language=${language_code}`).as('apiRequest');
        cy.visitAndVerify(`${environment.homeUrl}/${language_code}/fundraising/${slug}/`);
    })

   

    it('Check View More in Connected Fundraisers', () => {
        // Ensure the 'View More' button is not disabled
        // editFundraiserConnectedFundraisersHeading
        cy.notDisabledAndVisible('#editFundraiserConnectedFundraisersHeading')
        cy.get('#view-more-button-connected-fundraiser').should('not.be.disabled');

        // Intercept the GET request for fetching updates on page 2
        cy.intercept('GET', `${environment.fundraiser_url}fundraiser/connected?slug=${slug}&page=1`).as('update');

        // Click the 'View More' button
        cy.get('#view-more-button-connected-fundraiser').first().click();

        // Wait for the GET request interception and make assertions on the response
        cy.wait('@update').then((interception) => {
            // Assert that the response status code is 200
            cy.checkAPIResponseSuccess(interception)

            // Assert that the response body contains updates (length is defined and greater than or equal to 0)
            expect(interception?.response?.body?.data?.result?.length).not.undefined;
            expect(interception?.response?.body?.data?.result?.length).to.gte(0);
        });
    });

    it('Updating Category', () => {
        cy.notDisabledAndVisible('#editFundraiserCategoryButton')
        cy.get('mat-dialog-container').should('be.visible');
        cy.get('#fundraiserCategoryInput').focus().clear().type('India');
        cy.get('.mat-option-text').first().click();
        cy.notDisabledAndVisible('#fundraiserCategorySaveButton')
        cy.wait(2000)
        cy.get('.mat-dialog-container').should('not.exist');

    })

    it('Updating Location', () => {
        cy.notDisabledAndVisible('#editFundraiserLocationButton');
        cy.get('mat-dialog-container').should('be.visible');
        cy.get('#fundraiserLocationInput').focus().clear().type('India');
        cy.get('.mat-option-text').first().click();
        cy.notDisabledAndVisible('#fundraiserLocationSaveButton');
        cy.wait(2000)
        cy.get('.mat-dialog-container').should('not.exist');
    })

    it('Updating Contact Details', () => {
        cy.notDisabledAndVisible('#editFundraiserContactButton');
        cy.get('mat-dialog-container').should('be.visible');
        cy.get('#create_fundraiser_email').focus().clear().type('yash@whydonate.com');
        cy.get('#create_fundraiser_facebook').focus().clear().type(`https://www.facebook.com/${new Date().getTime()}`);
        cy.get('#create_fundraiser_twitter').focus().clear().type(`https://www.twitter.com/${new Date().getTime()}`);
        cy.get('#create_fundraiser_linked_in').focus().clear().type(`https://www.linkedin.com/${new Date().getTime()}`);
        cy.get('#create_fundraiser_instagram').focus().clear().type(`https://www.instagram.com/${new Date().getTime()}`);
        cy.get('#create_fundraiser_website').focus().clear().type(`https://whydonate.in/en/${new Date().getTime()}`);
        cy.wait(2000)
        cy.notDisabledAndVisible('#fundraiserContactSaveButton')
        cy.wait(2000)
        cy.get('.mat-dialog-container').should('not.exist');
    })
})

