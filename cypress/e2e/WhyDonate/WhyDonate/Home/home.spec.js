import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';

describe("Whydonate Home Page (global)", { tags: ['@globalTag'] }, () => {
  beforeEach(() => {
    cy.visitAndVerify(environment.homeUrl);
  });

  it('It Should have logo', () => {
    cy.wait(1000);
    cy.notDisabledAndVisible('#headerLogo')
  })

  it('It should have working start personal fundraising', () => {
    cy.wait(2000);
    cy.notDisabledAndVisible('#homePersonalFundraising > span.mat-button-wrapper')
    cy.visitAndVerify(environment.homeUrl);
  })
  it('It should have working start organisation', () => {
    cy.wait(1000);
    cy.notDisabledAndVisible('#homeOrganisation > span.mat-button-wrapper')
    cy.wait(2000);
    cy.notDisabledAndVisible('#donationLearnMore')

    cy.visitAndVerify(environment.homeUrl);
    cy.wait(1000);
    cy.notDisabledAndVisible('#homeOrganisation > span.mat-button-wrapper')

    cy.notDisabledAndVisible('#routeToEurope')
    cy.visitAndVerify(environment.homeUrl);
    cy.wait(1000);
    cy.notDisabledAndVisible('#homeOrganisation > span.mat-button-wrapper')

    cy.notDisabledAndVisible('#routeToCrowdfunding')
    cy.visitAndVerify(environment.homeUrl);
    cy.wait(1000);
    cy.notDisabledAndVisible('#homeOrganisation > span.mat-button-wrapper')

    cy.notDisabledAndVisible('#routeToRecurring')
    cy.visitAndVerify(environment.homeUrl);
    cy.wait(1000);
    cy.notDisabledAndVisible('#homeOrganisation > span.mat-button-wrapper')

    cy.notDisabledAndVisible('#routeToCustomCrowdFunding')
    cy.visitAndVerify(environment.homeUrl);
    cy.wait(1000);
    cy.notDisabledAndVisible('#homeOrganisation > span.mat-button-wrapper')

  })
  it('It should have working start fundraiser button', () => {
    cy.wait(2000);
    cy.notDisabledAndVisible('#startFundraiserButton')
    cy.visitAndVerify(environment.homeUrl);
  })
  it('It should have working populaire fundraiser', () => {
    // cy.wait(2000);
    // cy.get('#fundraiser-card').should('be.visible');
    cy.wait(2000);
    cy.visitAndVerify(environment.homeUrl);
  })

  it('It should have working start fundraiser / promote cause  button for charity', () => {
    cy.wait(2000);
    cy.get('#totalDonations').should('be.visible')

    cy.notDisabledAndVisible('#makingDifferenceStartButton')
    cy.wait(2000);
    cy.visitAndVerify(environment.homeUrl);

    cy.notDisabledAndVisible('#promoteCause > a > span.mat-button-wrapper')
    cy.wait(2000);
    cy.visitAndVerify(environment.homeUrl);
  })
  it('It should have working fundraising features', () => {
    cy.wait(2000);
    cy.get('#fundraisingSiteLink').should('be.visible');
    cy.get('#fundraisingSiteLink');
    cy.wait(2000);
    cy.visitAndVerify(environment.homeUrl);
  })
  it('It should have working platform and about section', () => {

    cy.notDisabledAndVisible('#aboutStartButton')
    cy.wait(2000);
    cy.visitAndVerify(environment.homeUrl);

    cy.notDisabledAndVisible('#promoteCause')
    cy.wait(2000);
    cy.visitAndVerify(environment.homeUrl);
  })
})
