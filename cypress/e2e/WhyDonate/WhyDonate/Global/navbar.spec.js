import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';

describe('Navbar Tests (global)', { tags: ['@globalTag'] }, () => {
  beforeEach(() => {
    cy.visitAndVerify(environment.homeUrl);
  });

  it("it should contains working header before login", () => {
    cy.wait(3000);
    // cy.get('#headerLogo').should('be.visible');
    cy.notDisabledAndVisible('#headerLogo');
    cy.notDisabledAndVisible('#headerSearchFundraiser > span.mat-button-wrapper');
    cy.notDisabledAndVisible('#headerLogo');
    cy.wait(3000);
    cy.notDisabledAndVisible('.mat-menu-trigger > .mat-button-wrapper > span');
    cy.notDisabledAndVisible('#headerWhydonatePlatform');
    cy.visitAndVerify(environment.homeUrl);
    cy.wait(3000);
    cy.notDisabledAndVisible('.mat-menu-trigger > .mat-button-wrapper > span');
    cy.notDisabledAndVisible('#headerDonationPlugin');
    cy.visitAndVerify(environment.homeUrl);
    cy.wait(3000);
    cy.notDisabledAndVisible('#startFundraiserButton');
    cy.visitAndVerify(environment.homeUrl);
    cy.wait(3000);
    cy.notDisabledAndVisible('#loginButton > span.mat-button-wrapper');
    cy.notDisabledAndVisible('#headerLogo');
  })


  it("it should contains working header after login", () => {
    cy.wait(3000);
    cy.loginUser();
    cy.wait(4000);
    cy.notDisabledAndVisible('#headerLogo');
    cy.notDisabledAndVisible('#headerMenu');

    cy.notDisabledAndVisible('#headerDashboard');
    cy.notDisabledAndVisible('#headerLogo');
    cy.wait(1000);
    cy.notDisabledAndVisible('#headerMenu');

    cy.notDisabledAndVisible('#headerBalance');
    cy.notDisabledAndVisible('#headerLogo');
    cy.wait(1000);
    cy.notDisabledAndVisible('#headerMenu');

    cy.notDisabledAndVisible('#headerMyFundraisers');
    cy.notDisabledAndVisible('#headerLogo');
    cy.wait(1000);
    cy.notDisabledAndVisible('#headerMenu');

    cy.notDisabledAndVisible('#headerMyAccount');
    cy.notDisabledAndVisible('#headerLogo');
    cy.wait(1000);
    cy.notDisabledAndVisible('#headerMenu');

    cy.notDisabledAndVisible('#headerCustomBranding');
    cy.notDisabledAndVisible('#headerLogo');
    cy.wait(1000);
    cy.notDisabledAndVisible('#headerMenu');

    cy.notDisabledAndVisible('#headerBranding');
    cy.notDisabledAndVisible('#headerLogo');
    cy.wait(1000);
    cy.notDisabledAndVisible('#headerMenu');

    cy.notDisabledAndVisible('#headerEmail');
    cy.notDisabledAndVisible('#headerLogo');
    cy.wait(1000);
    cy.notDisabledAndVisible('#headerMenu');

    cy.notDisabledAndVisible('#headerHome');
    cy.notDisabledAndVisible('#headerLogo');
    cy.wait(1000);
    cy.notDisabledAndVisible('#headerMenu');

    cy.notDisabledAndVisible('#headerLogout');
    cy.notDisabledAndVisible('#headerLogo');
  })
});

