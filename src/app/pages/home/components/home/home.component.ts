/**This coponent comes into play as soon as whydonate.in is loaded in the browser */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { HomeService } from '../../services/home.service';

/**
 * This component is responsible for Home Page.
 */

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	/** *PAGE LOADER */
	isContentLoading: boolean = true;

	/** *GLOBAL VARIABLES------------------------------ */
	_activatedRoute: any;
	_router: any;
	isPersonalFundraising: boolean = true;
	isOrganisation: boolean = false;

	/** *CONSTRUCTOR---------------------------------- */
	constructor(
		_activatedRoute: ActivatedRoute,
		_router: Router,
		_notificationService: NotificationService
	) {
		this._activatedRoute = _activatedRoute;
		this._router = _router;
	}

	ngOnInit(): void {
		/** *CHECK IF USER IS COMING FOR ORGANISATION */
		if (this._router.url.includes('organisation')) {
			this.isPersonalFundraising = false;
			this.isOrganisation = true;
		}

		this.isContentLoading = false;
	}

	/**
	 * Function to navigate to personal fundraising.
	 */
	routeToPersonalFundraising() {
		this._router.navigate(['']);
	}
	/**
	 * Function to navigate to organisation fundraising.
	 */
	routeToOrganisation() {
		this._router.navigate(['organisation']);
	}
}
