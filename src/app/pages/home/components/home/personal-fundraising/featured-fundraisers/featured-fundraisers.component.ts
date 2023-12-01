/**This component display Featured Fundraisers on the home page of Personal Fundraising */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FundraiserCardData } from '../../../../../../shared/interfaces/fundraiser-card-interface';
import { FundraiserCardService } from '../../../../../../shared/services/fundraiser-card.service';

@Component({
	selector: 'app-personal-funsraising-featured-fundraisers',
	templateUrl: './featured-fundraisers.component.html',
	styleUrls: ['./featured-fundraisers.component.scss'],
})
/** *Featured Fundraisers Component */
export class FeaturedFundraisersComponent implements OnInit {
	_fundraiserCardService: FundraiserCardService;
	_fundraiserCardData: FundraiserCardData;
	fundraiserdata: any;
	// donation_progress_percentage: any;
	
	constructor(
		_fundraiserCardService: FundraiserCardService,
		private fundraiserService: FundraiserCardService,

		private route: Router
	) {
		this._fundraiserCardService = _fundraiserCardService;
		this._fundraiserCardData = this._fundraiserCardService.getObjWithData();
	}
	
	ngOnInit(): void {
		this.fundraiserService.fundraiser().subscribe((res: any) => {
			this.fundraiserdata = res.data.results;
			// this.donation_progress_percentage = Math.floor(
			// 	(this.donation_received_amount / this.donation_target_amount) * 100
			// );
		});
	}

	fundraiserSlug(slug: any) {
		this.route.navigate(['/fundraising/', slug]);
	}

	toSearchFromHome() {
		this.route.navigate(['search']);
	}
}
