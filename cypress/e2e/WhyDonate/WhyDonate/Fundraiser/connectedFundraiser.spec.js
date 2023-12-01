import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';
import { generateDynamicFundraiserName } from 'cypress/e2e/WhyDonate/custom/helper.js';

describe('Connected Fundrasier Test', { tags: ['@accountTag'] }, () => {
  // Set the slug of the fundraiser
  const slug = 'hopeful-hearts-empowering-education-for-underprivileged-children'
  const email = 'yash@whydonate.nl'
  const password = 'Yash@123'
  const fundraiserName = generateDynamicFundraiserName();

  beforeEach(() => {
    // Visit the home URL and perform login to update fundraiser status
    cy.visitAndVerify(environment.homeUrl + '/');
    cy.request('POST', environment.ACCOUNT_API_V2 + 'account/user/login/', { email, password }).then((response) => {
      cy.wait(1000);
      // Update the fundraiser status using POST request
      cy.request({
        method: 'POST', url: `${environment.fundraiser_url}/fundraiser/update/status`, body: {
          slug: slug,
          is_draft: false,
          is_findable: true,
          is_opened: true
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'JWT ' + response.body.data.jwt,
        }
      })
    })
  })

  it('Create connected fundraiser', () => {
    cy.wait(2000);

    // Perform login to create a connected fundraiser
    cy.loginUser();

    // Perform login using a POST request
    cy.request('POST', environment.ACCOUNT_API_V2 + 'account/user/login/', { email, password }).then((response) => {
      cy.wait(1000);

      // Update the fundraiser status again
      cy.request({
        method: 'POST', url: `${environment.fundraiser_url}/fundraiser/update/status`, body: {
          slug: slug,
          is_draft: false,
          is_findable: true,
          is_opened: true
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'JWT ' + response.body.data.jwt,
        }
      }).then(setToDefaultResponse => {
        // Visit the connected fundraiser creation page
        cy.visitAndVerify(`${environment.homeUrl}/en/fundraising/connect/${slug}/`);
        cy.url().should('include', '/fundraising');

        cy.wait(2000);

        // Fill in connected fundraiser details;
        cy.get('#ConnectedFundraiserTitle').should('be.visible').type(`${fundraiserName}`);
        cy.get('#ConnectedFundraiserDescription').should('be.visible').type('Sign up on Whydonate and create your fundraiser in minutes. Sign up as a person or an organization, Share your fundraiser via Email, WhatsApp and other social media channels to reach as many donors as possible, The donations are paid out automatically to your bank account on a monthly basis without any platform cost        ');
        const filePath = 'waves-light-8k-5120x2880.jpg';
        cy.get('input[type="file"]').attachFile(filePath);
        cy.notDisabledAndVisible('#ConnectedFundraiserYouTubeButton')
        cy.get('#ConnectedFundraiserYouTubeLink').should('be.visible').type('https://www.youtube.com/watch?v=69SFwgWHUig');
        cy.notDisabledAndVisible('#ConnectedFundraiserYouTubeSaveButton')
        cy.wait(1000);
        cy.notDisabledAndVisible('#SaveButtonConnectFundraiserForm')
        cy.url().should('include', fundraiserName.toString().toLowerCase().replace(/ /g, "-"))
        cy.notDisabledAndVisible("#publish-button");
      })
    })
  })
})
