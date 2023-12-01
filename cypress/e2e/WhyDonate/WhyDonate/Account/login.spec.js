import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';

// Describe block for the login page tests
describe('Whydonate Login Page (account)', { tags: ['@accountTag'] }, () => {
  // Common setup before each test case
  beforeEach(() => {
    cy.visitAndVerify(environment.homeUrl);
    cy.wait(2000); // Adding a common wait for stability
  });

  // Test case: Successful login with an existing user
  it('The User exists', () => {
    cy.loginUser()
  });

  // Test case: Attempt login with a non-existing user
  it('The User does not exist', () => {
    cy.get('#header').find('#loginButton').click();
    cy.get('.content-height').find('#loginEmail').type('abdur@whydonate.nl');
    cy.get('.content-height').find('#loginPassword').type('Rehman95');
    cy.get('.content-height').find('#userLogin').click();
    cy.wait(4000); // Wait for response or error message
  });

  // Test case: Attempt login with empty fields
  it('The empty login attempt', () => {
    cy.get('#header').find('#loginButton').click();
    cy.get('.content-height').find('#userLogin').click();
    cy.wait(4000); // Wait for response or error message
  });
});
