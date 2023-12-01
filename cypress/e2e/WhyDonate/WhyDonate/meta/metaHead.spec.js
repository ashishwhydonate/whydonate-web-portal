import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';

describe('Meta Head Tests (global)', { tags: ['@globalTag'] }, () => {

  it('It should have en meta tags', () => {
    cy.visitAndVerify(environment.homeUrl + '/en');
    cy.wait(1000);

    cy.document().get('head meta[name="description"]')
      .should('have.attr', "content",)
      .and('contain', 'Fundraising');
    cy.document().get('head meta[property="og:title"]')
      .should('have.attr', "content",)
      .and('contain', 'Fundraising');
    cy.document().get('head meta[property="og:url"]')
      .should('have.attr', "content", "https://whydonate.in/en/")
    cy.document().get('head meta[property="og:type"]')
      .should('have.attr', "content", "website")
    cy.document().get('head meta[property="og:image:width"]')
      .should('have.attr', "content", "1200")
    cy.document().get('head meta[property="og:image:height"]')
      .should('have.attr', "content", "627")
  })
  it('It should have nl meta tags', () => {
    cy.visitAndVerify(environment.homeUrl + '/nl');
    cy.wait(1000);
    cy.document().get('head meta[name="description"]')
      .should('have.attr', "content",)
      .and('contain', 'Fondsenwerving');
    cy.document().get('head meta[property="og:title"]')
      .should('have.attr', "content",)
      .and('contain', 'Geld');
    cy.document().get('head meta[property="og:url"]')
      .should('have.attr', "content", "https://whydonate.in/nl/")
    cy.document().get('head meta[property="og:type"]')
      .should('have.attr', "content", "website")
    cy.document().get('head meta[property="og:image:width"]')
      .should('have.attr', "content", "1200")
    cy.document().get('head meta[property="og:image:height"]')
      .should('have.attr', "content", "627")
  })
  it('It should have es meta tags', () => {
    cy.visitAndVerify(environment.homeUrl + '/es');
    cy.wait(1000);
    cy.document().get('head meta[name="description"]')
      .should('have.attr', "content",)
      .and('contain', 'recaudación de fondos');
    cy.document().get('head meta[property="og:title"]')
      .should('have.attr', "content",)
      .and('contain', 'Plataforma');
    cy.document().get('head meta[property="og:url"]')
      .should('have.attr', "content", "https://whydonate.in/es/")
    cy.document().get('head meta[property="og:type"]')
      .should('have.attr', "content", "website")
    cy.document().get('head meta[property="og:image:width"]')
      .should('have.attr', "content", "1200")
    cy.document().get('head meta[property="og:image:height"]')
      .should('have.attr', "content", "627")
  })
  it('It should have de meta tags', () => {
    cy.visitAndVerify(environment.homeUrl + '/de');
    cy.wait(1000);
    cy.document().get('head meta[name="description"]')
      .should('have.attr', "content",)
      .and('contain', 'Fundraising-Site');
    cy.document().get('head meta[property="og:title"]')
      .should('have.attr', "content",)
      .and('contain', 'Spenden');
    cy.document().get('head meta[property="og:url"]')
      .should('have.attr', "content", "https://whydonate.in/de/")
    cy.document().get('head meta[property="og:type"]')
      .should('have.attr', "content", "website")
    cy.document().get('head meta[property="og:image:width"]')
      .should('have.attr', "content", "1200")
    cy.document().get('head meta[property="og:image:height"]')
      .should('have.attr', "content", "627")
  })
  it('It should have fr meta tags', () => {
    cy.visitAndVerify(environment.homeUrl + '/fr');
    cy.wait(1000);
    cy.document().get('head meta[name="description"]')
      .should('have.attr', "content",)
      .and('contain', 'collecte de fonds');
    cy.document().get('head meta[property="og:title"]')
      .should('have.attr', "content",)
      .and('contain', 'Plateforme');
    cy.document().get('head meta[property="og:url"]')
      .should('have.attr', "content", "https://whydonate.in/fr/")
    cy.document().get('head meta[property="og:type"]')
      .should('have.attr', "content", "website")
    cy.document().get('head meta[property="og:image:width"]')
      .should('have.attr', "content", "1200")
    cy.document().get('head meta[property="og:image:height"]')
      .should('have.attr', "content", "627")
  })
})
