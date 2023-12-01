import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { environment } from 'src/environments/environment.prod';

@Component({
	selector: 'app-copyright',
	templateUrl: './copyright.component.html',
	styleUrls: ['../footer.component.scss'],
})
/** *Copyright Component */
export class CopyrightComponent implements OnInit {
	termsAndCondition = $localize`:@@donation_form_terms&conditions:terms-and-conditions`;
	privacy = $localize`:@@footer_privacy_and_cookies_url:privacy-and-cookies`;
	termsHref: any;
	privacyHref: any;
	copyrightHref: any;
	currentLocale: string = '';
	constructor(
		private _accountService: AccountService
	) {}
	ngOnInit(): void {
		this.currentLocale = this._accountService.getLocaleId();
		if (this.currentLocale == 'nl') {
			this.termsHref = `${environment.homeUrl}/${this.termsAndCondition}`;
			this.privacyHref = `${environment.homeUrl}/${this.privacy}`;
			this.copyrightHref = `${environment.homeUrl}/${this.currentLocale}`;
		} else {
			this.termsHref = `${environment.homeUrl}/${this.currentLocale}/${this.termsAndCondition}`;
			this.privacyHref = `${environment.homeUrl}/${this.currentLocale}/${this.privacy}`;
			this.copyrightHref = `${environment.homeUrl}/${this.currentLocale}`;
		}
	}
}
