import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';

// Describe block for the registration page tests
describe('Whydonate Registration Page (account)', { tags: ['@accountTag'] }, () => {
  // Common setup before each test case
  beforeEach(() => {
    cy.visitAndVerify(environment.homeUrl);
    cy.wait(2000); // Adding a common wait for stability
  });

  // Test case: Successful individual user creation
  it('The successful individual user creation', () => {
    cy.get('#loginButton > span.mat-button-wrapper').click({ force: true });
    cy.get('#registerButton').click({ force: true });
    cy.get('#profileImage').click({ force: true });
    const filePath = 'waves-light-8k-5120x2880.jpg';
    cy.get('input[type="file"]').attachFile(filePath);
    cy.get('#profileImage').click({ force: true });
    cy.get('#registerFirstName').type('Coca', { force: true });
    cy.get('#registerLastName').type('Cola', { force: true });
    cy.get('#registerEmail').type('test2@gmail.com');
    cy.get('#registerPassword').type('Rehman95');
    cy.get('#registerRetypePassword').type('Rehman95');
    cy.get('#registerContactNumber').type('2132341515');
    cy.get('#registerButton').click();
    cy.wait(8000); // Wait for response or completion
  });

  // Test case: Successful organization user creation
  it('The successful organization user creation', () => {
    cy.get('#loginButton > span.mat-button-wrapper').click();
    cy.get('#registerButton').click();
    cy.get('#registerOrganization').click();
    cy.get('#profileImage').click();
    const filePath = 'waves-light-8k-5120x2880.jpg';
    cy.get('input[type="file"]').attachFile(filePath);
    cy.get('#profileImage').click();
    cy.get('#registerFirstName').type('Coca');
    cy.get('#registerLastName').type('Cola');
    cy.get('#registerEmail').type('test@gmail.com');
    cy.get('#registerPassword').type('Rehman95');
    cy.get('#registerRetypePassword').type('Rehman95');
    cy.get('#registerOrganizationInput').type('True-Noble-Gang');
    cy.get('#registerContactNumber').type('2132341515');
    cy.wait(2000);
    cy.get('#registerButton').click();
    cy.wait(8000);
  });

  // Test case: Failed individual user creation
  it('The failure individual user creation', () => {
    cy.get('#loginButton > span.mat-button-wrapper').click();
    cy.get('#registerButton').click();
    cy.get('#profileImage').click();
    const filePath = 'waves-light-8k-5120x2880.jpg';
    cy.get('input[type="file"]').attachFile(filePath);
    cy.get('#profileImage').click();
    cy.get('#registerFirstName').type('Coca');
    cy.get('#registerLastName').type('Cola');
    cy.get('#registerEmail').type('test25@gmail.com');
    cy.get('#registerPassword').type('rehman95');
    cy.get('#registerRetypePassword').type('rehma95');
    cy.get('#registerContactNumber').type('2132341515');
    cy.get('#registerButton').click();
    cy.wait(2000);
  });

  // Test case: Failed organization user creation
  it('The failure organization user creation', () => {
    cy.get('#loginButton > span.mat-button-wrapper').click();
    cy.get('#registerButton').click();
    cy.get('#registerOrganization').click();
    cy.get('#profileImage').click();
    const filePath = 'waves-light-8k-5120x2880.jpg';
    cy.get('input[type="file"]').attachFile(filePath);
    cy.get('#profileImage').click();
    cy.get('#registerFirstName').type('Coca');
    cy.get('#registerLastName').type('Cola');
    cy.get('#registerEmail').type('test@gmail.com');
    cy.get('#registerPassword').type('rehman95');
    cy.get('#registerRetypePassword').type('rehman5');
    cy.get('#registerOrganizationInput').type('True-Noble-Gang');
    cy.get('#registerContactNumber').type('2132341515');
    cy.wait(2000);
    cy.get('#registerButton').click();
    cy.wait(2000);
  });
});
