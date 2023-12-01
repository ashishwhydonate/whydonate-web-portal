const MailosaurClient = require('mailosaur');
import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';

describe('Reset Password Test', () => {
    // Define constants and setup
    const apiKey = Cypress.env('MAILOSAUR_API_KEY');
    const code = `cypress_${new Date().getTime()}`
    const serverId = Cypress.env('MAILOSAUR_SERVER_ID');
    const testEmail = `cypress_1692018682853@memod5h5.mailosaur.net`
    const mailosaur = new MailosaurClient(apiKey);
    var jwt, url, verification_token
    function getTokenFromVerificationLink(link) {
        const regex = /t=([^&]+)/;
        const match = link.match(regex);
        if (match) {
            const token = match[1];
            return token;
        }
        return null;
    }
    const password = new Date().getTime()

    it('Send mail to user Id', () => {
        cy.visitAndVerify(`${environment.homeUrl}/en`);
        cy.wait(2000);
        cy.intercept('POST', environment.ACCOUNT_API_V2 + 'account/user/forget_password/').as('apiRequest');

        cy.notDisabledAndVisible('#loginButton');
        cy.notDisabledAndVisible('#forgotPassword');
        cy.get('#forgotPasswordInput').type(testEmail);
        cy.notDisabledAndVisible('#forgotPasswordResend');
        cy.wait('@apiRequest').then((interception) => {
            // Assert the response status code
            cy.checkAPIResponseSuccess(interception)
            // Assert the response body
            expect(interception.response.body).to.deep.equal({
                "data": {
                    "token_created": true
                },
                "errors": {},
                "status": 200
            });
        });
        cy.wait(6000)
    });
    it('Verify email using Mailosaur', () => {
        cy.wait(6000);
        mailosaur.messages.get(serverId, {
            sentTo: testEmail,
        }).then((messages) => {
            const link = messages.html.links[1].href;
            const token = getTokenFromVerificationLink(link);
            url = `${environment.homeUrl}/en/account/reset_password/?t=${token}&u=${testEmail}`
            console.log(url)
        });
        cy.wait(3000)
    });
    it('Reset Password with form validation', () => {
        cy.visitAndVerify(url)
        cy.intercept('POST', environment.ACCOUNT_API_V2 + 'account/user/forget_password/').as('apiRequest');

        cy.get('#password').type(`notvalid`);
        cy.get('#confirmPassword').type('notvalid');
        cy.get('#resetPasswordSaveButton').should("be.disabled")
        cy.get('mat-error#mat-error-0')
            .should('be.visible');
        cy.get('#password').clear().type(`Demo@${password}`);
        cy.get('#confirmPassword').clear().type(`Demo@${password}232`);
        cy.get('#resetPasswordSaveButton').should("be.disabled")
        cy.get('#password').clear().type(`Demo@${password}`);
        cy.get('#confirmPassword').clear().type(`Demo@${password}`);

        cy.notDisabledAndVisible('#resetPasswordSaveButton');
        cy.wait(2000);
        cy.wait('@apiRequest').then((interception) => {
            // Assert the response status code
            cy.checkAPIResponseSuccess(interception);
            expect(interception.response.body).to.deep.equal({
                "data": {
                    "password_updated": true
                },
                "errors": {},
                "status": 200
            });
        });
    });

    it('Try login with redirect to dashboard check ', () => {
        cy.wait(2000);
        cy.visitAndVerify(`${environment.homeUrl}/en`);
        cy.loginUser(testEmail, `Demo@${password}`); // Pass email and password as arguments
        cy.url().should('include', '/dashboard');
    });

});

