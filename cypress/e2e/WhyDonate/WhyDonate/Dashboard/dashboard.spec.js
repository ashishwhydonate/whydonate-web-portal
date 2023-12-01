import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';

describe('Dashboard module Tests (transactions)', { tags: ['@transactionsTag'] }, () => {
  beforeEach(() => {
    cy.visitAndVerify(environment.homeUrl);
    cy.loginUser();
  });

  it('should have a working myFundraiser page', () => {
    // Set date range filters
    cy.get('#mat-date-range-input-0').type('21-9-2022');
    cy.get('#endDate').type('30-9-2022');
    cy.wait(2000);

    // Apply filters
    cy.get('.toggle').click();
    cy.notDisabledAndVisible('.apply')

    // Download CSV for received donations
    cy.notDisabledAndVisible('#receivedDownloadCsv');
    cy.wait(4000);

    // Click on various filters or actions
    cy.notDisabledAndVisible('#given');
    cy.notDisabledAndVisible('#recurringReceived');
    cy.notDisabledAndVisible('#recurringGiven');
  });
});
