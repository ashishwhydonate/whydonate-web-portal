import { isPlatformBrowser } from '@angular/common';
import {
	Component,
	OnInit,
	OnDestroy,
	Input,
	Inject,
	PLATFORM_ID,
} from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { Tools } from 'src/utilities/tools';
@Component({
	selector: 'app-language-chooser',
	templateUrl: './language-chooser.component.html',
	styleUrls: ['./language-chooser.component.scss'],
})
/** *Language Chooser Component */
export class LanguageChooserComponent implements OnInit {
	locale: string = 'nl';
	isBrowser: boolean = false;
	languageIcon: string =
		'https://res.cloudinary.com/whydonate/image/upload/v1689152641/whydonate-production/platform/svg-icons/' +
		'nl' +
		'.png';
	@Input() languageCode: string = '';
	constructor(
		public router: Router,
		public accountService: AccountService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	ngOnInit(): void {
		this.setLanguageInFooter();
	}

	ngOnDestroy() {}

	changeLanguage(language: string) {
		if (this.isBrowser) Tools.setUserlanguage(language);
		/** *get current route */
		if (this.isBrowser)
			switch (true) {
				case language.includes('nl'):
					window.location.href = '/nl' + this.router.url;
					break;
				case language.includes('en'):
					window.location.href = '/en' + this.router.url;
					break;
				case language.includes('es'):
					window.location.href = '/es' + this.router.url;
					break;
				case language.includes('de'):
					window.location.href = '/de' + this.router.url;
					break;
				case language.includes('fr'):
					window.location.href = '/fr' + this.router.url;
					break;
				default:
					window.location.href = '/nl' + this.router.url;
			}
		this.setLanguageInFooter();
	}
	/** *set current route */
	setLanguageInFooter() {
		if (this.isBrowser)
			switch (true) {
				case window.location.pathname.includes('/nl'):
					this.locale = 'nl';
					break;
				case window.location.pathname.includes('/es'):
					this.locale = 'es';
					break;
				case window.location.pathname.includes('/de'):
					this.locale = 'de';
					break;
				case window.location.pathname.includes('/fr'):
					this.locale = 'fr';
					break;
				case window.location.pathname.includes('/en'):
					this.locale = 'en';
					break;
				default:
					this.locale = 'nl';
					break;
			}

		this.languageIcon =
			'https://res.cloudinary.com/whydonate/image/upload/v1689152641/whydonate-production/platform/svg-icons/' +
			this.locale?.substring(0, 2).toLowerCase() +
			'.png';
	}
}
