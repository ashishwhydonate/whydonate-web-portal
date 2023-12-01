
import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';

describe('Payment Request Url Test (global)', { tags: ['@globalTag'] }, () => {
  const homeUrl = environment.homeUrl + '/en'

  beforeEach(() => {
    cy.visitAndVerify(homeUrl);
  })
  it('It should have working payment request', () => {
    cy.wait(2000);

    cy.notDisabledAndVisible('#headerSearchFundraiser > span.mat-button-wrapper');
    cy.get('#fundraiser-card').first().click();
    cy.get('.mat-chip').should('be.visible');
    cy.notDisabledAndVisible('#shareFundraiser');
    cy.notDisabledAndVisible('#mat-tab-label-1-2 > div');
    cy.notDisabledAndVisible('#preset-button');
    cy.get('.mat-simple-snack-bar-content')
      .should('be.visible')
      .should('have.text', 'Generate successful.');
  });
})

