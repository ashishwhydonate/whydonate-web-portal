import 'cypress/e2e/WhyDonate/custom/customCommands.js';

describe('Donation on Script Plugin', { tags: ['@plugin'] }, () => {
    beforeEach(() => {
        cy.visitAndVerify('https://whydonate.com/en/blog/test-script-plugin/');
    });

    it('Basic Donate', () => {
        cy.notDisabledAndVisible(`.donate-btn`)
        cy.get(`.first-name-field`).type("Yash")
        cy.get(`.last-name-field`).type("Jain")
        cy.get(`.email-field`).type("yash@whydonate.com")
        cy.get(`.donate-btn-in-form`).should("not.be.disabled").should("be.visible")
    });

    it('Check Dropdown', () => {
        cy.notDisabledAndVisible(`.donate-btn`)
        cy.get('.custom-select').click(); // Open the dropdown
        // Click on each option one by one
        cy.get('.select-items div').first().click();
        cy.get('.custom-select').click(); // Open the dropdown
        cy.get('.select-items div').eq(2).click();
        cy.get('.custom-select').click(); // Open the dropdown
        cy.get('.select-items div').eq(3).click();
        cy.get(`.first-name-field`).should("not.be.disabled").should("be.visible").type("Yash")
        cy.get(`.last-name-field`).should("not.be.disabled").should("be.visible").type("Jain")
        cy.get(`.email-field`).should("not.be.disabled").should("be.visible").type("yash@whydonate.com")
        cy.notDisabledAndVisible(`.donate-anonymous`)
        cy.get(`.donate-btn-in-form`).should("not.be.disabled").should("be.visible")
    });

    it('Check All the Payment buttons and check other-amount', () => {
        cy.notDisabledAndVisible(`.donate-btn`)
        cy.notDisabledAndVisible(`.second-amount-div`)
        cy.notDisabledAndVisible(`.third-amount-label`)
        cy.notDisabledAndVisible(`.forth-amount-label`)
        cy.notDisabledAndVisible(`.other-amount-label`)
        cy.get('.other-amount-input-div input').should("not.be.disabled").should("be.visible").type("30")
        cy.get(`.first-name-field`).should("not.be.disabled").should("be.visible").type("Yash")
        cy.get(`.last-name-field`).should("not.be.disabled").should("be.visible").type("Jain")
        cy.get(`.email-field`).should("not.be.disabled").should("be.visible").type("yash@whydonate.com")
        cy.get(`.donate-btn-in-form`).should("not.be.disabled").should("be.visible")
    });

    it('Check Close Button', () => {
        cy.notDisabledAndVisible(`.donate-btn`)
        cy.notDisabledAndVisible(`.close`)
    });

});
