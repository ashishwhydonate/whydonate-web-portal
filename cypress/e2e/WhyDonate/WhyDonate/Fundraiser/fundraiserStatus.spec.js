import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';

describe('Fundrasier Status Test (account)', { tags: ['@accountTag'] }, () => {

  const homeUrl = environment.homeUrl + '/en'
  var jwt = ""

  const slug = 'sustainable-lgbtq-rights-1697636028237'
  const slugforOpenandClose = 'empowering-elderly-care-1695392341934'
  const slugForEndDatePassed = 'innovative-education-for-all-1697635874404'
  beforeEach(() => {
    cy.visit(homeUrl);
    cy.request('POST', environment.ACCOUNT_API_V2 + 'account/user/login/', { email: 'primal@gmail.com', password: 'Rehman95' }).then((response) => {
      jwt = response.body.data.jwt
      cy.wait(2000);

      cy.loginUser();

    })
  })
  it('Check for end date passed', () => {
    cy.request("GET", `${environment.fundraiser_url}fundraiser/get?slug=${slugForEndDatePassed}&language=en`).then(res => {
      cy.log(res?.body?.data?.result?.end_date)
      cy.wrap(new Date().getTime()).should('be.greaterThan', new Date(res?.body?.data?.result?.end_date).getTime());
    })
    cy.intercept('GET', `${environment.fundraiser_url}fundraiser/get?slug=${slugForEndDatePassed}&language=en`).as('apiRequest');
    cy.visit(`${homeUrl}/fundraising/${slugForEndDatePassed}`);
    cy.wait(2000);
    cy.wait('@apiRequest').then((interception) => {
      // Assert the response status code
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body.data.result.slug).to.equal(slugForEndDatePassed);
    });
    cy.get('#donateButton').should('be.disabled');

    cy.visit(`${homeUrl}/donate/${slugForEndDatePassed}`).wait(1000);
    cy.url().should('include', homeUrl + '/donate');
    cy.get('#onetimeFirst').click();
    cy.get('#donateButtonBeforePayment').should('be.disabled');
  });
  
  it('Check for end date not passed', () => {
    cy.intercept('GET', `${environment.fundraiser_url}fundraiser/get?slug=${slug}&language=en`).as('apiRequest');
    cy.visit(`${homeUrl}/fundraising/${slug}`);
    cy.wait(2000);
    cy.wait('@apiRequest').then((interception) => {
      // Assert the response status code
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body.data.result.slug).to.equal(slug);
    });
    cy.wait(3000);
    cy.notDisabledAndVisible('#donateButton');

    cy.visit(`${homeUrl}/donate/${slug}`).wait(1000);
    cy.url().should('include', homeUrl + '/donate');
    cy.get('#onetimeFirst').click();
    cy.get('#donateButtonBeforePayment').should('not.be.disabled');
  });

  it('Turning On Closed Status', () => {
    cy.request({
      method: 'POST', url: environment.fundraiser_url + 'fundraiser/update/status', body: {
        slug: slugforOpenandClose,
        is_draft: false,
        is_findable: true,
        is_opened: true
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + jwt,
      }
    }).then(res => {
      cy.intercept('GET', `${environment.fundraiser_url}fundraiser/get?slug=${slugforOpenandClose}&language=en`).as('apiRequest');

      cy.visit(`${homeUrl}/fundraising/${slugforOpenandClose}`);
      cy.wait(2000);
      cy.wait('@apiRequest').then((interception) => {
        // Assert the response status code
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response.body.data.result.slug).to.equal(slugforOpenandClose);
      });

      // Turning On Closed Status
      cy.wait(2000);
      cy.intercept('POST', `${environment.fundraiser_url}fundraiser/update/status`).as('fundraiserStatus');
      cy.wait(2000)
      cy.notDisabledAndVisible('#editAmount');
      cy.wait(2000)
      cy.notDisabledAndVisible('#fundraiserstatus-Toggle');

      cy.wait('@fundraiserStatus').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);

        expect(interception.response.body).to.deep.equal({
          data: {
            status: true
          },
          errors: {},
          status: 200
        });
      });

      cy.get('#donateButton').should('be.disabled');
      cy.wait('@apiRequest').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response.body.data.result.slug).to.equal(slugforOpenandClose);
      });
      cy.visit(`${homeUrl}/donate/${slugforOpenandClose}`).wait(1000);
      cy.url().should('include', homeUrl + '/donate');
      cy.get('#donateButtonBeforePayment').should('be.disabled');
      cy.wait('@apiRequest').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response.body.data.result.slug).to.equal(slugforOpenandClose);
      });
    })
  });

  it('Turning On Open Status', () => {
    cy.request({
      method: 'POST', url: environment.fundraiser_url + 'fundraiser/update/status', body: {
        slug: slugforOpenandClose,
        is_draft: false,
        is_findable: true,
        is_opened: false
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + jwt,
      }
    }).then(res => {
      cy.intercept('GET', `${environment.fundraiser_url}fundraiser/get?slug=${slugforOpenandClose}&language=en`).as('apiRequest');
      cy.intercept('POST', `${environment.fundraiser_url}fundraiser/target_amount_form`).as('fundraiserStatus');

      cy.visit(`${homeUrl}/fundraising/${slugforOpenandClose}`);
      cy.wait(2000);
      cy.wait('@apiRequest').then((interception) => {
        // Assert the response status code
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response.body.data.result.slug).to.equal(slugforOpenandClose);
      });

      // Turning On Closed Status
      cy.wait(2000);
      cy.notDisabledAndVisible('#editAmount');
      cy.wait(2000)
      cy.notDisabledAndVisible('#fundraiserstatus-Toggle');
      cy.wait(2000)
      cy.notDisabledAndVisible('#SaveandApply');

      cy.wait('@fundraiserStatus').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);

        expect(interception.response.body).to.deep.equal({
          data: {
            status: true
          },
          errors: {},
          status: 200
        });
      });

      cy.get('#donateButton').should('not.be.disabled');
      cy.wait('@apiRequest').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response.body.data.result.slug).to.equal(slugforOpenandClose);
      });
      cy.visit(`${homeUrl}/donate/${slugforOpenandClose}`).wait(1000);
      cy.url().should('include', homeUrl + '/donate');
      cy.get('#onetimeFirst').click();
      cy.get('#donateButtonBeforePayment').should('not.be.disabled');
      cy.wait('@apiRequest').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response.body.data.result.slug).to.equal(slugforOpenandClose);
      });
    })
  });

  it('Turning On Draft Status', () => {
    cy.request({
      method: 'POST', url: environment.fundraiser_url + 'fundraiser/update/status', body: {
        slug: slugforOpenandClose,
        is_draft: false,
        is_findable: true,
        is_opened: true
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + jwt,
      }
    }).then(res => {
      cy.intercept('GET', `${environment.fundraiser_url}fundraiser/get?slug=${slugforOpenandClose}&language=en`).as('apiRequest');

      cy.visit(`${homeUrl}/fundraising/${slugforOpenandClose}`);
      cy.wait(2000);
      cy.wait('@apiRequest').then((interception) => {
        // Assert the response status code
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response.body.data.result.slug).to.equal(slugforOpenandClose);
      });

      // Turning On Closed Status
      cy.wait(2000);
      cy.intercept('POST', `${environment.fundraiser_url}fundraiser/update/status`).as('fundraiserStatus');
      cy.notDisabledAndVisible('#editAmount');
      cy.wait(2000)
      cy.notDisabledAndVisible('#DraftButton');
      cy.wait('@fundraiserStatus').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);

        expect(interception.response.body).to.deep.equal({
          data: {
            status: true
          },
          errors: {},
          status: 200
        });
      });
      cy.get('#DraftButton').should('be.disabled')
      cy.notDisabledAndVisible('#goBackButton');
      cy.get('#donateButton').should('be.disabled')
      cy.wait('@apiRequest').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response.body.data.result.slug).to.equal(slugforOpenandClose);
      });
      cy.get('#headerMenu').click();
      cy.get('#headerLogout').click();
      cy.reload()
      cy.url().should('include', 'fundraising/fundraiser-is-draft');
      cy.visit(`${homeUrl}/donate/${slugforOpenandClose}`).wait(1000);

      cy.get('#onetimeFirst').click();
      cy.get('#donateButtonBeforePayment').should('be.disabled');
      cy.wait('@apiRequest').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response.body.data.result.slug).to.equal(slugforOpenandClose);
      });
    })
  });

  it('Turning On Published Status', () => {
    cy.request({
      method: 'POST', url: environment.fundraiser_url + 'fundraiser/update/status', body: {
        slug: slug,
        is_draft: true,
        is_findable: true,
        is_opened: true
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + jwt,
      }
    }).then(res => {
      cy.intercept('GET', `${environment.fundraiser_url}fundraiser/get?slug=${slug}&language=en`).as('apiRequest');
      cy.intercept('POST', `${environment.fundraiser_url}fundraiser/publish`).as('fundraiserStatus');

      cy.visit(`${homeUrl}/fundraising/${slug}`);
      cy.wait(2000);
      cy.wait('@apiRequest').then((interception) => {
        // Assert the response status code
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response.body.data.result.slug).to.equal(slug);
      });

      cy.wait(2000);
      cy.notDisabledAndVisible('#publish-button');

      cy.wait('@fundraiserStatus').then((interception) => {
        cy.checkAPIResponseSuccess(interception)
      });

      cy.get('#donateButton').should('not.be.disabled');
      cy.wait('@apiRequest').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response.body.data.result.slug).to.equal(slug);
      });
      cy.get('#headerMenu').click();
      cy.get('#headerLogout').click();
      cy.reload().wait(1000)
      cy.get('#donateButton').should('not.be.disabled');
    })
  });

  it('Turning Off Visible Status', () => {
    cy.request({
      method: 'POST', url: environment.fundraiser_url + 'fundraiser/update/status', body: {
        slug: slugforOpenandClose,
        is_draft: false,
        is_findable: true,
        is_opened: true
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + jwt,
      }
    }).then(res => {

      cy.intercept('GET', `${environment.fundraiser_url}fundraiser/get?slug=${slugforOpenandClose}&language=en`).as('apiRequest');

      cy.visit(`${homeUrl}/fundraising/${slugforOpenandClose}`);
      cy.wait(2000);
      cy.wait('@apiRequest').then((interception) => {
        // Assert the response status code
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response.body.data.result.slug).to.equal(slugforOpenandClose);
      });

      cy.wait(2000);
      cy.intercept('POST', `${environment.fundraiser_url}fundraiser/update/status`).as('fundraiserStatus');
      cy.notDisabledAndVisible('#editAmount');
      cy.wait(2000)
      cy.notDisabledAndVisible('#FindableToggle');
      cy.notDisabledAndVisible('#SaveandApply');
      cy.notDisabledAndVisible('#goBackButton');

      cy.wait('@fundraiserStatus').then((interception) => {
        expect(interception?.response?.statusCode).to.equal(200);

        expect(interception.response.body).to.deep.equal({
          data: {
            status: true
          },
          errors: {},
          status: 200
        });
      });


      cy.get('#donateButton').should('not.be.disabled');
      cy.wait('@apiRequest').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response?.body?.data?.result?.slug).to.equal(slugforOpenandClose);
      });
      cy.get('#headerMenu').click();
      cy.get('#headerLogout').click();
      cy.reload()
      cy.get('#donateButton').should('not.be.disabled');
      cy.get('#headerSearchFundraiser').click()
      cy.get('#search-header').type('empowering-elderly-care-1695392341934');
      cy.get('mat-card-title').first()
        .should('not.contain', 'There doesn\'t seem to be a clear translation for the given text as it appears to be a combination of words and numbers without proper sentence structure.');
    })
  });
  it('Turning On Visible Status', () => {
    cy.request({
      method: 'POST', url: environment.fundraiser_url + 'fundraiser/update/status', body: {
        slug: slugforOpenandClose,
        is_draft: false,
        is_findable: false,
        is_opened: true
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + jwt,
      }
    }).then(res => {

      cy.intercept('GET', `${environment.fundraiser_url}fundraiser/get?slug=${slugforOpenandClose}&language=en`).as('apiRequest');

      cy.visit(`${homeUrl}/fundraising/${slugforOpenandClose}`);
      cy.wait(2000);
      cy.wait('@apiRequest').then((interception) => {
        // Assert the response status code
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response.body.data.result.slug).to.equal(slugforOpenandClose);
      });

      cy.wait(2000);
      cy.intercept('POST', `${environment.fundraiser_url}fundraiser/target_amount_form`).as('fundraiserStatus');
      cy.notDisabledAndVisible('#editAmount');
      cy.wait(2000)
      cy.notDisabledAndVisible('#FindableToggle');
      cy.notDisabledAndVisible('#SaveandApply');
      cy.notDisabledAndVisible('#goBackButton');


      cy.get('#donateButton').should('not.be.disabled');
      cy.wait('@apiRequest').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response?.body?.data?.result?.slug).to.equal(slugforOpenandClose);
      });
      cy.get('#headerMenu').click();
      cy.get('#headerLogout').click();
      cy.reload()
      cy.get('#donateButton').should('not.be.disabled');
      cy.get('#headerSearchFundraiser').click()
      cy.get('#search-header').type(slugforOpenandClose);
      cy.get('mat-card-title').first()
        .should('not.contain', 'There doesn\'t seem to be a clear translation for the given text as it appears to be a combination of words and numbers without proper sentence structure.');
    })
  });

})

