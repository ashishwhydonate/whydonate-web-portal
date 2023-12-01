/**This component section is displayed on main page in Organisation Fundraising */

import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
	selector: 'app-donation-plugin',
	templateUrl: './donation-plugin.component.html',
	styleUrls: ['./donation-plugin.component.scss'],
})
/** *Donation Plugin Component */
export class DonationPluginComponent implements OnInit {
	donationPluginImage = $localize`:@@home_organisation_donationPlugin_image:assets/Group 138.jpg`;
	donationPluginUrl = $localize`:@@home_organisation_donationPlugin_donateButton_url:donate-button-website`;
	isBrowser: boolean = false;
	constructor(@Inject(PLATFORM_ID) platformId: string) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	ngOnInit(): void {}

	routeToLearnMore() {
		if (this.isBrowser)
			window.location.href = 'https://whydonate.com/' + this.donationPluginUrl;
	}
}
// home_organisation_donationPlugin_donationButtonPlugin_image
