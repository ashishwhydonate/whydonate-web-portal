// Import the environment configuration
import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';

// Describe block for the 'Delete Fundraiser' test suite
describe('Delete Fundraiser', { tags: ['@fundraiserTag'] }, () => {
    // Define common variables
    const language_code = 'en'; // Language code for testing
    const slug = `empowering-conservation-projects-1695885467356`
    const newSlug = `cypress_generated_fundraiser_to_delete_${new Date().getTime()}`

    // Before each test case, set up the environment
    beforeEach(() => {
        // Visit the specified URL
        cy.visitAndVerify(environment.homeUrl + `/${language_code}`);

        // Wait for a brief period
        cy.wait(2000);

        // Click on the login button
        cy.loginUser();
    });

    // Test case: Connected fundraiser with collected donations cannot be deleted
    it('The connected fundraiser cannot be deleted if it has collected donations', () => {
        // Intercept the API request for the connected fundraiser
        cy.intercept('DELETE', `${environment.fundraiser_url}fundraiser?slug=outreach-conservation-projects-1695733277505`).as('deleteApiRequest');

        // Visit the connected fundraiser's page
        cy.visitAndVerify(`${environment.homeUrl}/${language_code}/fundraising/${'outreach-conservation-projects-1695733277505'}/`);

        // Verify the URL includes '/fundraising'
        cy.url().should('include', '/fundraising');

        // Click on the 'Delete Fundraiser' button
        cy.notDisabledAndVisible('#delete_fundraiser_button');

        // Click on the 'mat-dialog-container' to be visible
        cy.get('mat-dialog-container').should('be.visible');

        // Confirm the deletion
        cy.notDisabledAndVisible('#button_deleteFundraiser_confirm');

        cy.wait('@deleteApiRequest').then(res => {
            cy.checkAPIResponseSuccess(res)
        })
        // Verify the presence of the success message
        cy.get('.mat-simple-snack-bar-content').should('be.visible');

        // Verify that the URL still includes '/fundraising'
        cy.url().should('include', '/fundraising');

        cy.get('.mat-dialog-container').should('not.exist');

    });

    // Test case: Prevent users from deleting a parent fundraiser with connected fundraisers or donations
    it('Don’t let users delete a parent fundraiser if connected fundraisers or/and donations are available', () => {
        // Intercept the API request for the parent fundraiser
        cy.intercept('DELETE', `${environment.fundraiser_url}fundraiser?slug=${slug}`).as('deleteApiRequest');

        // Visit the parent fundraiser's page
        cy.visitAndVerify(`${environment.homeUrl}/${language_code}/fundraising/${slug}/`);

        // Verify the URL includes '/fundraising'
        cy.url().should('include', '/fundraising');

        // Click on the 'Delete Fundraiser' button
        cy.notDisabledAndVisible('#delete_fundraiser_button');

        cy.get('mat-dialog-container').should('be.visible');

        // Confirm the deletion
        cy.notDisabledAndVisible('#button_deleteFundraiser_confirm');

        cy.wait('@deleteApiRequest').then(res => {
            cy.checkAPIResponseSuccess(res)
        })
        // Verify the presence of the success message
        cy.get('.mat-simple-snack-bar-content').should('be.visible');

        // Verify that the URL still includes '/fundraising'
        cy.url().should('include', '/fundraising');

        cy.get('.mat-dialog-container').should('not.exist');
    });

    // Test case for deleting a fundraiser
    it('Delete parent Fundraiser without any condition', () => {

        cy.createFundraiserWithVideo(newSlug)
        cy.wait(5000)
        cy.intercept('DELETE', `${environment.fundraiser_url}fundraiser?slug=${newSlug}`).as('deleteApiRequest');

        // Verify that the URL includes '/fundraising'
        cy.url().should('include', '/fundraising');

        // Click on the 'Delete Fundraiser' button
        cy.notDisabledAndVisible('#delete_fundraiser_button');

        // Click on the 'mat-dialog-container' to be visible
        cy.get('mat-dialog-container').should('be.visible');

        // Click on the confirmation button for deleting the fundraiser
        cy.notDisabledAndVisible('#button_deleteFundraiser_confirm');

        cy.wait('@deleteApiRequest').then(res => {
            cy.checkAPIResponseSuccess(res)
        })
        // Verify that the URL includes '/dashboard' after deleting
        cy.url().should('include', '/dashboard');
        cy.get('.mat-dialog-container').should('not.exist');
    });

    it('Create then Delete a connected fundraiser', () => {
        // Visit the connected fundraiser creation page
        cy.visitAndVerify(`${environment.homeUrl}/${language_code}/fundraising/connect/${'about-fundraiser-about-fundraiser-about-fundraiser'}/`);
        cy.url().should('include', '/fundraising/connect');
        cy.wait(2000);

        // Fill in connected fundraiser details
        const newFundraiser = new Date().getTime();
        cy.get('#ConnectedFundraiserTitle').should('be.visible').type(`cypress generated test ${newFundraiser}`);
        cy.get('#ConnectedFundraiserDescription').should('be.visible').type('Sign up on Whydonate and create your fundraiser in minutes. Sign up as a person or an organization, Share your fundraiser via Email, WhatsApp and other social media channels to reach as many donors as possible, The donations are paid out automatically to your bank account on a monthly basis without any platform cost        ');
        const filePath = 'waves-light-8k-5120x2880.jpg';
        cy.get('input[type="file"]').attachFile(filePath);
        cy.notDisabledAndVisible('#ConnectedFundraiserYouTubeButton');
        cy.get('#ConnectedFundraiserYouTubeLink').should('be.visible').type('https://www.youtube.com/watch?v=69SFwgWHUig');
        cy.notDisabledAndVisible('#ConnectedFundraiserYouTubeSaveButton');
        cy.notDisabledAndVisible('#SaveButtonConnectFundraiserForm')
        cy.url().should('include', newFundraiser);
        cy.notDisabledAndVisible('#delete_fundraiser_button')
        cy.get('mat-dialog-container').should('be.visible');
        cy.intercept('DELETE', `${environment.fundraiser_url}fundraiser?slug=${newSlug}`).as('deleteApiRequest');

        // Click on the confirmation button for deleting the fundraiser
        cy.notDisabledAndVisible('#button_deleteFundraiser_confirm')
        cy.wait('@deleteApiRequest').then(res => {
            cy.checkAPIResponseSuccess(res)
        })
        // Verify that the URL includes '/dashboard' after deleting
        cy.url().should('include', '/dashboard');
        cy.get('.mat-dialog-container').should('not.exist');
    })
});
