/**This component section is displayed on main page in Organisation Fundraising */

import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Location, isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-online-fundraising-features',
	templateUrl: './online-fundraising-features.component.html',
	styleUrls: ['./online-fundraising-features.component.scss'],
})
/** *Online Fundraising Features Component */
export class OnlineFundraisingFeaturesComponent implements OnInit {
	router: any;
	recurringUrl = $localize`:@@organization_online_fundraising_features_recurring_translations:recurring-donations-giving`;
	customCrowdfundingUrl = $localize`:@@organization_online_fundraising_features_customCrowdFunding_translations:custom-crowdfunding-platform`;
	crowdFundingUrl = $localize`:@@organization_online_fundraising_features_crowdFunding:crowdfunding-fundraising`;
	fundraisingEuropeUrl = $localize`:@@organization_online_fundraising_features_fundraising_fundraisingEurope_translations:global-fundraising-europe`;
	isBrowser: boolean = false;

	constructor(
		router: Router,
		private location: Location,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		this.router = router;
	}

	ngOnInit(): void {}

	routeToRecurring() {
		if (this.isBrowser)
			window.location.href = 'https://whydonate.com/' + this.recurringUrl;
	}

	routeToCustomCrowdFunding() {
		if (this.isBrowser)
			window.location.href =
				'https://whydonate.com/' + this.customCrowdfundingUrl;
	}

	routeToCrowdfunding() {
		if (this.isBrowser)
			window.location.href = 'https://whydonate.com/' + this.crowdFundingUrl;
	}

	routeToFundraisingEurope() {
		if (this.isBrowser)
			window.location.href =
				'https://whydonate.com/' + this.fundraisingEuropeUrl;
	}
}
