import { MediaObserver } from '@angular/flex-layout';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { FundraiserService } from '../../../services/fundraiser.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-donations-zero',
	templateUrl: './donations-zero.component.html',
})
/** *Donations Zero Component */
export class DonationsZeroComponent implements OnInit {
	@Input() isLoggedInUserAdmin: boolean = false;
	@Input() hideToggleSwitch = false;
	@Input() donationReceivedBoolean!: boolean;
	isBrowser: boolean = false;
	showDonorList: boolean = true; // default value of toggle
	tooltip = $localize`:@@donor_list_hide_tooltip: Turn the toggle off to hide donation details on the public fundraiser page`;
	slug: any;

	constructor(
		public _media: MediaObserver,
		private _accountService: AccountService,
		private fundraiserService: FundraiserService,
		public notificationService: NotificationService,
		public router: Router,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	ngOnInit(): void {
		this.showDonorList = this.donationReceivedBoolean;
		this.slug = this.router.url.split('?')[0].substring(13);
	}
	/** *Function responsible for toggling between hide and show donor list */
	onToggleChange(event: MatSlideToggleChange) {
		this.showDonorList = event.checked;
		const toggleValue = { show_donor_list: this.showDonorList };
		if (this._accountService.checkHeaders()) {
			this.fundraiserService
				.showDonationList({
					show_donations: this.showDonorList,
					slug: this.slug,
				})
				.subscribe((res) => {
					this.notificationService.openNotification(
						$localize`:@@donor_list_hidden_change_notification: Donor list details change is saved`,
						'',
						'success'
					);
					if (this.isBrowser) window.location.reload();
				});
		}
	}
}
