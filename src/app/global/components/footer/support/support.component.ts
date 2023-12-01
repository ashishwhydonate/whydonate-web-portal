import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { environment } from 'src/environments/environment.prod';

@Component({
	selector: 'app-support',
	templateUrl: './support.component.html',
	styleUrls: ['../footer.component.scss'],
})
/** *Support Component */
export class SupportComponent implements OnInit {
	public currentLanguageCode: string = '';
	homeUrl = 'https:whydonate.com';
	about = $localize`:@@footer_fundraiser_features_about_qr_url:about-whydonate-foundation`;
	blog = $localize`:@@footer_fundraiser_features_blog_qr_url:blog`;
	contact = $localize`:@@footer_fundraiser_features_contact_qr_url:contact-us`;
	tips = $localize`:@@footer_fundraiser_features_tips_url:fundraising-tips-and-tricks`;
	fees = $localize`:@@footer_fundraiser_features_fees_qr_url:fees`;
	feesHref: any;
	aboutHref: any;
	blogHref: any;
	contactHref: any;
	tipsHref: any;
	isBrowser: boolean = false;
	temp = 'https://whydonate.com/en/blog';
	constructor(
		private _accountService: AccountService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	ngOnInit(): void {
		this.currentLanguageCode = this._accountService.getLocaleId();
		if (this.currentLanguageCode == 'nl') {
			this.aboutHref = `${environment.homeUrl}/${this.about}`;
			this.blogHref = `${environment.homeUrl}/${this.blog}`;
			this.contactHref = `${environment.homeUrl}/${this.contact}`;
			this.tipsHref = `${environment.homeUrl}/${this.tips}`;
			this.feesHref = `${environment.homeUrl}/${this.fees}`;
		} else {
			this.aboutHref = `${environment.homeUrl}/${this.currentLanguageCode}/${this.about}`;
			this.blogHref = `${environment.homeUrl}/${this.currentLanguageCode}/${this.blog}`;
			this.contactHref = `${environment.homeUrl}/${this.currentLanguageCode}/${this.contact}`;
			this.tipsHref = `${environment.homeUrl}/${this.currentLanguageCode}/${this.tips}`;
			this.feesHref = `${environment.homeUrl}/${this.currentLanguageCode}/${this.fees}`;
		}
	}

	/** *url redirect for help desk */
	languageDetectorForHelpDesk(url: any) {
		if (this.isBrowser)
			window.location.href =
				url + '.whydonate.com' + '/' + this.currentLanguageCode;
	}
}
