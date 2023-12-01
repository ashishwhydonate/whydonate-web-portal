import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { environment } from 'src/environments/environment.prod';

@Component({
	selector: 'app-ratings',
	templateUrl: './ratings.component.html',
	styleUrls: ['../footer.component.scss'],
})
/** *Rating Component */
export class RatingsComponent implements OnInit {
	ratings = $localize`:@@footer_ratings_url:reviews`;
	ratingsHref: any;
	currentLocale: string = '';
	constructor(
		private _accountService: AccountService
	) {}
	ngOnInit(): void {
		this.currentLocale = this._accountService.getLocaleId();
		if (this.currentLocale == 'nl') {
			this.ratingsHref = `${environment.homeUrl}/${this.ratings}`;
		} else {
			this.ratingsHref = `${environment.homeUrl}/${this.currentLocale}/${this.ratings}`;
		}
	}
}
