import { environment } from 'src/environments/environment.ts';
import { defaultEmail, defaultPassword } from 'cypress/e2e/WhyDonate/custom/helper.js';
import { connect } from '@planetscale/database'

Cypress.Commands.add('loginUser', (email, password) => {
    cy.get('#header').find('#loginButton').click();
    cy.get('.content-height').find('#loginEmail').type(email ? email : defaultEmail);
    cy.get('.content-height').find('#loginPassword').type(password ? password : defaultPassword);
    cy.intercept('POST', environment.ACCOUNT_API_V2 + 'account/user/login').as('loginAPIRequest');
    cy.notDisabledAndVisible('#userLogin');
    cy.wait('@loginAPIRequest').then((interception) => {
        cy.checkAPIResponseSuccess(interception)
    });
});
Cypress.Commands.add('testDatabaseConnection', (query, additionalCode) => {
    cy.log('Connecting to the database...');
    const conn = connect({
        host: Cypress.env('DB').host,
        username: Cypress.env('DB').username,
        password: Cypress.env('DB').password,
    });

    return conn.execute(query)
        .then((res) => {
            cy.log('Database connection successful');
            cy.log(res);
            if (additionalCode) {
                additionalCode(res);
            }
        })
        .catch((err) => {
            cy.log('Error connecting to the database');
            cy.log(err);
            throw err; // This ensures that the test fails if there's an error.
        });
});

Cypress.Commands.add('visitAndVerify', (url) => {
    cy.visit(url);
    cy.url().should('include', url);
});

Cypress.Commands.add('notDisabledAndVisible', (selector, force, multiple) => {
    cy.get(selector).should("not.be.disabled").should("be.visible").click({ force: force ? true : false, multiple: multiple ? true : false })
});

Cypress.Commands.add('checkAPIResponseSuccess', (interception) => {
    // Assert the response status code
    expect(interception.response.statusCode).to.equal(200);
    expect(interception.response.body.errors).to.be.empty;
});

Cypress.Commands.add('createFundraiserWithVideo', (slug) => {
    cy.get('#startFundraiserButton > button').first().click()
    cy.get('.newFundraiser').click();
    cy.get('.fundraiserTitle').type(slug);
    cy.get('.category').click();
    cy.get('#mat-option-3 > .mat-option-text').click();
    cy.intercept('GET', `${environment.fundraiser_url}fundraiser/get?slug=${slug}&language=en`).as('apiRequest');
    cy.get('.location')
        .type('india')
        .request("GET", `${environment.fundraiser_url}location?query=i&language_code=en/`, { input_text: 'i', language: 'en' })
        .request("GET", `${environment.fundraiser_url}location?query=i&language_code=en/`, { input_text: 'in', language: 'en' })
        .request("GET", `${environment.fundraiser_url}location?query=i&language_code=en/`, { input_text: 'ind', language: 'en' })
        .request("GET", `${environment.fundraiser_url}location?query=i&language_code=en/`, { input_text: 'indi', language: 'en' })
        .request("GET", `${environment.fundraiser_url}location?query=i&language_code=en/`, { input_text: 'india', language: 'en' })
    cy.wait(2000);
    cy.get('.mat-option-text').first().should('be.visible').click({ force: true, multiple: true });
    cy.wait(2000);
    cy.get('#saveBtn').should('be.visible');
    cy.wait(2000);
    cy.get('#saveBtn').click({ force: true });
    cy.wait(2000)
    cy.get('#button_add_video_create_fundraiser').click()
    cy.get('#VideoName').should("be.visible");
    cy.get('#VideoName').click({ force: true });
    cy.get('#VideoName').type('https://www.youtube.com/watch?v=69SFwgWHUig', { force: true });

    cy.intercept('POST', `${environment.fundraiser_url}fundraiser/video/background`).as('uploadVideo');
    cy.get('#save_video_iframe_save_button').click();
    cy.get('#create_fundraiser_Iframe').should('be.visible');

    cy.get('#nextButtonUploadImage').should('be.visible').click()
    cy.intercept('GET', `${environment.fundraiser_url}fundraiser/get?slug=${slug}&language=en`).as('getFundraiser');
    cy.get('#create_fundraiser_email').type('primal@gmail.com');
    cy.get('#create_fundraiser_facebook').type('https://www.facebook.com/WhyDonate');
    cy.get('#create_fundraiser_twitter').type('https://twitter.com/whydonate');
    cy.get('#create_fundraiser_linked_in').type('https://www.linkedin.com/company/whydonate/');
    cy.get('#create_fundraiser_save').should('be.visible').click({ force: true })
    cy.wait('@uploadVideo').then((response) => {
        // Assert the response status code
        expect(response.response.statusCode).to.equal(200);
        // Assert the response body
        expect(response.response.body).to.deep.equal({
            "data": {
                "upload": true
            },
            "errors": {},
            "status": 200
        });
    });
    cy.wait(5000)
    cy.get('#publish-button').click();
    cy.get('.mat-flat-button').should("not.be.disabled");
});

