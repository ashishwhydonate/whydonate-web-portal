import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';

describe('Head links Test Cases (global)', { tags: ['@globalTag'] }, () => {
  it('It should have alternate en link tag', () => {
    cy.visitAndVerify(environment.homeUrl + '/en/');
    cy.document().get('head link[rel="alternate"]')
      .should('have.attr', "hreflang", "en")
    cy.document().get('head link[rel="alternate"]')
      .invoke('attr', 'href')
      .then(href => {
        cy.visitAndVerify(href);
      })
  })
  it('It should have alternate nl link tag', () => {
    cy.visitAndVerify(environment.homeUrl + '/nl/');
    cy.document().get('head link[rel="alternate"]').eq(1)
      .should('have.attr', "hreflang", "nl")
    cy.document().get('head link[rel="alternate"]').eq(1)
      .invoke('attr', 'href')
      .then(href => {
        cy.visitAndVerify(href);
      })
  })
  it('It should have alternate nl link tag', () => {
    cy.visitAndVerify(environment.homeUrl + '/es');
    cy.document().get('head link[rel="alternate"]').eq(2)
      .should('have.attr', "hreflang", "es")
    cy.document().get('head link[rel="alternate"]').eq(2)
      .invoke('attr', 'href')
      .then(href => {
        cy.visitAndVerify(href);
      })
  })
  it('It should have alternate de link tag', () => {
    cy.visitAndVerify(environment.homeUrl + '/de');
    cy.document().get('head link[rel="alternate"]').eq(3)
      .should('have.attr', "hreflang", "de")
    cy.document().get('head link[rel="alternate"]').eq(3)
      .invoke('attr', 'href')
      .then(href => {
        cy.visitAndVerify(href);
      })
  })
  it('It should have alternate fr link tag', () => {
    cy.visitAndVerify(environment.homeUrl + '/fr');
    cy.document().get('head link[rel="alternate"]').eq(4)
      .should('have.attr', "hreflang", "fr")
    cy.document().get('head link[rel="alternate"]').eq(4)
      .invoke('attr', 'href')
      .then(href => {
        cy.visitAndVerify(href);
      })
  })
  it('It should have alternate default link tag', () => {
    cy.visitAndVerify(environment.homeUrl + '/');
    cy.document().get('head link[rel="alternate"]').eq(5)
      .should('have.attr', "hreflang", "x-default")
    cy.document().get('head link[rel="alternate"]').eq(5)
      .invoke('attr', 'href')
      .then(href => {
        cy.visitAndVerify(href);
      })
  })
})
