/**This component section is displayed on main page in Personal Fundraising */

import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
	selector: 'app-fundraising-site',
	templateUrl: './fundraising-site.component.html',
	styleUrls: ['./fundraising-site.component.scss'],
})
/** *Fundraising Site Component */
export class FundraisingSiteComponent implements OnInit {
	fundraisingSiteImage = $localize`:@@home_organisation_donationPlugin_donationButtonPlugin_image:https://res.cloudinary.com/whydonate/image/upload/dpr_auto,f_auto,q_auto/whydonate-production/platform/visuals/Web-mobile-fundraiser-EN`;
	whydonatePlatformUrl = $localize`:@@header_crowfunding_label:crowdfunding-fundraising`;
	isBrowser: boolean = false;

	constructor(@Inject(PLATFORM_ID) platformId: string) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	ngOnInit(): void {}
	//http://whydonate.com/nl/crowdfunding-fundraising
	languageForWhydonatePlatform() {
		if (this.isBrowser)
			window.location.href =
				'https://whydonate.com/' + this.whydonatePlatformUrl;
	}
}
