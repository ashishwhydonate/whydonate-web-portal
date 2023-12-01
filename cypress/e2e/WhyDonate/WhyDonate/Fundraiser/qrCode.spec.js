
import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';

describe('View Fundraiser Tests (global)', { tags: ['@globalTag'] }, () => {

  const homeUrl = environment.homeUrl + '/en'

  beforeEach(() => {
    cy.visitAndVerify(homeUrl);
  })

  it('It should have working QR code generator', () => {
    cy.wait(2000);

    cy.notDisabledAndVisible('#headerSearchFundraiser > span.mat-button-wrapper')
    cy.notDisabledAndVisible('#fundraiser-card')
    cy.wait(2000);
    cy.notDisabledAndVisible('#shareFundraiser')
    cy.notDisabledAndVisible('#QRCodeButton')
    cy.get('app-qr-code').should('be.visible');
  });
})
