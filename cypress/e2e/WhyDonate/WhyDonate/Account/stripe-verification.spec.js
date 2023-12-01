const MailosaurClient = require('mailosaur');
import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';

describe('Stripe Connect Verification Test', () => {
    const apiKey = Cypress.env('MAILOSAUR_API_KEY');
    const serverId = Cypress.env('MAILOSAUR_SERVER_ID');
    const testEmail = `cypress_${new Date().getTime()}@memod5h5.mailosaur.net`;
    const mailosaur = new MailosaurClient(apiKey);
    var verification_token
    function getTokenFromVerificationLink(link) {
        const regex = /token=([^&]+)/;
        const match = link.match(regex);
        if (match) {
            const token = match[1];
            return token;
        }
        return null;
    }
    function findSelectorAndPerformAction(selector, action, value) {
        cy.document().then((doc) => {
            try {
                const element = doc.querySelector(selector);
                if (element) {
                    if (action === 'type') {
                        cy.wrap(element).type(value);
                    } else if (action === 'select') {
                        cy.wrap(element).select(value);
                    } else if (action === 'click') {
                        cy.wrap(element).click();
                    } else {
                        cy.log('Invalid action:', action);
                    }
                } else {
                    cy.log('Element not found:', selector);
                }
            } catch (error) {
                cy.log('An error occurred:', error);
            }
        });
        cy.wait(1500)
    }

    it('Create a user', () => {
        cy.visitAndVerify('https://connect.stripe.com')
        const formData = new FormData();
        formData.append('email', testEmail);
        formData.append('type', 'personal');
        formData.append('first_name', 'cypress');
        formData.append('last_name', 'user');
        formData.append('name', 'Yash jain');
        formData.append('password', 'Demo@123');
        formData.append('language_code', 'en');
        formData.append('phone_number', '1234567890');

        cy.request({
            method: 'POST',
            url: `${environment.ACCOUNT_API_V2}account/user`,
            body: formData,
        }).then(response => {
            expect(response.status).to.be.equal(201)

            cy.wait(3000)
        });
    });
    it('Verify email using Mailosaur', () => {
        cy.wait(6000)
        mailosaur.messages.get(serverId, {
            sentTo: testEmail,
        }).then((messages) => {
            const link = messages.html.links[1].href;
            const token = getTokenFromVerificationLink(link);
            verification_token = token
        });
        cy.wait(6000)
    });


    it('Verifies successful Stripe Connect authorization', () => {
        cy.wait(6000)
        console.log('Response:', verification_token);
        if (!verification_token) {
            mailosaur.messages.get(serverId, {
                sentTo: testEmail,
            }).then((messages) => {
                const link = messages.html.links[1].href;
                const token = getTokenFromVerificationLink(link);
                verification_token = token
            });
        }
        cy.then(() => {
            return cy.request({
                method: 'POST',
                url: `${environment.ACCOUNT_API_V2}account/verify_email`,
                body: { email: testEmail, token: verification_token },
            });
        }).then((response) => {
            expect(response?.body?.errors).to.be.empty;
            cy.request('POST', environment.ACCOUNT_API_V2 + 'account/user/login', { email: testEmail, password: 'Demo@123' })
                .then(resp => {
                    cy.request({
                        method: 'GET',
                        url: `${environment.ACCOUNT_API_V2}account/stripe/onboarding`,
                        headers: {
                            'Content-Type': 'text/html',
                            'Authorization': 'JWT ' + resp.body.data.jwt,
                        },
                    }).then((response) => {
                        cy.wait(2000)
                        expect(response.body.data.url).not.to.be.undefined;
                        cy.visitAndVerify(response.body.data.url);
                        cy.url().should('include', 'connect.stripe.com');
                        findSelectorAndPerformAction('#Select1', 'type', 'IN');
                        findSelectorAndPerformAction('#phone_number', 'type', '000000000');
                        cy.get('button[type="submit"]').click();
                        cy.get('button[data-test="test-mode-fill-button"]').click();
                        cy.wait(5000)
                        findSelectorAndPerformAction('button[data-db-analytics-name="expressUnified_action_companyAndBusinessTypeSubmit_button"]', 'type', '000000000');
                        cy.wait(15000)
                        findSelectorAndPerformAction('#first_name', 'type', 'Yash');
                        findSelectorAndPerformAction('#last_name', 'type', 'Jain');
                        findSelectorAndPerformAction('#dob', 'type', '10102001');
                        findSelectorAndPerformAction('input[name="address"]', 'type', '221 Baker street');
                        findSelectorAndPerformAction('input[name="address-line2"]', 'type', 'London');
                        findSelectorAndPerformAction('input[name="zip"]', 'type', '1066VH');
                        findSelectorAndPerformAction('input[name="locality"]', 'type', '1066VH');
                        findSelectorAndPerformAction('input[name="phone"]', 'type', '0000000000');
                        findSelectorAndPerformAction('input[name="id_number"]', 'type', '1234567891234');
                        findSelectorAndPerformAction('button[data-test="bizrep-submit-button"]', 'click');
                        cy.wait(5000)
                        findSelectorAndPerformAction('#business_profile\\[url\\]', 'type', 'www.whydonate.com');
                        findSelectorAndPerformAction('button[data-test="company-submit-button"]', 'click');
                        cy.wait(5000)
                        findSelectorAndPerformAction('#account_numbers\\[account_number\\]', 'type', 'NL39RABO0300065264');
                        findSelectorAndPerformAction('#account_numbers\\[account_number_validate\\]', 'type', 'NL39RABO0300065264');
                        findSelectorAndPerformAction('button[data-db-analytics-name="expressUnified_action_externalAccountSubmit_button"]', 'click');
                        cy.wait(15000)
                        findSelectorAndPerformAction('button[data-test="requirements-index-done-button"]', 'click');
                        cy.url().should('include', 'https://whydonate.com/en/');
                    });
                });
            cy.wait(3000)

        });
    });
});

