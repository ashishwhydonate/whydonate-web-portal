import { environment } from 'src/environments/environment.ts';
import 'cypress/e2e/WhyDonate/custom/customCommands.js';

describe('View Fundraiser Tests (account)', { tags: ['@accountTag'] }, () => {
	const language_code = 'en'
	const slug = 'en'

	beforeEach(() => {
		cy.visitAndVerify(environment.homeUrl + `/${language_code}`);
	});

	it('It should have working connect fundraiser button', () => {
		cy.intercept(
			'GET',
			`${environment.FUNDRAISER_API_V2}fundraiser/search/?type=personal,organisation&page=0`
		).as('searchRequest')
		cy.wait(2000);
		cy.notDisabledAndVisible('#headerSearchFundraiser > span.mat-button-wrapper')

		cy.wait("@searchRequest").then((res) => {
			cy.checkAPIResponseSuccess(res)
		});
		cy.notDisabledAndVisible('#fundraiser-card')
	});

	it('Checks if child backgorund is equal to parent and if yes then if it is visible', () => {
		cy.wait(2000);
		cy.intercept(
			'GET',
			`${environment.fundraiser_url}/fundraiser/search/?type=personal,organisation&page=0&filter=connected%20with`
		).as('searchRequest');

		cy.notDisabledAndVisible('#headerSearchFundraiser');
		cy.get('#mat-input-0').type('connected with');

		cy.wait('@searchRequest').then((interception) => {
			cy.checkAPIResponseSuccess(interception)

			const responseData = interception.response.body.data.results;
			responseData.map((res) => {
				if (res._source.parent_id) {
					const childBackgroundImage = res._source.background;
					const childSlug = res._source.slug;
					cy.request(
						`GET`,
						`${environment.fundraiser_url}/fundraiser/parent?id=${res._source.id}`
					).then((response) => {
						expect(response.status).to.eq(200);
						const parentData = response?.body?.data?.result?.media;
						const parentBackgroundImage = parentData?.background;
						if (childBackgroundImage === '') {
							cy.get(`#${childSlug}`).then(($el) => {
								const SourceImage = $el.attr('src');
								expect(SourceImage).to.eq(
									'https://res.cloudinary.com/whydonate/image/upload/w_400,h_200,dpr_auto,f_auto,q_auto/whydonate-staging/platform/visuals/fundraiser_default_bg'
								);

								expect($el.is(':visible')).to.be.true;
							});
						} else {
							cy.get(`#${childSlug}`).then(($el) => {
								const SourceImage = $el.attr('src');
								expect(SourceImage).not.to.eq(parentBackgroundImage);
								expect($el.is(':visible')).to.be.true;
							});
						}
					});
				}
			});
		});
	});

	it('Check the short donor list with donation list visible', () => {
		cy.intercept(
			'GET',
			`${environment.FUNDRAISER_API_V2}fundraiser/search/?type=personal,organisation&page=0`
		).as('searchRequest')
		cy.wait(2000);
		cy.notDisabledAndVisible('#headerSearchFundraiser > span.mat-button-wrapper')
		cy.wait("@searchRequest").then((res) => {
			cy.checkAPIResponseSuccess(res)
		});
		cy.notDisabledAndVisible('#fundraiser-card')
		cy.url().should('include', 'fundraising').then(url => {
			const slug = url.split('/fundraising/')[1];
			cy.intercept(
				'GET',
				`${environment.FUNDRAISER_API_V2}fundraiser/get?slug=${slug}&language=${language_code}`
			).as('getFundraiser')
			cy.intercept(
				'GET',
				`${environment.DONATION_API_V2}donation/orders/fundraising/local/short?slug=${slug}&language_code=${language_code}`
			).as('shortDonorList')
			cy.reload()
			cy.wait("@shortDonorList").then((shortDonorListResponse) => {
				cy.wait("@getFundraiser").then((getFundraiserResponse) => {
					cy.checkAPIResponseSuccess(getFundraiserResponse)
					cy.checkAPIResponseSuccess(shortDonorListResponse)
					cy.log(shortDonorListResponse.response.body.data.result.count)
					cy.log(getFundraiserResponse.response.body.data.result.donation.count)
					expect(Number(getFundraiserResponse?.response?.body?.data?.result?.donation?.count)).to.be.equal(Number(shortDonorListResponse?.response?.body?.data?.result?.count))
					if (getFundraiserResponse?.response?.body?.data?.result?.show_received_donations) {
						if (getFundraiserResponse?.response?.body?.data?.result?.donation?.count > 5) {
							cy.get('.donor-list-small')
								.should('have.length', 5)
							cy.notDisabledAndVisible('#short_donor_list_view_all')
						} else {
							cy.get('.donor-list-small')
								.should('have.length', getFundraiserResponse?.response?.body?.data?.result?.donation?.count)
						}
					} else {
						cy.get('.donor-list-small').should("not.be.visible")
					}

				});
			});
		});

	});

	it('Check the short donor list with donation list hidden', () => {
		const slug = 'turkey-earthquake-appeal'
		cy.intercept(
			'GET',
			`${environment.FUNDRAISER_API_V2}fundraiser/get?slug=${slug}&language=${language_code}`
		).as('getFundraiser')
		cy.intercept(
			'GET',
			`${environment.DONATION_API_V2}donation/orders/fundraising/local/short?slug=${slug}&language_code=${language_code}`
		).as('shortDonorList')
		cy.visitAndVerify(`${environment.homeUrl}/${language_code}/fundraising/${slug}`)
		cy.get('.donor-list-small').should("not.exist")
	});

});
