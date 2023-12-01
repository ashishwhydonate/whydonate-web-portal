import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';

describe('Footer Tests (global)', { tags: ['@globalTag'] }, () => {
  beforeEach(() => {
    cy.visitAndVerify(environment.homeUrl);

  })

  it('It should have working Support Information', () => {

    cy.wait(1000);
    cy.notDisabledAndVisible('.support')
    cy.visitAndVerify(environment.homeUrl);

    cy.wait(1000);
    cy.notDisabledAndVisible('.helpdesk')
    cy.visitAndVerify(environment.homeUrl);

    cy.wait(2000);
    cy.notDisabledAndVisible('.about')
    cy.visitAndVerify(environment.homeUrl);

    cy.wait(1000);
    cy.notDisabledAndVisible('.fundraising')
    cy.visitAndVerify(environment.homeUrl);

    cy.wait(1000);
    cy.notDisabledAndVisible('.blog')
    cy.visitAndVerify(environment.homeUrl);

    cy.wait(1000);
    cy.notDisabledAndVisible('.contact')
    cy.visitAndVerify(environment.homeUrl);
  });

  it('It should have working Features information', () => {
    cy.notDisabledAndVisible('.features')
    cy.visitAndVerify(environment.homeUrl);

    cy.wait(1000);
    cy.notDisabledAndVisible('.global')
    cy.visitAndVerify(environment.homeUrl);

    cy.wait(1000);
    cy.notDisabledAndVisible('.custom')
    cy.visitAndVerify(environment.homeUrl);

    cy.wait(1000);
    cy.notDisabledAndVisible('.recurring')
    cy.visitAndVerify(environment.homeUrl);

    cy.wait(1000);
    cy.notDisabledAndVisible('.qr-code')
    cy.visitAndVerify(environment.homeUrl);
  });

  it('It should have working Product information', () => {
    cy.wait(1000);
    cy.notDisabledAndVisible('.product')
    cy.visitAndVerify(environment.homeUrl);

    cy.wait(1000);
    cy.notDisabledAndVisible('.platform')
    cy.visitAndVerify(environment.homeUrl);

    cy.wait(1000);
    cy.notDisabledAndVisible('.donate')
    cy.visitAndVerify(environment.homeUrl);


  });

  it('It should have working Fundraiser For information', () => {
    cy.wait(1000);
    cy.notDisabledAndVisible('.fundraiser')
    cy.visitAndVerify(environment.homeUrl);

    cy.wait(1000);
    cy.notDisabledAndVisible('.fundraising-medical')
    cy.visitAndVerify(environment.homeUrl);

    cy.wait(1000);
    cy.notDisabledAndVisible('.fundraising-education')
    cy.visitAndVerify(environment.homeUrl);

    cy.wait(1000);
    cy.notDisabledAndVisible('.fundraising-sports')
    cy.visitAndVerify(environment.homeUrl);

    cy.wait(1000);
    cy.notDisabledAndVisible('.crowdfunding-music')
    cy.visitAndVerify(environment.homeUrl);

    cy.wait(1000);
    cy.notDisabledAndVisible('.crowdfunding-charity')
    cy.visitAndVerify(environment.homeUrl);

    cy.wait(1000);
    cy.notDisabledAndVisible('.fundraising-funeral')
    cy.visitAndVerify(environment.homeUrl);

    cy.wait(1000);
    cy.notDisabledAndVisible('.fundraising-non-profits')
    cy.visitAndVerify(environment.homeUrl);

    cy.wait(1000);
    cy.notDisabledAndVisible('.fundraising-personal')
    cy.visitAndVerify(environment.homeUrl);

    cy.wait(1000);
    cy.notDisabledAndVisible('.corporate')
    cy.visitAndVerify(environment.homeUrl);
  });


});
