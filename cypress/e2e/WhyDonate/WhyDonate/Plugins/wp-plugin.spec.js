import 'cypress/e2e/WhyDonate/custom/customCommands.js';

describe('Donation on WordPress Plugin', { tags: ['@pulgin'] }, () => {
    beforeEach(() => {
        cy.visitAndVerify('https://whydonate.in/nl/blog/wp-test-plugin/');
    });
    const array = [{ title: "Donate", amount: "25", id: '1' }, { title: "Donate", amount: "50", id: '2' }, { title: "Donate", amount: "75", id: '3' }, { title: "Donate", amount: "100", id: '4' }]
    array.forEach(test => {
        it(`${test.title} ${test.amount}`, () => {
            cy.wait(3000)
            cy.notDisabledAndVisible(`#apreview-donate-btn-dnuoh`)
            cy.get(`#preview-card-dnuoh`).should("be.visible")
            cy.notDisabledAndVisible(`#amount-boundary-box-${test.id}-s-dnuoh`)
            cy.get(`#firstname-dnuoh`).should("not.be.disabled").should("be.visible").type("Yash")
            cy.get(`#lastname-dnuoh`).should("not.be.disabled").should("be.visible").type("Jain")
            cy.get(`#email-dnuoh`).should("not.be.disabled").should("be.visible").type("yash@whydonate.com")
            cy.intercept('POST', `https://donation.whydonate.workers.dev/donation/order/`).as('order');
            cy.notDisabledAndVisible(`#preview-donate-btn-dnuoh`)
            cy.wait('@order').then((response) => {
                expect(response.request.body.amount).equal(test.amount)
                expect(response.request.body.is_anonymous).equal(false)
                cy.checkAPIResponseSuccess(response)
            });
        });
    })

    it('Donate anonymously', () => {
        cy.wait(3000)
        cy.notDisabledAndVisible(`#apreview-donate-btn-dnuoh`)
        cy.get(`#preview-card-dnuoh`).should("be.visible")
        cy.notDisabledAndVisible(`#amount-boundary-box-1-s-dnuoh`)
        cy.get(`#firstname-dnuoh`).should("not.be.disabled").should("be.visible").type("Yash")
        cy.get(`#lastname-dnuoh`).should("not.be.disabled").should("be.visible").type("Jain")
        cy.get(`#email-dnuoh`).should("not.be.disabled").should("be.visible").type("yash@whydonate.com")
        cy.intercept('POST', `https://donation.whydonate.workers.dev/donation/order/`).as('order');
        cy.notDisabledAndVisible(`#is-anonymous-dnuoh`)
        cy.notDisabledAndVisible(`#preview-donate-btn-dnuoh`)
        cy.wait('@order').then((response) => {
            expect(response.request.body.amount).equal('25')
            expect(response.request.body.is_anonymous).equal(true)
            cy.checkAPIResponseSuccess(response)
        });
    });
    it('Check the close button', () => {
        cy.wait(3000)
        cy.notDisabledAndVisible(`#apreview-donate-btn-dnuoh`)
        cy.get(`#preview-card-dnuoh`).should("be.visible")
        cy.notDisabledAndVisible(`#dnuoh`)
        cy.get(`#preview-card-dnuoh`).should("not.be.visible")

    });
});
