import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { environment } from 'src/environments/environment.prod';

@Component({
	selector: 'app-products',
	templateUrl: './products.component.html',
	styleUrls: ['../footer.component.scss'],
})
/** *Products Component */
export class ProductsComponent implements OnInit {
	public currentLanguageCode: string = '';
	homeUrl = 'https:whydonate.com';
	crowdfunding = $localize`:@@footer_fundraiser_products_crowdfunding-fundraising_url:crowdfunding-fundraising`;
	donationButton = $localize`:@@footer_fundraiser_products_donate-button-website_url:donate-button-website`;
	digitalCollection = $localize`:@@footer_fundraiser_products_digital-collection-box_url:digital-collection-box`;
	crowdFundingHref: any;
	donationButtonHref: any;
	digitalCollectionHref: any;
	subject = new Subject<string>();
	constructor(
		private router: Router,
		private _accountService: AccountService
	) {}

	ngOnInit(): void {
		// this.getUrl().subscribe();
		this.currentLanguageCode = this._accountService.getLocaleId();

		if (this.currentLanguageCode == 'nl') {
			this.crowdFundingHref = `${environment.homeUrl}/${this.crowdfunding}`;
			this.donationButtonHref = `${environment.homeUrl}/${this.donationButton}`;
			this.digitalCollectionHref = `${environment.homeUrl}/${this.digitalCollection}`;
		} else {
			this.crowdFundingHref = `${environment.homeUrl}/${this.currentLanguageCode}/${this.crowdfunding}`;
			this.donationButtonHref = `${environment.homeUrl}/${this.currentLanguageCode}/${this.donationButton}`;
			this.digitalCollectionHref = `${environment.homeUrl}/${this.currentLanguageCode}/${this.digitalCollection}`;
		}
	}
}
