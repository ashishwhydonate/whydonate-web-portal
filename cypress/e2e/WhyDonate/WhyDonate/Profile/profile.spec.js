import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';
import { defaultPassword } from 'cypress/e2e/WhyDonate/custom/helper.js';

describe('Navbar Tests (account)', { tags: ['@accountTag'] }, () => {

  const language_code = 'en'
  beforeEach(() => {

    cy.visit(environment.homeUrl + `/${language_code}`);
  });

  it('It should have working profile personal type', () => {
    cy.loginUser()

    cy.notDisabledAndVisible('#headerMenu')
    cy.notDisabledAndVisible('#headerMyAccount')
    cy.wait(2000)
    cy.notDisabledAndVisible('#personalRadio')
    cy.get('#firstName').clear().type('YASH');
    cy.get('#lastName').clear().type('JAIN');
    cy.get('#phoneNumber').clear().type('1234567899');
    cy.notDisabledAndVisible('#saveButton')
    cy.wait(2000);
    cy.get('#verifyInput').type(defaultPassword);
    cy.notDisabledAndVisible('#verifyButton')
  })

  it('It should have working profile organisation type', () => {
    cy.loginUser()

    cy.notDisabledAndVisible('#headerMenu')
    cy.notDisabledAndVisible('#headerMyAccount')
    cy.wait(2000)
    cy.notDisabledAndVisible('#organisationRadio')
    cy.get('#firstName').clear().type('YASH');
    cy.get('#lastName').clear().type('JAIN');
    cy.get('#organisationName').clear().type('Whydonate');
    cy.get('#phoneNumber').clear().type('1234567899');
    cy.notDisabledAndVisible('#saveButton')
    cy.wait(2000);
    cy.get('#verifyInput').type(defaultPassword);
    cy.notDisabledAndVisible('#verifyButton')
  })
  it('It should have working api key', () => {
    cy.loginUser()

    cy.notDisabledAndVisible('#headerApiKey')
    cy.notDisabledAndVisible('#copyCode')

  })

  // it('It should have Notifications', () => {
  //   cy.get('#header').find('#loginButton').click();
  //   cy.get('.content-height').find('#loginEmail').type(email);
  //   cy.get('.content-height').find('#loginPassword').type(password);
  //   cy.get('.content-height').find('#userLogin').click();
  //   cy.request('POST', environment.ACCOUNT_API_V2 + 'account/user/login/', { email: email, password: password }).then((res) => {
  //     cy.get('#headerCustomiseEmails').click();
  //     cy.request({
  //       method: 'GET',
  //       url: environment.ACCOUNT_API_V2 + 'account/profile',
  //       headers: {
  //         'Content-Type': 'text/html',
  //         'Authorization': 'JWT ' + res.body.data.jwt,
  //       },
  //     }).then(response => {
  //       cy.get('#mat-checkbox-1').click();
  //       cy.get('#mat-checkbox-2').click();
  //       cy.get('#mat-checkbox-3').click();
  //       cy.get('#emailSave').click();
  //     })
  //   });
  // })

  // it('It should have working reset password', () => {
  //   cy.get('#loginButton').click();
  //   cy.get('#loginEmail').type(email);
  //   cy.get('#loginPassword').type(password);
  //   cy.get('#userLogin').click();
  //   cy.wait(4000);
  //   cy.get('#headerMenu').click();
  //   cy.get('#headerMyAccount').click();
  //   cy.wait(4000);
  //   cy.get('#resetPassword > .mat-focus-indicator > .mat-button-wrapper').click();
  //   cy.wait(4000);
  //   cy.get('#cruntPassword').type(password);
  //   cy.get('.newPassword').type(password);
  //   cy.get('.retypePassword').type(password);
  //   cy.get('#resetSaveButton').click();
  // });

  // it('It should have working bank account', () => {
  //   cy.get('#loginButton').click();
  //   cy.get('#loginEmail').type(email);
  //   cy.get('#loginPassword').type(password);
  //   cy.get('#userLogin').click();
  //   cy.wait(4000);
  //   cy.get('#headerMenu').click();
  //   cy.get('#headerMyAccount').click();
  //   cy.wait(4000);
  //   cy.get('body > app-root > div > app-profile > mat-drawer-container > mat-drawer > div > nav > mat-selection-list > mat-list-option:nth-child(2) > div > div.mat-list-text > div').click();
  //   cy.wait(4000);
  //   cy.get('#bankSave').click();
  //   cy.wait(2000);
  //   cy.get('#verifyPasswordInput').type(password);
  //   cy.get('#verifySave').click();
  // })

  // it('It should have working email', () => {
  //   cy.get('#loginButton').click();
  //   cy.get('#loginEmail').type(email);
  //   cy.get('#loginPassword').type(password);
  //   cy.get('#userLogin').click();
  //   cy.wait(4000);
  //   cy.get('#headerMenu').click();
  //   cy.get('#headerMyAccount').click();
  //   cy.wait(4000);
  //   cy.get('body > app-root > div > app-profile > mat-drawer-container > mat-drawer > div > nav > mat-selection-list > mat-list-option:nth-child(4) > div > div.mat-list-text > div').click();
  //   cy.wait(4000);
  //   cy.get('#connectFundraiser').click();
  //   cy.get('#emailSave').click();
  // });

  // it('It should have deactivate', () => {
  //   cy.get('#loginButton').click();
  //   cy.get('#loginEmail').type(email);
  //   cy.get('#loginPassword').type(password);
  //   cy.get('#userLogin').click();
  //   cy.wait(4000);
  //   cy.get('#headerMenu').click();
  //   cy.get('#headerMyAccount').click();
  //   cy.wait(4000);
  //   cy.get('body > app-root > div > app-profile > mat-drawer-container > mat-drawer > div > nav > mat-selection-list > mat-list-option:nth-child(5) > div > div.mat-list-text > div').click();
  //   cy.wait(4000);
  //   cy.get('#deactivateAccount').click();
  //   cy.get('#deactivateVerification').type(password);
  //   cy.get('#deactivate').click();
  // })
})
