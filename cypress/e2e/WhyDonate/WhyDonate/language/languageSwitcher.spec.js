import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';

describe('Language Chooser Tests (global)', { tags: ['@globalTag'] }, () => {
  const language_code = 'en'
  const slug = 'hopeful-hearts-empowering-education-for-underprivileged-children'

  beforeEach(() => {
    cy.visitAndVerify(environment.homeUrl + `/${language_code}`);
  });

  it("It should have working en language chooser", () => {
    cy.wait(2000);

    cy.notDisabledAndVisible('#headerSearchFundraiser > span.mat-button-wrapper');
    cy.notDisabledAndVisible(':nth-child(1) > .mat-card > .mat-card-image');
    cy.intercept("GET", environment.DONATION_API_V2 + `donation/orders/fundraising/local/short?slug=${slug}&language_code=${language_code}`).as("donationRequest")
    cy.notDisabledAndVisible(".language-chooser");
    cy.wait(2000);
    cy.wait('@donationRequest').then((interception) => {
      cy.checkAPIResponseSuccess(interception)
    })
    cy.notDisabledAndVisible(".enChooser", true)
  })

  it("It should have working nl language chooser", () => {
    cy.wait(2000);

    cy.notDisabledAndVisible('#headerSearchFundraiser > span.mat-button-wrapper');
    cy.notDisabledAndVisible(':nth-child(1) > .mat-card > .mat-card-image');
    cy.intercept("GET", environment.DONATION_API_V2 + `donation/orders/fundraising/local/short?slug=${slug}&language_code=${language_code}`).as("donationRequest")
    cy.notDisabledAndVisible(".language-chooser");
    cy.wait(2000);
    cy.wait('@donationRequest').then((interception) => {
      cy.checkAPIResponseSuccess(interception)
    })
    cy.get(".nlChooser", true)
  })

  it("It should have working es language chooser", () => {
    cy.wait(2000);

    cy.notDisabledAndVisible('#headerSearchFundraiser > span.mat-button-wrapper');
    cy.notDisabledAndVisible(':nth-child(1) > .mat-card > .mat-card-image');
    cy.intercept("GET", environment.DONATION_API_V2 + `donation/orders/fundraising/local/short?slug=${slug}&language_code=${language_code}`).as("donationRequest")
    cy.notDisabledAndVisible(".language-chooser");
    cy.wait(2000);
    cy.wait('@donationRequest').then((interception) => {
      cy.checkAPIResponseSuccess(interception)
    })
    cy.get(".esChooser", true)
  })

  it("It should have working de language chooser", () => {
    cy.wait(2000);

    cy.notDisabledAndVisible('#headerSearchFundraiser > span.mat-button-wrapper');
    cy.notDisabledAndVisible(':nth-child(1) > .mat-card > .mat-card-image');
    cy.intercept("GET", environment.DONATION_API_V2 + `donation/orders/fundraising/local/short?slug=${slug}&language_code=${language_code}`).as("donationRequest")
    cy.notDisabledAndVisible(".language-chooser");
    cy.wait(2000);
    cy.wait('@donationRequest').then((interception) => {
      cy.checkAPIResponseSuccess(interception)
    })
    cy.get(".deChooser", true)
  })

  it("It should have working de language chooser", () => {
    cy.wait(2000);

    cy.notDisabledAndVisible('#headerSearchFundraiser > span.mat-button-wrapper');
    cy.notDisabledAndVisible(':nth-child(1) > .mat-card > .mat-card-image');
    cy.intercept("GET", environment.DONATION_API_V2 + `donation/orders/fundraising/local/short?slug=${slug}&language_code=${language_code}`).as("donationRequest")
    cy.notDisabledAndVisible(".language-chooser");
    cy.wait(2000);
    cy.wait('@donationRequest').then((interception) => {
      cy.checkAPIResponseSuccess(interception)
    })
    cy.get(".frChooser", true)
  })
})
