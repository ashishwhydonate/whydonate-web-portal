/**This component section is displayed on main page in Personal Fundraising */

import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/pages/search/services/search.service';
import { FundraiserCardData } from 'src/app/shared/interfaces/fundraiser-card-interface';

@Component({
	selector: 'app-starting-a-fundraiser',
	templateUrl: './starting-a-fundraiser.component.html',
	styleUrls: ['./starting-a-fundraiser.component.scss'],
})
/** *StartingAFundraiserComponent */
export class StartingAFundraiserComponent implements OnInit {
	mobile: boolean | undefined;
	isBrowser: boolean = false;
	_fundraiserCardDataList!: {
		slug: string;
		fundraiserCardData: FundraiserCardData;
	}[];
	startAFundraiserIphoneImage = $localize`:@@home_individual_howitworks_mobile_image:https://res.cloudinary.com/whydonate/image/upload/dpr_auto,f_auto,q_auto/whydonate-production/platform/visuals/Mobile-donate-ES`;

	constructor(
		private _searchService: SearchService,
		public router: Router,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	ngOnInit(): void {
		/** *Calling fundraisers for trending fundraisers */
		this._searchService.getPopularFundraiser().subscribe((response) => {
			this._fundraiserCardDataList =
				this._searchService.getSearchFundraiserCardDataListElasticSearch(
					(response as any).data
				);
		});
		if (this.isBrowser)
			if (window.screen.width <= 420) {
				// 768px portrait
				this.mobile = false;
			}
	}

	/*
	 * Route to search
	 */
	routeToSearch() {
		this.router.navigate(['search']);
	}
}
