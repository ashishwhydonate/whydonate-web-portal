import { Clipboard } from '@angular/cdk/clipboard';
import {
	Component,
	Inject,
	Input,
	LOCALE_ID,
	OnInit,
	PLATFORM_ID,
} from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { PaymentRequestService } from 'src/app/pages/fundraiser/services/payment-request.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Tools } from 'src/utilities/tools';
import { environment } from 'src/environments/environment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeHtml } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-share-fundraiser-page',
	templateUrl: './share-fundraiser-page.component.html',
	styleUrls: ['./share-fundraiser-page.component.scss'],
})
//** *Share Fundraiser */
export class ShareFundraiserPageComponent implements OnInit {
	shareLink: string = '';
	@Input() disablePayment: boolean = false;
	@Input() type: string | any = '';
	@Input() preview: boolean = false;
	@Input() applyPadding: boolean = true; // Set to true by default
	oneTimeLabel = $localize`:@@embed_oneTimeLabel:One Time`;
	monthlyLabel = $localize`:@@embed_monthlyLabel:Monthly`;
	yearlyLabel = $localize`:@@embed_yearlyLabel:Yearly`;
	matTooltip = $localize`:@@share_fundraiser_tooltip_copy:Copy share fundraiser link`;
	currency_symbol: string = '';
	onetime_first: string = '';
	onetime_second: string = '';
	onetime_third: string = '';
	onetime_forth: string = '';
	monthly_first: string = '';
	monthly_second: string = '';
	monthly_third: string = '';
	monthly_forth: string = '';
	yearly_first: string = '';
	yearly_second: string = '';
	yearly_third: string = '';
	yearly_forth: string = '';
	fundraiserBackgroundImage: string = '';
	fundraiserBackgroundVideo: string = '';
	video: string = '';
	youtubeThumbnail: any;
	videoPath!: any;
	isBrowser: boolean = false;
	constructor(
		public router: Router,
		public clipboard: Clipboard,
		public dialog: MatDialog,
		public paymentRequest: PaymentRequestService,
		public media: MediaObserver,
		private _notificationService: NotificationService,
		public _accountService: AccountService,
		@Inject(LOCALE_ID) public locale: string,
		@Inject(MAT_DIALOG_DATA) public data: { fundraiser: any },
		public dialogRef: MatDialogRef<ShareFundraiserPageComponent>,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	ngOnInit(): void {
		this.currency_symbol = this.data?.fundraiser?.currency_symbol;
		this.onetime_first =
			this.data?.fundraiser?.custom_donation_configuration?.onetime_first;
		this.onetime_second =
			this.data?.fundraiser?.custom_donation_configuration?.onetime_second;
		this.onetime_third =
			this.data?.fundraiser?.custom_donation_configuration?.onetime_third;
		this.onetime_forth =
			this.data?.fundraiser?.custom_donation_configuration?.onetime_forth;
		this.monthly_first =
			this.data?.fundraiser?.custom_donation_configuration?.monthly_first;
		this.monthly_second =
			this.data?.fundraiser?.custom_donation_configuration?.monthly_second;
		this.monthly_third =
			this.data?.fundraiser?.custom_donation_configuration?.monthly_third;
		this.monthly_forth =
			this.data?.fundraiser?.custom_donation_configuration?.monthly_forth;
		this.yearly_first =
			this.data?.fundraiser?.custom_donation_configuration?.yearly_first;
		this.yearly_second =
			this.data?.fundraiser?.custom_donation_configuration?.yearly_second;
		this.yearly_third =
			this.data?.fundraiser?.custom_donation_configuration?.yearly_third;
		this.yearly_forth =
			this.data?.fundraiser?.custom_donation_configuration?.yearly_forth;
		if (
			(this.data?.fundraiser?.background?.image != '' &&
				this.data?.fundraiser?.background?.video != '') ||
			(this.data?.fundraiser?.background?.image == '' &&
				this.data?.fundraiser?.background?.video != '') ||
			(this.data?.fundraiser?.background?.image != '' &&
				this.data?.fundraiser?.background?.video == '')
		) {
			this.fundraiserBackgroundImage = this.data?.fundraiser?.background?.image;
			this.fundraiserBackgroundVideo = this.data?.fundraiser?.background?.video;
		} else {
			this.fundraiserBackgroundImage =
				this.data?.fundraiser?.parent?.background?.image;
			this.fundraiserBackgroundVideo =
				this.data?.fundraiser?.parent?.background?.video;
		}
		const url: any = this.fundraiserBackgroundVideo;
		this.youtubeThumbnail = this.checkVideoUrl(url);
		this.videoPath = url;
		if (this.type == 'donate') {
			let splitted = this.router.url.split('/');
			console.log('the splitted donate', splitted);
			this.shareLink =
				environment.homeUrl +
				'/' +
				this._accountService.getLocaleId() +
				'/' +
				this.type +
				'/' +
				splitted[2];
		} else if (this.type == 'fundraiser') {
			let splitted = this.router.url.split('/');
			console.log('the splitted fundraiser', splitted);
			this.shareLink =
				environment.homeUrl +
				'/' +
				this._accountService.getLocaleId() +
				'/' +
				splitted[1] +
				'/' +
				splitted[2];
			this.router.url;
		} else {
			this.paymentRequest.currentCustomText.subscribe((data) => {
				this.shareLink = data;
			});
		}
	}

	/*
	 *Copy Link
	 */
	copyLink() {
		this.clipboard.copy(this.shareLink);
		this._notificationService.openNotification(
			$localize`:@@share_fundraiser_link:The Link is successfully copied`,
			'',
			'success'
		);
	}

	/*
	 *Print Fundraiser
	 */
	printFundraiser() {
		if (this.isBrowser) window.print();
	}

	/* INFO: set Image Base URL */
	checkVideoUrl(url: any): SafeHtml {
		const vimeoId = this.getVideoIdFromLink(
			url,
			/^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)/
		);
		const youtubeId = this.getVideoIdFromLink(
			url,
			/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|watch\?v=|v\/)|youtu\.be\/)([\w\-]+)/
		);

		if (vimeoId) {
			return `https://vumbnail.com/${vimeoId}.jpg`;
		} else if (youtubeId) {
			return `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`;
		} else {
			return 'unknown';
		}
	}

	getVideoIdFromLink(url: string, pattern: RegExp): string {
		const match = url?.match(pattern);
		return match && match[1] ? match[1] : '';
	}
}
