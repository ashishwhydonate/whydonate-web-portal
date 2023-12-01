import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';

// Test suite for Whydonate Balance Page (transactions)
describe('Whydonate Balance Page (transactions)', { tags: ['@transactionsTag'] }, () => {

  beforeEach(() => {
    cy.visitAndVerify(`${environment.homeUrl}/en`);
    cy.loginUser();
  });

  it('It should have working balance Redirect', () => {
    cy.notDisabledAndVisible('#headerBalance');
  });

  it('It should have working search functionality on balance', () => {
    cy.intercept('GET', environment.DONATION_API_V2 + 'donation/count').as('apiRequest');

    // Login and navigate to the balance page
    cy.notDisabledAndVisible('#headerBalance');

    // Perform a search on the balance page
    cy.request('GET', environment.wallet_url + 'balance')
    cy.get('#search-input').type('ideal');
    cy.wait('@apiRequest').then((interception) => {
      cy.checkAPIResponseSuccess(interception)
    });
  });

  it('It should have working date functionality on balance', () => {
    cy.intercept('GET', environment.DONATION_API_V2 + 'donation/count').as('apiRequest');

    // Login and navigate to the balance page
    cy.notDisabledAndVisible('#headerBalance');
    cy.request('GET', environment.wallet_url + 'balance')

    // Perform date-based filtering on the balance page
    cy.get('.inputDateStart').type('8-7-2022', { force: true });
    cy.get('.mat-calendar-body-cell').eq(1);
    cy.get('.mat-calendar-body-cell').eq(19);
    cy.notDisabledAndVisible('.toggle', true);
    cy.notDisabledAndVisible('.apply', true);
    cy.wait('@apiRequest').then((interception) => {
      cy.checkAPIResponseSuccess(interception)
    });
  });
});
