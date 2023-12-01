import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';

describe('Fundraiser Translations', { tags: ['@fundraiserTag'] }, () => {
    const language_code = 'en'
    beforeEach(() => {
        cy.visitAndVerify(environment.homeUrl + `/${language_code}`);
        cy.wait(2000);
        cy.loginUser();
    })

    it('Edit Title Translate', () => {
        // Assert the response status code
        cy.notDisabledAndVisible('#headerMyFundraisers');
        cy.wait(2000)
        cy.notDisabledAndVisible('#my-fundraiser-published-tab');
        // Click on the first fundraiser card
        cy.get('#myFundraiserCard').first().click();

        // Verify that the URL includes '/fundraising'
        cy.url().should('include', '/fundraising');
        cy.intercept('POST', `${environment.fundraiser_url}fundraiser/auto/translate`).as('translateRequest');
        cy.notDisabledAndVisible('#editFundraiserTitleTranslate');
        cy.get('mat-dialog-container').should('be.visible');

        cy.notDisabledAndVisible('#langSwitcher');

        cy.get('#languageChooser_nl_button').each(($btn) => {
            cy.wrap($btn).click({ force: true });
        });
        cy.notDisabledAndVisible('#autoTranslateButton');
        cy.wait('@translateRequest').then(res => {
            cy.checkAPIResponseSuccess(res)
            expect(res.response.body.data.translated_text).to.not.null
        })

        cy.notDisabledAndVisible('#langSwitcher');
        cy.get('#languageChooser_es_button').each(($btn) => {
            cy.wrap($btn).click({ force: true });
        });
        cy.notDisabledAndVisible('#autoTranslateButton');
        cy.wait('@translateRequest').then(res => {
            cy.checkAPIResponseSuccess(res)
            expect(res.response.body.data.translated_text).to.not.null
        })

        cy.notDisabledAndVisible('#langSwitcher');
        cy.get('#languageChooser_fr_button').each(($btn) => {
            cy.wrap($btn).click({ force: true });
        });
        cy.notDisabledAndVisible('#autoTranslateButton');
        cy.wait('@translateRequest').then(res => {
            cy.checkAPIResponseSuccess(res)
            expect(res.response.body.data.translated_text).to.not.null
        })

        cy.notDisabledAndVisible('#langSwitcher');
        cy.get('#languageChooser_de_button').each(($btn) => {
            cy.wrap($btn).click({ force: true });
        });
        cy.notDisabledAndVisible('#autoTranslateButton');
        cy.wait('@translateRequest').then(res => {
            cy.checkAPIResponseSuccess(res)
            expect(res.response.body.data.translated_text).to.not.null
        })

        cy.notDisabledAndVisible('#translate_button_save_all');
        cy.get('.mat-dialog-container').should('not.exist');

    });

    it('Edit Description Translate', () => {
        // Assert the response status code
        cy.get('#headerMyFundraisers').should('be.visible').click();
        cy.wait(2000)
        cy.notDisabledAndVisible('#my-fundraiser-published-tab')
        // Click on the first fundraiser card
        cy.get('#myFundraiserCard').first().click();

        // Verify that the URL includes '/fundraising'
        cy.url().should('include', '/fundraising');

        cy.intercept('POST', `${environment.fundraiser_url}fundraiser/auto/translate`).as('translateRequest');

        cy.notDisabledAndVisible('#editFundraiserDescriptionButton')
        cy.get('div.ng-star-inserted.ql-container.ql-snow div.ql-editor')
            .clear({ force: true })
            .type('Join us in making a difference! Our fundraiser is dedicated to supporting underprivileged children in their educational journey. With your generous contribution, we can provide books, stationery, and educational resources to these bright minds. Together, we can empower the next generation and help them achieve their dreams. Every dollar you donate brings us one step closer to a brighter future for these children');
        cy.notDisabledAndVisible('#editAboutSaveButton')
        cy.notDisabledAndVisible('#editFundraiserDescriptionTranslateButton')
        cy.get('mat-dialog-container').should('be.visible');
        cy.notDisabledAndVisible('#langSwitcher');
        cy.get('#languageChooser_nl_button').each(($btn) => {
            cy.wrap($btn).click({ force: true });
        });
        cy.notDisabledAndVisible('#autoTranslateButton');
        cy.wait('@translateRequest').then(res => {
            cy.checkAPIResponseSuccess(res)
            expect(res.response.body.data.translated_text).to.not.null
        })

        cy.notDisabledAndVisible('#langSwitcher');
        cy.get('#languageChooser_es_button').each(($btn) => {
            cy.wrap($btn).click({ force: true });
        });
        cy.notDisabledAndVisible('#autoTranslateButton');
        cy.wait('@translateRequest').then(res => {
            cy.checkAPIResponseSuccess(res)
            expect(res.response.body.data.translated_text).to.not.null
        })

        cy.notDisabledAndVisible('#langSwitcher');
        cy.get('#languageChooser_de_button').each(($btn) => {
            cy.wrap($btn).click({ force: true });
        });
        cy.notDisabledAndVisible('#autoTranslateButton');
        cy.wait('@translateRequest').then(res => {
            cy.checkAPIResponseSuccess(res)
            expect(res.response.body.data.translated_text).to.not.null
        })

        cy.notDisabledAndVisible('#langSwitcher');
        cy.get('#languageChooser_fr_button').each(($btn) => {
            cy.wrap($btn).click({ force: true });
        });
        cy.notDisabledAndVisible('#autoTranslateButton');
        cy.wait('@translateRequest').then(res => {
            cy.checkAPIResponseSuccess(res)
            expect(res.response.body.data.translated_text).to.not.null
        })

        cy.notDisabledAndVisible('#translate_button_save_all');
        cy.get('.mat-dialog-container').should('not.exist');
    });

})

