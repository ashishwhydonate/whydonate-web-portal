import { Inject, Input, PLATFORM_ID } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FundraiserCardData } from '../../interfaces/fundraiser-card-interface';
import { Image } from '../../interfaces/image-interface';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/pages/account/services/account.service';
import {
	DomSanitizer,
	SafeHtml,
	SafeResourceUrl,
} from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

/**
 * TITLE: Fundraiser card
 * DESCRIPTION: this card will show fundraiser data.
 * It will be used in popular fundraiser, search, connected fundraiser tab.
 * AUTHOR: Vivek Patt
 */

@Component({
	selector: 'app-fundraiser-card',
	templateUrl: './fundraiser-card.component.html',
	styleUrls: ['./fundraiser-card.component.scss'],
})
export class FundraiserCardComponent implements OnInit {
	@Input() slug!: string;
	@Input() fundraiserCardData!: FundraiserCardData;
	@Input() type!: string;
	@Input() isClickAllowed: boolean = true;

	bgImgBaseUrl!: string;
	bgImgOption: string = 'w_400,h_200,dpr_auto,f_auto,q_auto/';
	profileImgBaseUrl!: string;
	profileImgOption: string = 'w_48,h_48,dpr_auto,f_auto,q_auto/';

	bgDefaultImg: Image = { src: '' };
	profileDefaultImg: Image = { src: '' };

	fundraiser_bg_img: Image = { src: '' };
	profile_avatar_img: Image = { src: '' };

	fundraiser_title = '';
	profile_name = '';
	parent_fundraiser_title = '';
	fundraiser_description = '';
	donation_target_amount = 0;
	donation_received_amount = 0;
	donation_progress_percentage = 0;
	donation_days_left = -1;
	videoPath!: any;
	youtubeThumbnail: any;
	/** *FLAGS */
	isShowOnlyDonationAmountView = false;
	isShowOnlyTargetAmountView = false;
	isShowBothDonationAndTargetAmount = false;
	isDaysLeftShow = false;
	/** *locale for currency pipe */
	locale: string;
	currency?: string;
	hoverTooltip: string = '';
	ofTranslation: string = $localize`:@@fundraiser_card_target_amount_hover_tooltip:of`;
	mainFundraiserToolTip = $localize`:@@main_fundraiser_card_image_tooltip: Main Fundraiser - A standalone fundraiser created by you`;
	connectedFundraiserToolTip = $localize`:@@connected_fundraiser_card_image_tooltip: Connected Fundraiser - A fundraiser which is connected to the main fundraiser`;
	isBrowser: boolean = false;

	defaultBackgroundImage: string =
		'https://res.cloudinary.com/whydonate/image/upload/v1689704507/whydonate-production/platform/svg-icons/fundraiser_default_bg.png';
	defaultProfileImage: string =
		'https://res.cloudinary.com/whydonate/image/upload/v1689793299/whydonate-production/platform/svg-icons/whydonate_user.png';

	constructor(
		public _media: MediaObserver,
		private _AccountService: AccountService,
		private _router: Router,
		private sanitizer: DomSanitizer,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		/** *Getting locale from AccountService, for currency pipe */
		this.locale = this._AccountService.getLocaleId();
		this.isShowOnlyTargetAmountView = false;
		this.isShowBothDonationAndTargetAmount = false;
	}

