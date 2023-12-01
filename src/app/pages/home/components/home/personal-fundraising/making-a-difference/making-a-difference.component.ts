/**This component section is displayed on main page in Personal Fundraising */

import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/pages/home/services/home.service';

@Component({
	selector: 'app-making-a-difference',
	templateUrl: './making-a-difference.component.html',
	styleUrls: ['./making-a-difference.component.scss'],
})
/** *Making A Difference Component */
export class MakingADifferenceComponent implements OnInit {
	totalDonations: number = 0;
	totalPersonalFundraisers: number = 0;
	constructor(public _homeService: HomeService) {}

	ngOnInit(): void {
		/** * Get Facts */
		this._homeService.getFacts().subscribe((response: any) => {
			this.totalDonations = response.data?.total_donations;

			this.totalPersonalFundraisers = response.data?.total_fundriasers;
		});
	}
}
