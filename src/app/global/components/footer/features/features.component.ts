import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { environment } from 'src/environments/environment.prod';

@Component({
	selector: 'app-features',
	templateUrl: './features.component.html',
	styleUrls: ['../footer.component.scss'],
})
/** *Features Component */
export class FeaturesComponent implements OnInit {
	public currentLanguageCode: string = '';
	homeUrl = 'https:whydonate.com';
	global = $localize`:@@footer_fundraiser_features_global_url:global-fundraising-europe`;
	customCrowdFunding = $localize`:@@footer_fundraiser_features_custom_crowdfunding_url:custom-crowdfunding-platform`;
	recurringDonation = $localize`:@@footer_fundraiser_features_recurring_url:recurring-donations-giving`;
	donationQr = $localize`:@@footer_fundraiser_features_donation_qr_url: donation-qr-code-fundraising-charity`;
	globalHref: any;
	customHref: any;
	recurringHref: any;
	donationHref: any;
	constructor(private _accountService: AccountService) {}

	ngOnInit(): void {
		this.currentLanguageCode = this._accountService.getLocaleId();

		if (this.currentLanguageCode == 'nl') {
			this.globalHref = `${environment.homeUrl}/${this.global}`;
			this.customHref = `${environment.homeUrl}/${this.customCrowdFunding}`;
			this.recurringHref = `${environment.homeUrl}/${this.recurringDonation}`;
			this.donationHref = `${environment.homeUrl}/${this.donationQr}`;
		} else {
			this.globalHref = `${environment.homeUrl}/${this.currentLanguageCode}/${this.global}`;
			this.customHref = `${environment.homeUrl}/${this.currentLanguageCode}/${this.customCrowdFunding}`;
			this.recurringHref = `${environment.homeUrl}/${this.currentLanguageCode}/${this.recurringDonation}`;
			this.donationHref = `${environment.homeUrl}/${this.currentLanguageCode}/${this.donationQr}`;
		}
	}
}
