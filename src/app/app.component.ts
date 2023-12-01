import { isPlatformBrowser } from '@angular/common';
import {
	AfterViewInit,
	Component,
	Inject,
	OnInit,
	PLATFORM_ID,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ScriptLoaderService } from './global/services/script-loader.service';
import { AccountService } from './pages/account/services/account.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
/** *App Component */
export class AppComponent implements OnInit, AfterViewInit {
	title: string = 'WhyDonate: Personal Crowdfunding and Charity Fundraising';
	isBrowser: boolean = false;
	router: Router;
	isLoggedIn: Boolean = false;

	constructor(
		@Inject(PLATFORM_ID) platformId: Object,
		private _scriptLoader: ScriptLoaderService,
		router: Router,
		public accountService: AccountService
	) {
		this.isBrowser = isPlatformBrowser(platformId);
		this.router = router;
	}

	ngAfterViewInit(): void {
		if (this.isBrowser) {
			/**
			 *load scripts (other scripts can be found in index.html)
			 */
			this._scriptLoader.loadCrisp();
			// this._scriptLoader.loadCookieConsent();
			// this.router.events.subscribe((e) => {
			// 	if (e instanceof NavigationEnd) {
			// 		if (e.url.includes('/fundraising') || e.url.includes('/donate')) {
			// 			if (window.innerWidth > 600) {
			// 				this._scriptLoader.loadCookieConsent();
			// 			}
			// 		} else {
			// 			this._scriptLoader.loadCookieConsent();
			// 		}
			// 	}
			// });
		}

		/*
		 * Disable Console on prod
		 */
		if (environment.production) {
			console.log = console.debug = console.error = () => {};
		}
	}

	ngOnInit(): void {
		this.accountService.isLoggedIn.subscribe((res) => {
			this.isLoggedIn = res;
		});
	}
}