	/** *STARTS HERE */
	ngOnInit(): void {
		console.log('dataFund', this.fundraiserCardData);
		// console.log("Currrr",this.fundraiserCardData.currency)
		try {
			const url: any =
				this.fundraiserCardData?.backgroundImage?.video ||
				this.fundraiserCardData?.background_video ||
				'';
			this.youtubeThumbnail = this.checkVideoUrl(url);

			this.videoPath = url;
			this.setImageBaseUrl();
			this.setImages();
			this.setHeaderAndContent();
			this.setDonationAmountTarget();
			/** *INFO: to calculate percentage both, Donation received amount and target amount are required */
			this.setDonationProgressValue();
			/* *INFO: set UI related flags to show or hide elements */
			this.setDaysLeft();
			this.setViewFlags();
		} catch (error) {
			console.error(error);
		}
	}
	/* *INFO: set Image Base URL */
	checkVideoUrl(url: any) {
		// Vimeo link pattern
		const vimeoPattern =
			/^(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/)(\d+)(?:\S+)?$/;

		// YouTube link pattern
		const youtubePattern =
			/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|watch\?v=|v\/)|youtu\.be\/)([\w\-]+)(?:\S+)?$/;

		if (url.match(vimeoPattern)) {
			return this.generateVimeoIframe(url);
		} else if (url.match(youtubePattern)) {
			return this.generateYouTubeIframe(url);
		} else {
			return 'unknown';
		}
	}

	generateVimeoIframe(videoLink: string): SafeHtml {
		const vimeoVideoId = this.getVideoIdVimeo(videoLink);
		return `https://vumbnail.com/${vimeoVideoId}.jpg`;
	}

	generateYouTubeIframe(videoLink: string): SafeHtml {
		const videoId = this.getVideoIdYoutube(videoLink);
		return `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
	}

	getVideoIdYoutube(videoLink: string): string {
		// Extract the video ID from the YouTube link
		const pattern =
			/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|watch\?v=|v\/)|youtu\.be\/)([\w\-]+)(?:\S+)?$/;
		const match = videoLink?.match(pattern);
		return match && match[1] ? match[1] : '';
	}

	getVideoIdVimeo(videoLink: string): string {
		// Extract the video ID from the Vimeo link
		const pattern = /^(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/)(\d+)(?:\S+)?$/;
		const match = videoLink?.match(pattern);
		return match && match[1] ? match[1] : '';
	}

	setImageBaseUrl() {
		if (environment.production) {
			this.bgImgBaseUrl =
				environment.cloudinaryBaseUrl +
				this.bgImgOption +
				'whydonate-production/user/fundraiser-background/';
			this.profileImgBaseUrl =
				environment.cloudinaryBaseUrl +
				this.profileImgOption +
				'whydonate-production/user/profile/';
			this.bgDefaultImg.src =
				environment.cloudinaryBaseUrl +
				this.bgImgOption +
				'whydonate-production/platform/visuals/fundraiser_default_bg';
			this.profileDefaultImg.src =
				environment.cloudinaryBaseUrl +
				this.profileImgOption +
				'whydonate-production/platform/visuals/whydonate_user';
		} else {
			this.bgImgBaseUrl =
				environment.cloudinaryBaseUrl +
				this.bgImgOption +
				'whydonate-staging/user/fundraiser-background/';
			this.profileImgBaseUrl =
				environment.cloudinaryBaseUrl +
				this.profileImgOption +
				'whydonate-staging/user/profile/';

			this.bgDefaultImg.src =
				environment.cloudinaryBaseUrl +
				this.bgImgOption +
				'whydonate-staging/platform/visuals/fundraiser_default_bg';
			this.profileDefaultImg.src =
				environment.cloudinaryBaseUrl +
				this.profileImgOption +
				'whydonate-staging/platform/visuals/whydonate_user';
		}
	}
	/* *INFO: Set Images */

	setImages(): void {
		if (this.fundraiserCardData?.backgroundImage?.src)
			this.fundraiser_bg_img.src =
				this.bgImgBaseUrl + this.fundraiserCardData?.backgroundImage?.src;
		else this.fundraiser_bg_img = this.bgDefaultImg;

		if (this.fundraiserCardData?.profileImage?.src) {
			this.profile_avatar_img.src =
				this.profileImgBaseUrl + this.fundraiserCardData?.profileImage?.src;
		} else this.profile_avatar_img = this.profileDefaultImg;
	}

	setHeaderAndContent(): void {
		/** *header */
		this.fundraiser_title = this.fundraiserCardData?.title || '';
		this.profile_name = this.fundraiserCardData?.name || '';
		this.parent_fundraiser_title = this.fundraiserCardData?.connected_to || '';
		/** *content */

		this.fundraiser_description = this.fundraiserCardData?.description || '';
	}

	setDonationAmountTarget(): void {
		this.donation_received_amount =
			this.fundraiserCardData?.donationReceivedAmount || 0;

		this.donation_target_amount =
			this.fundraiserCardData?.donationTargetAmount || 0;
		this.currency = this.fundraiserCardData?.currency || '€';
		this.hoverTooltip =
			this.currency +
			this.donation_received_amount.toLocaleString() +
			' ' +
			this.ofTranslation +
			' ' +
			this.currency +
			this.donation_target_amount.toLocaleString();
		console.log('TOOLTIP', this.hoverTooltip);
	}

	/** * INFO: set percentage value for donation progress, condition to be true: show donation amount, donation amount not 0, donation target not 0 */
	setDonationProgressValue(): void {
		if (
			this.isShowDonationAmount() &&
			this.isDonationAmountExist() &&
			this.isTargetAmountExist()
		) {
			this.donation_progress_percentage = Math.floor(
				(this.donation_received_amount / this.donation_target_amount) * 100
			);
		}
	}

	setDaysLeft(): void {
		this.donation_days_left = this.fundraiserCardData?.donationDaysLeft || 0;
	}

	/** * INFO: Set flags for isTargetAmountShow, isOnlyDonationAmountShow, isDonationAndTargetAmountShow, isDaysLeftShow */
	setViewFlags(): void {
		this.setFlagForDonationAmountView();
		this.setFlagForTargetAmountView();
		this.setFlagForDonationAndTargetAmountView();
		this.setDaysLeftView();
	}

	setFlagForDonationAmountView(): void {
		if (this.isShowDonationAmount()) {
			this.isShowOnlyDonationAmountView =
				this.isDonationAmountExist() && !this.isTargetAmountExist();
		}
	}
	setFlagForTargetAmountView(): void {
		if (!this.isShowDonationAmount()) {
			this.isShowOnlyTargetAmountView = this.isTargetAmountExist();
		}
	}
	setFlagForDonationAndTargetAmountView(): void {
		if (this.isShowDonationAmount()) {
			this.isShowBothDonationAndTargetAmount =
				this.isDonationAmountExist() && this.isTargetAmountExist();
		}
	}
	setDaysLeftView(): void {
		/** * INFO: if donation_days_left is >=0 then isDaysLeftShow is true */
		this.isDaysLeftShow = this.donation_days_left >= 0;
	}
	/** *Helper functions */

	isShowDonationAmount(): boolean {
		return this.fundraiserCardData?.showDonationAmount || false;
	}
	isDonationAmountExist(): boolean {
		let _donationReceivedAmount =
			this.fundraiserCardData?.donationReceivedAmount || 0;

		return (
			_donationReceivedAmount >= 0 && Number.isInteger(_donationReceivedAmount)
		);
	}
	isTargetAmountExist(): boolean {
		return !!this.fundraiserCardData?.donationTargetAmount;
	}

	/** *NOTE: Navigation is not working on fundraising page. */
	routeToFundraiser() {
		this._router.navigate(['fundraising', this.slug]);
	}
	routeToFundraiserEdit() {
		this._router.navigate(['fundraising', this.slug]);
	}
	routeToFundraiserNewTab() {
		let url = this._router.serializeUrl(
			this._router.createUrlTree(['fundraising', this.slug])
		);
		if (this.isBrowser) window.open(url, '_blank');
	}
	truncateText(text: string, limit: number) {
		if (text.length <= limit) {
			return text;
		} else {
			return text.substring(0, limit) + '...';
		}
	}
	handleImageError(event: any, defaultImage: string) {
		event.target.src = defaultImage;
	}
	trimDonationTarget(donationTargetAmount: number): string {
		const amountStr = donationTargetAmount.toLocaleString();
		if (amountStr.length > 6) {
			return amountStr.slice(0, 3) + '...';
		} else {
			return amountStr;
		}
	}
}
