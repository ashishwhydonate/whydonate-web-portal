/**This component section is displayed on main page in Organisation Fundraising */

import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-organisation-banner',
	templateUrl: './organisation-banner.component.html',
	styleUrls: ['./organisation-banner.component.scss'],
})
/** *Organisation Banner Component */
export class OrganisationBannerComponent implements OnInit {
	organisationBannerImage = $localize`:@@home_organisation_organisationBanner_theSalvationArmy_image:https://res.cloudinary.com/whydonate/image/upload/h_70,dpr_auto,f_auto,q_auto/whydonate-production/platform/visuals/home/org_logos/sal_army_en`;

	constructor() {}

	ngOnInit(): void {}
}
