/**This component gives a list of all the fundraisers made by the registered user */

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-my-fundraisers-view',
	templateUrl: './my-fundraisers-view.component.html',
})
/** *My Fundraisers View Component */
export class MyFundraisersViewComponent implements OnInit {
	@Input() count!: number;
	@Input() myFundraisersDataList!: any;
	constructor(private router: Router
		) {}

	ngOnInit(): void {}

	routeToMyFundraisers() {
		this.router.navigate(['my-fundraisers']);
	}
}
