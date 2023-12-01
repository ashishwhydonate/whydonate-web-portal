import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { environment } from 'src/environments/environment.prod';

@Component({
	selector: 'app-fundraiser-for',
	templateUrl: './fundraiser-for.component.html',
	styleUrls: ['../footer.component.scss'],
})
/** *Fundraiser For Component */
export class FundraiserForComponent implements OnInit {
	public currentLanguageCode: string = '';
	subject = new Subject<string>();
	homeUrl = 'https:whydonate.com';
	medical = $localize`:@@footer_fundraiser_for_medicalFundraiser_url:medical-fundraising`;
	fundraisingForEducation = $localize`:@@footer_fundraiser_for_fundraisingForEducation_url:fundraising-for-education`;
	sports = $localize`:@@footer_fundraiser_for_sports-fundraising_url:sports-fundraising`;
	music = $localize`:@@footer_fundraiser_for_crowdfunding-music_url:crowdfunding-music"`;
	crowdfundingCharity = $localize`:@@footer_fundraiser_for_crowdfunding-charity_url:crowdfunding-charity`;
	funeral = $localize`:@@footer_fundraiser_for_Fundraising-for-funeral_url:fundraising-for-funeral`;
	nonProfits = $localize`:@@footer_fundraiser_for_Fundraising-for-nonprofits_url:fundraising-for-nonprofits`;
	personalFundraising = $localize`:@@footer_fundraiser_for_personal-fundraising_url:personal-fundraising`;
	corporateGiving = $localize`:@@footer_fundraiser_for_corporate-giving_url:corporate-giving`;
	medicalHref: any;
	fundraisingForHref: any;
	sportsHref: any;
	musicHref: any;
	crowdfundingCharityHref: any;
	funeralHref: any;
	nonProfitsHref: any;
	personalFundraisingHref: any;
	corporateGivingHref: any;
	constructor(
		private router: Router,
		private _accountService: AccountService,
		@Inject(LOCALE_ID) public locale: string
	) {}
	ngOnInit(): void {
		// this.getUrl().subscribe();
		this.currentLanguageCode = this._accountService.getLocaleId();

		if (this.currentLanguageCode == 'nl') {
			this.medicalHref = `${environment.homeUrl}/${this.medical}`;
			this.fundraisingForHref = `${environment.homeUrl}/${this.fundraisingForEducation}`;
			this.sportsHref = `${environment.homeUrl}/${this.sports}`;
			this.musicHref = `${environment.homeUrl}/${this.music}`;
			this.crowdfundingCharityHref = `${environment.homeUrl}/${this.crowdfundingCharity}`;
			this.funeralHref = `${environment.homeUrl}/${this.funeral}`;
			this.nonProfitsHref = `${environment.homeUrl}/${this.nonProfits}`;
			this.personalFundraisingHref = `${environment.homeUrl}/${this.personalFundraising}`;
			this.corporateGivingHref = `${environment.homeUrl}/${this.corporateGiving}`;
		} else {
			this.medicalHref = `${environment.homeUrl}/${this.currentLanguageCode}/${this.medical}`;
			this.fundraisingForHref = `${environment.homeUrl}/${this.currentLanguageCode}/${this.fundraisingForEducation}`;
			this.sportsHref = `${environment.homeUrl}/${this.currentLanguageCode}/${this.sports}`;
			this.musicHref = `${environment.homeUrl}/${this.currentLanguageCode}/${this.music}`;
			this.crowdfundingCharityHref = `${environment.homeUrl}/${this.currentLanguageCode}/${this.crowdfundingCharity}`;
			this.funeralHref = `${environment.homeUrl}/${this.currentLanguageCode}/${this.funeral}`;
			this.nonProfitsHref = `${environment.homeUrl}/${this.currentLanguageCode}/${this.nonProfits}`;
			this.personalFundraisingHref = `${environment.homeUrl}/${this.currentLanguageCode}/${this.personalFundraising}`;
			this.corporateGivingHref = `${environment.homeUrl}/${this.currentLanguageCode}/${this.corporateGiving}`;
		}
	}
}
