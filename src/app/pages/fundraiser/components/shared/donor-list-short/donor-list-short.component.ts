import { ReplyChangeService } from '../../../services/reply-change.service';
import {
	ChangeDetectorRef,
	Component,
	Inject,
	Input,
	OnInit,
	PLATFORM_ID,
} from '@angular/core';
import { FundraiserService } from '../../../services/fundraiser.service';
import { MatDialog } from '@angular/material/dialog';
import { DonorListFullComponent } from '../donor-list-full/donor-list-full.component';
import { MediaObserver } from '@angular/flex-layout';
import { ThankDonarComponent } from 'src/app/shared/components/thank-donar/thank-donar.component';
import { ScrollStrategy } from '@angular/cdk/overlay';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { Router } from '@angular/router';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-donor-list-short',
	templateUrl: './donor-list-short.component.html',
})
/** *Donor List Short Component */
export class DonorListShortComponent implements OnInit {
	@Input() isLoggedInUserAdmin: boolean = false;
	@Input() currentFundraiserID: string | any;
	@Input() donationReceivedBoolean!: boolean;
	@Input() hideToggleSwitch = false;
	@Input() donorShortData: any;
	slug: any;
	isDonorListLoading: boolean = true;
	donarData: any;
	scrollStrategy: ScrollStrategy | any;
	donarDataSlice: any;
	lang: any;
	count: any;
	showDonorList: boolean = true; // default value of toggle
	http: any;
	isBrowser: boolean = false;
	tooltip = $localize`:@@donor_list_hide_tooltip: Turn the toggle off to hide donation details on the public fundraiser page`;
	donor = {};
	constructor(
		public fundraiserService: FundraiserService,
		public _media: MediaObserver,
		public dialog: MatDialog,
		public replyService: ReplyChangeService,
		private readonly cd: ChangeDetectorRef,
		public _accountService: AccountService,
		public router: Router,
		public notificationService: NotificationService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	ngOnInit(): void {
		this.showDonorList = this.donationReceivedBoolean;
		this.slug = this.router.url.split('?')[0].substring(13);

		this.replyService.changeUserValue(this.isLoggedInUserAdmin);
		this.lang = this._accountService.getLocaleId();
		this.isDonorListLoading = false;
		this.donarData = this.donorShortData?.data?.result?.result;
		this.count = this.donorShortData?.data?.result?.count;
	}
	/** *View Donor List Full Component */
	viewFullDonorList() {
		this.dialog.open(DonorListFullComponent, {
			panelClass: 'max-w-100--panelClass',
			maxHeight: '95vh',
			width: '100vh',
			data: {
				isLoggedInUserAdmin: this.isLoggedInUserAdmin,
			},
		});
	}

	openDialog(index: any): void {
		this.dialog.open(ThankDonarComponent, {
			panelClass: 'max-w-100--panelClass',
			maxHeight: '95vh',
			width: '80vh',
			data: { count: this.donarData[index] },
		});
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
