import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FundraiserService } from '../../../services/fundraiser.service';
import { AccountService } from 'src/app/pages/account/services/account.service';

@Component({
	selector: 'app-fundraiser-update-view',
	templateUrl: './fundraiser-update-view.component.html',
})
/** *Fundraiser Update View Component */
export class FundraiserUpdateViewComponent implements OnInit, OnChanges {
	@Input() fundraiserUpdates: any;
	@Input() updatesList: any;
	@Input() cardShadow: string = '1';
	@Input() slug: any;
	@Input() count: any;
	@Input() totalPages: any;
	
	page: number = 1;
	loading: boolean = false;

	constructor(
		private _domSanitizer: DomSanitizer,
		private _fundraiserService: FundraiserService,
		private _accountService: AccountService
	) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (this.fundraiserUpdates) {
			this.updatesList = this._fundraiserService.getUpdatesViewObj(
				this.fundraiserUpdates,
				this._accountService.getLocaleId()
			);
		}
	}

	ngOnInit(): void {
		console.log('this._accountService', this.fundraiserUpdates);
	}

	viewMore() {
		this.loading = true;
		this._fundraiserService
			.getUpdates(this.slug, this._accountService.getLocaleId(), this.page + 1)
			.subscribe((updatesData: any) => {
				const newUpdates = this._fundraiserService.getUpdatesViewObj(
					updatesData['data'],
					this._accountService.getLocaleId()
				);

				// Append the newUpdates to the existing updatesList
				this.updatesList = this.updatesList.concat(newUpdates);

				// Increment the page number for the next load
				this.page += 1;
				this.loading = false;
			});
	}

	santizeURL(url: any) {
		return this._domSanitizer.bypassSecurityTrustResourceUrl(url);
	}
}
