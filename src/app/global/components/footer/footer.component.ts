import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router'; /** *added by chaitu */

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss'],
})
/** *Footer Component */
export class FooterComponent implements OnInit {
	hideFooter: boolean = false;
	constructor(
		private _router: Router,
		) {}
	ngOnInit(): void {
		this._router.events.subscribe((e) => {
			if (e instanceof NavigationEnd) {
				if (
					e.url.includes('/dashboard') ||
					e.url.includes('/account') ||
					e.url.includes('/profile') ||
					e.url.includes('/donate') ||
					e.url.includes('/connect') ||
					e.url.includes('/balance') ||
					e.url.includes('/my-fundraisers') ||
					e.url.includes('/custom-branding') ||
					e.url.includes('/create')
				) {
					this.hideFooter = true;
				} else {
					this.hideFooter = false;
				}
			}
		});
	}
}
