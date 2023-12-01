/**This component section is displayed on main page in Organisation as well as Personal Fundraising */

import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-platform-fee',
	templateUrl: './platform-fee.component.html',
	styleUrls: ['./platform-fee.component.scss'],
})
/** *Platform Fee Component */
export class PlatformFeeComponent implements OnInit {
	constructor() {}
	platformImage = $localize`:@@home_personal_platformFee_noPlatformCostsFullFeature_image:https://res.cloudinary.com/whydonate/image/upload/dpr_auto,f_auto,q_auto/whydonate-production/platform/visuals/home/zero_fee_en`;
	ngOnInit(): void {}
}
