import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';

describe('Home Tagline Tests (global)', { tags: ['@globalTag'] }, () => {
  beforeEach(() => {
    cy.visitAndVerify(environment.homeUrl);
  });

  it('It Should have logo', () => {
    // cy.get('#headerLogo').should('be.visible');
    cy.notDisabledAndVisible('#headerLogo')

    cy.get('#homePersonalAndCharity').should('be.visible');
    cy.get('#homePlatform').should('be.visible');
    cy.get('#homeDescription').should('be.visible');
  })
});
