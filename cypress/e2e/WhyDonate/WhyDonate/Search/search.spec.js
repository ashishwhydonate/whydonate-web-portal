
import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';

describe('Home Module Tests (global)', { tags: ['@globalTag'] }, () => {
  beforeEach(() => {
    cy.visitAndVerify(environment.homeUrl);
  });

  it('It should have working sidebar and search button', () => {
    cy.wait(1000);
    cy.get('#headerSearchFundraiser > span.mat-button-wrapper').click();
    cy.get('#mat-input-0').type('test');

    cy.get('#nonProfit').click();
    cy.get('#personal').click();
    cy.get(
      ':nth-child(1) > .mat-list-item-content > .mat-pseudo-checkbox'
    ).click();
    cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=&type=personal,organisation&page=0&page_size=24&category=1&sort_on=-donation.amount&status=1&target_amount=").then(res => {
      cy.get(
        ':nth-child(2) > .mat-list-item-content > .mat-pseudo-checkbox'
      ).click();
      cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=&type=personal,organisation&page=0&page_size=24&category=1,2&sort_on=-donation.amount&status=1&target_amount=").then(res => {
        cy.get(
          ':nth-child(3) > .mat-list-item-content > .mat-pseudo-checkbox'
        ).click();
        cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=&type=personal,organisation&page=0&page_size=24&category=1,2,3&sort_on=-donation.amount&status=1&target_amount=").then(res => {
          cy.get(
            ':nth-child(4) > .mat-list-item-content > .mat-pseudo-checkbox'
          ).click();
          cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=&type=personal,organisation&page=0&page_size=24&category=1,2,3,4&sort_on=-donation.amount&status=1&target_amount=").then(res => {
            cy.get(
              ':nth-child(5) > .mat-list-item-content > .mat-pseudo-checkbox'
            ).click();
            cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=&type=personal,organisation&page=0&page_size=24&category=1,2,3,4,5&sort_on=-donation.amount&status=1&target_amount=").then(res => {
              cy.get(
                ':nth-child(6) > .mat-list-item-content > .mat-pseudo-checkbox'
              ).click();
              cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=&type=personal,organisation&page=0&page_size=24&category=1,2,3,4,5,6&sort_on=-donation.amount&status=1&target_amount=").then(res => {
                cy.get(
                  ':nth-child(7) > .mat-list-item-content > .mat-pseudo-checkbox'
                ).click();
                cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=&type=personal,organisation&page=0&page_size=24&category=1,2,3,4,5,6,7&sort_on=-donation.amount&status=1&target_amount=").then(res => {
                  cy.get(
                    ':nth-child(8) > .mat-list-item-content > .mat-pseudo-checkbox'
                  ).click();
                  cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=&type=personal,organisation&page=0&page_size=24&category=1,2,3,4,5,6,7,8&sort_on=-donation.amount&status=1&target_amount=").then(res => {
                    cy.get(
                      ':nth-child(9) > .mat-list-item-content > .mat-pseudo-checkbox'
                    ).click();
                    cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=&type=personal,organisation&page=0&page_size=24&category=1,2,3,4,5,6,7,8,9&sort_on=-donation.amount&status=1&target_amount=").then(res => {
                      cy.get(
                        ':nth-child(10) > .mat-list-item-content > .mat-pseudo-checkbox'
                      ).click();
                      cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=&type=personal,organisation&page=0&page_size=24&category=1,2,3,4,5,6,7,8,9,10&sort_on=-donation.amount&status=1&target_amount=").then(res => {
                        cy.get(
                          ':nth-child(11) > .mat-list-item-content > .mat-pseudo-checkbox'
                        ).click();
                        cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=&type=personal,organisation&page=0&page_size=24&category=1,2,3,4,5,6,7,8,9,10,11&sort_on=-donation.amount&status=1&target_amount=").then(res => {
                          cy.get(
                            ':nth-child(12) > .mat-list-item-content > .mat-pseudo-checkbox'
                          ).click();
                          cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=&type=personal,organisation&page=0&page_size=24&category=1,2,3,4,5,6,7,8,9,10,11,12&sort_on=-donation.amount&status=1&target_amount=").then(res => {
                            cy.get(
                              ':nth-child(13) > .mat-list-item-content > .mat-pseudo-checkbox'
                            ).click();
                            cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=&type=personal,organisation&page=0&page_size=24&category=1,2,3,4,5,6,7,8,9,10,11,12,13&sort_on=-donation.amount&status=1&target_amount=").then(res => {
                              cy.get(
                                ':nth-child(14) > .mat-list-item-content > .mat-pseudo-checkbox'
                              ).click();
                              cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=&type=personal,organisation&page=0&page_size=24&category=1,2,3,4,5,6,7,8,9,10,11,12,13,14&sort_on=-donation.amount&status=1&target_amount=").then(res => {
                                cy.get(
                                  ':nth-child(15) > .mat-list-item-content > .mat-pseudo-checkbox'
                                ).click();
                                cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=&type=personal,organisation&page=0&page_size=24&category=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15&sort_on=-donation.amount&status=1&target_amount=").then(res => {
                                  cy.get(
                                    ':nth-child(16) > .mat-list-item-content > .mat-pseudo-checkbox'
                                  ).click();
                                  cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=&type=personal,organisation&page=0&page_size=24&category=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16&sort_on=-donation.amount&status=1&target_amount=").then(res => {
                                    cy.get(
                                      ':nth-child(17) > .mat-list-item-content > .mat-pseudo-checkbox'
                                    ).click();
                                    cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=&type=personal,organisation&page=0&page_size=24&category=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17&sort_on=-donation.amount&status=1&target_amount=").then(res => {
                                      cy.get(
                                        ':nth-child(18) > .mat-list-item-content > .mat-pseudo-checkbox'
                                      ).click();
                                      cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=&type=personal,organisation&page=0&page_size=24&category=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18&sort_on=-donation.amount&status=1&target_amount=").then(res => {
                                        cy.get(
                                          ':nth-child(19) > .mat-list-item-content > .mat-pseudo-checkbox'
                                        ).click();
                                        cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=&type=personal,organisation&page=0&page_size=24&category=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19&sort_on=-donation.amount&status=1&target_amount=").then(res => {
                                          cy.get(
                                            ':nth-child(20) > .mat-list-item-content > .mat-pseudo-checkbox'
                                          ).click();
                                          cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=&type=personal,organisation&page=0&page_size=24&category=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20&sort_on=-donation.amount&status=1&target_amount=").then(res => {
                                            cy.get(
                                              ':nth-child(21) > .mat-list-item-content > .mat-pseudo-checkbox'
                                            ).click();
                                            cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=&type=personal,organisation&page=0&page_size=24&category=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21&sort_on=-donation.amount&status=1&target_amount=").then(res => {
                                              cy.get(
                                                ':nth-child(22) > .mat-list-item-content > .mat-pseudo-checkbox'
                                              ).click();
                                              cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=&type=personal,organisation&page=0&page_size=24&category=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22&sort_on=-donation.amount&status=1&target_amount=").then(res => {
                                              })
                                            })
                                          })
                                        })
                                      })
                                    })
                                  })
                                })
                              })
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  });
  it('It should have working clear all button', () => {
    cy.wait(1000);

    cy.get('#headerSearchFundraiser > span.mat-button-wrapper').should('be.visible');
    cy.get('#headerSearchFundraiser > span.mat-button-wrapper').click();
    cy.get('#mat-input-0').type('test');
    cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=test&type=personal,organisation&page=0&page_size=24&category=&sort_on=-donation.amount&status=1&target_amount=").then(res => {
      cy.get('#clear-all > .mat-focus-indicator > .mat-button-wrapper').should(
        'be.visible'
      );
      cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=&type=personal,organisation&page=0&page_size=24&category=&sort_on=-donation.amount&status=1&target_amount=")
      cy.get('#clear-all > .mat-focus-indicator > .mat-button-wrapper').click();
    })

  });

  it('It should have working Search check', () => {
    cy.wait(1000);

    cy.get('#headerSearchFundraiser > span.mat-button-wrapper').should('be.visible');
    cy.get('#headerSearchFundraiser > span.mat-button-wrapper').click();
    cy.get('#mat-input-0').type('test_fixed');
    cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=test_fixed&type=personal,organisation&page=0&page_size=24&category=&sort_on=-donation.amount&status=1&target_amount=").then(res => {
      cy.wait(1000);
      cy.get('#fundraizer_empty--image').should('be.visible');
    })
  });
  it('It should have working cards', () => {
    cy.wait(1000);

    cy.get('#headerSearchFundraiser > span.mat-button-wrapper').should('be.visible');
    cy.get('#headerSearchFundraiser > span.mat-button-wrapper').click();
    cy.request("GET", environment.fundraiser_url + "fundraiser/search/?filter=test&type=personal,organisation&page=0&page_size=24&category=&sort_on=-donation.amount&status=1&target_amount=").then(res => {
      cy.get(
        ':nth-child(2) > .mat-card > .mat-card-header > .mat-card-header-text > .mat-card-title'
      ).click();
    })
  });
});
