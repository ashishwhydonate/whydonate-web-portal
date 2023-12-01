import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';
import { getVideoIdFromUrl, generateDynamicFundraiserName } from 'cypress/e2e/WhyDonate/custom/helper.js';

describe('Create Fundraiser Tests', { tags: ['@fundraiserTag'] }, () => {

  beforeEach(() => {
    cy.visitAndVerify(environment.homeUrl + '/en');
    cy.wait(1000);
    cy.loginUser();
    cy.wait(1000)
  });

  it('It should have working create Fundraiser with image upload', () => {
    const slug = generateDynamicFundraiserName();
    cy.notDisabledAndVisible('#startFundraiserButton > button', false, true)
    cy.notDisabledAndVisible('.newFundraiser');
    cy.get('.fundraiserTitle').type(slug);
    cy.notDisabledAndVisible('.category');
    cy.notDisabledAndVisible('#mat-option-3 > .mat-option-text');
    cy.intercept('GET', `${environment.fundraiser_url}fundraiser/get?slug=${slug}&language=en`).as('apiRequest');
    cy.get('.location')
      .type('india')
      .request("GET", `${environment.fundraiser_url}location?query=i&language_code=en/`, { input_text: 'i', language: 'en' })
      .request("GET", `${environment.fundraiser_url}location?query=i&language_code=en/`, { input_text: 'in', language: 'en' })
      .request("GET", `${environment.fundraiser_url}location?query=i&language_code=en/`, { input_text: 'ind', language: 'en' })
      .request("GET", `${environment.fundraiser_url}location?query=i&language_code=en/`, { input_text: 'indi', language: 'en' })
      .request("GET", `${environment.fundraiser_url}location?query=i&language_code=en/`, { input_text: 'india', language: 'en' })
    cy.wait(2000);
    cy.get('.mat-option-text').first().should('be.visible').click({ force: true, multiple: true });
    cy.wait(1000);
    cy.notDisabledAndVisible('#saveBtn', true)

    cy.wait(2000)
    cy.notDisabledAndVisible('#add_image_create_fundraiser');
    const filePath = 'waves-light-8k-5120x2880.jpg';
    cy.get('#upload_image_input').attachFile(filePath).wait(2000);

    cy.notDisabledAndVisible('#save_image_create_fundraiser', true)
    cy.notDisabledAndVisible('#imagechangeButton')
    cy.notDisabledAndVisible('#change_image_create_fundraiser')
    cy.get('#change_upload_image_input').attachFile(filePath).wait(2000);
    cy.intercept('GET', `${environment.fundraiser_url}fundraiser/get?slug=${slug}&language=en`).as('getFundraiser');
    cy.notDisabledAndVisible('#save_image_create_fundraiser', true, true)
    cy.notDisabledAndVisible('#nextButtonUploadImage')
    cy.get('#saveBtn').scrollIntoView()
    cy.intercept('POST', `${environment.fundraiser_url}fundraiser/local/`).as('postFundraiser');
    cy.intercept('POST', `${environment.fundraiser_url}fundraiser/background`).as('postBackground');
    cy.get('.mat-stepper-next ').click({ force: true, multiple: true })
    cy.notDisabledAndVisible('#create_fundraiser_skip_button', true)
    cy.wait('@postFundraiser').then(res => {
      cy.checkAPIResponseSuccess(res).wait(2000)
    })
    cy.wait('@postBackground').then(res => {
      cy.checkAPIResponseSuccess(res).wait(2000)
    })
    cy.url().should('include', slug.toString().toLowerCase().replace(/ /g, "-"), { setTimeout: 20000 });

    cy.notDisabledAndVisible("#publish-button");
    cy.wait('@getFundraiser').then(res => {
      cy.checkAPIResponseSuccess(res)
      cy.get('#fundraiser_page_image')
        .should('have.attr', 'src')
        .then((src) => {
          // 'src' contains the URL of the image
          expect(res.response.body.data.result.background.image).to.equal(src);
        });
    })
  });

  it('It should have working create Fundraiser with video Upload', () => {
    const slug = generateDynamicFundraiserName();
    cy.notDisabledAndVisible('#startFundraiserButton > button', false, true)
    cy.notDisabledAndVisible('.newFundraiser')
    cy.get('.fundraiserTitle').type(slug);
    cy.notDisabledAndVisible('.category')
    cy.notDisabledAndVisible('#mat-option-3 > .mat-option-text')
    cy.intercept('GET', `${environment.fundraiser_url}fundraiser/get?slug=${slug}&language=en`).as('apiRequest');
    cy.get('.location')
      .type('india')
      .request("GET", `${environment.fundraiser_url}location?query=i&language_code=en/`, { input_text: 'i', language: 'en' })
      .request("GET", `${environment.fundraiser_url}location?query=i&language_code=en/`, { input_text: 'in', language: 'en' })
      .request("GET", `${environment.fundraiser_url}location?query=i&language_code=en/`, { input_text: 'ind', language: 'en' })
      .request("GET", `${environment.fundraiser_url}location?query=i&language_code=en/`, { input_text: 'indi', language: 'en' })
      .request("GET", `${environment.fundraiser_url}location?query=i&language_code=en/`, { input_text: 'india', language: 'en' })
    cy.wait(2000);
    cy.get('.mat-option-text').first().should('be.visible').click({ force: true, multiple: true });
    cy.wait(2000);
    cy.notDisabledAndVisible('#saveBtn', true)
    cy.wait(2000)
    cy.notDisabledAndVisible('#button_add_video_create_fundraiser')
    cy.notDisabledAndVisible('#VideoName', true)
    cy.get('#VideoName').type('https://www.youtube.com/watch?v=69SFwgWHUig', { force: true });
    cy.intercept('POST', `${environment.fundraiser_url}fundraiser/video/background`).as('uploadVideo');
    cy.notDisabledAndVisible('#save_video_iframe_save_button')
    cy.get('#create_fundraiser_Iframe').should('be.visible');
    cy.notDisabledAndVisible('#nextButtonUploadImage')
    cy.intercept('POST', `${environment.fundraiser_url}fundraiser/local/`).as('postFundraiser');
    cy.get('.mat-stepper-next ').click({ force: true, multiple: true })
    cy.intercept('GET', `${environment.fundraiser_url}fundraiser/get?slug=${slug}&language=en`).as('getFundraiser');
    cy.get('#create_fundraiser_email').type('primal@gmail.com');
    cy.get('#create_fundraiser_facebook').type('https://www.facebook.com/WhyDonate');
    cy.get('#create_fundraiser_twitter').type('https://twitter.com/whydonate');
    cy.get('#create_fundraiser_linked_in').type('https://www.linkedin.com/company/whydonate/');
    cy.notDisabledAndVisible('#create_fundraiser_save', true)
    cy.wait('@uploadVideo').then((response) => {
      cy.checkAPIResponseSuccess(response)
      // Assert the response body
      expect(response.response.body).to.deep.equal({
        "data": {
          "upload": true
        },
        "errors": {},
        "status": 200
      });
    });
    cy.wait(5000)
    cy.url().should('include', slug.toString().toLowerCase().replace(/ /g, "-"));
    cy.notDisabledAndVisible("#publish-button");
    cy.wait('@getFundraiser').then(res => {
      cy.checkAPIResponseSuccess(res)
      cy.get('#fundraiser_page_iframe')
        .should('have.attr', 'src')
        .then((src) => {
          const videoURL = res.response.body.data.result.background.video
          const videoIdFromData = getVideoIdFromUrl(videoURL)
          const videoIdFromSrc = getVideoIdFromUrl(src)
          expect(videoIdFromData).to.equal(videoIdFromSrc);
        });
    })
  });
})
