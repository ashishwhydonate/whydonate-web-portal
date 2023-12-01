import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';


describe('Test Fundraiser Category Translation', () => {
    const slug = `hopeful-hearts-empowering-education-for-underprivileged-children`

    it('Checks category translation for ES', () => {
        cy.intercept('GET', `${environment.fundraiser_url}/fundraiser/get?slug=${slug}&language=es`).as('fundraiserApi');
        cy.visitAndVerify(`${environment.homeUrl}/es/fundraising/${slug}/`); //visits the ES page of website
        cy.wait('@fundraiserApi').then((interception) => {
            cy.checkAPIResponseSuccess(interception)
            expect(interception.response.body.data.result).to.not.null;
            const responseData = interception.response.body.data;
            const categoryTranslationEs = responseData.result.category.name_es; //stores the ES Category Translation

            cy.get('#fundraisertitleCategory').invoke('text').then((text) => {

                const categoryConstantUI = text.trim(); // Stores the UI Category Text
                if (categoryTranslationEs.length > 10) {
                    // Trim CategoryTranslationEs to 10 characters + '...'
                    const trimmedCategoryEs = categoryTranslationEs.substring(0, 10) + '...';

                    // Compare the trimmed result with the expected value
                    expect(trimmedCategoryEs).to.equal(categoryConstantUI);
                } else {
                    // If it's already 10 characters or less, no trimming needed
                    expect(categoryConstantUI).to.equal(categoryTranslationEs);
                }
            })
        })

    });
    //closing of es

    it('Checks category translation for EN', () => {
        cy.intercept('GET', `${environment.fundraiser_url}/fundraiser/get?slug=${slug}&language=en`).as('fundraiserApi');
        cy.visitAndVerify(`${environment.homeUrl}/en/fundraising/${slug}/`); //visits the EN page of website
        cy.wait('@fundraiserApi').then((interception) => {
            cy.checkAPIResponseSuccess(interception)
            expect(interception.response.body.data.result).to.not.null;
            const responseData = interception.response.body.data;
            const categoryTranslationEn = responseData.result.category.name_en; //stores the EN Category Translation
            cy.get('#fundraisertitleCategory').invoke('text').then((text) => {
                const categoryConstantUI = text.trim(); // Stores the UI Category Text
                if (categoryTranslationEn.length > 10) {
                    // Trim CategoryTranslationEs to 10 characters + '...'
                    const trimmedCategoryEn = categoryTranslationEn.substring(0, 10) + '...';

                    // Compare the trimmed result with the expected value
                    expect(trimmedCategoryEn).to.equal(categoryConstantUI);
                } else {
                    // If it's already 10 characters or less, no trimming needed
                    expect(categoryConstantUI).to.equal(categoryTranslationEn);
                }
            })
        })
    });
    // closing of EN

    it('Checks category translation for NL', () => {
        cy.intercept('GET', `${environment.fundraiser_url}/fundraiser/get?slug=${slug}&language=nl`).as('fundraiserApi');
        cy.visitAndVerify(`${environment.homeUrl}/nl/fundraising/${slug}/`); //visits the NL page of website
        cy.wait('@fundraiserApi').then((interception) => {
            cy.checkAPIResponseSuccess(interception)
            expect(interception.response.body.data.result).to.not.null;
            const responseData = interception.response.body.data;
            const categoryTranslationNl = responseData.result.category.name_nl; //stores the NL Category Translation
            cy.log(categoryTranslationNl)
            cy.get('#fundraisertitleCategory').invoke('text').then((text) => {
                const categoryConstantUI = text.trim(); // Stores the UI Category Text
                if (categoryTranslationNl.length > 10) {
                    // Trim CategoryTranslationEs to 10 characters + '...'
                    const trimmedCategoryNl = categoryTranslationNl.substring(0, 10) + '...';

                    // Compare the trimmed result with the expected value
                    expect(trimmedCategoryNl).to.equal(categoryConstantUI);
                } else {
                    // If it's already 10 characters or less, no trimming needed
                    expect(categoryConstantUI).to.equal(categoryTranslationNl);
                }
            })
        })
    });

    //closing of nl
    it('Checks category translation for DE', () => {
        cy.intercept('GET', `${environment.fundraiser_url}/fundraiser/get?slug=${slug}&language=de`).as('fundraiserApi');
        cy.visitAndVerify(`${environment.homeUrl}/de/fundraising/${slug}/`); //visits the DE page of website
        cy.wait('@fundraiserApi').then((interception) => {
            cy.checkAPIResponseSuccess(interception)
            expect(interception.response.body.data.result).to.not.null;
            const responseData = interception.response.body.data;
            const categoryTranslationDe = responseData.result.category.name_de; //stores the DE Category Translation
            cy.get('#fundraisertitleCategory').invoke('text').then((text) => {
                const categoryConstantUI = text.trim(); // Stores the UI Category Text
                if (categoryTranslatioDe.length > 10) {
                    // Trim CategoryTranslationEs to 10 characters + '...'
                    const trimmedCategoryDe = categoryTranslationDe.substring(0, 10) + '...';

                    // Compare the trimmed result with the expected value
                    expect(trimmedCategoryDe).to.equal(categoryConstantUI);
                } else {
                    // If it's already 10 characters or less, no trimming needed
                    expect(categoryConstantUI).to.equal(categoryTranslationDe);
                }
            })
        })
    });

    //closing of de

    it('Checks category translation for FR', () => {

        cy.intercept('GET', `${environment.fundraiser_url}/fundraiser/get?slug=${slug}&language=fr`).as('fundraiserApi');
        cy.visitAndVerify(`${environment.homeUrl}/fr/fundraising/${slug}/`); //visits the FR page of website
        cy.wait('@fundraiserApi').then((interception) => {
            cy.checkAPIResponseSuccess(interception)
            expect(interception.response.body.data.result).to.not.null;
            const responseData = interception.response.body.data;
            const categoryTranslationFr = responseData.result.category.name_fr; //stores the FR Category Translation
            cy.get('#fundraisertitleCategory').invoke('text').then((text) => {
                const categoryConstantUI = text.trim(); // Stores the UI Category Text
                if (categoryTranslationFr.length > 10) {
                    // Trim CategoryTranslationEs to 10 characters + '...'
                    const trimmedCategoryFr = categoryTranslationFr.substring(0, 10) + '...';

                    // Compare the trimmed result with the expected value
                    expect(trimmedCategoryFr).to.equal(categoryConstantUI);
                } else {
                    // If it's already 10 characters or less, no trimming needed
                    expect(categoryConstantUI).to.equal(categoryTranslationFr);
                }
            })
        })
    });
    // closing of fr
});
//closing  of "describe"