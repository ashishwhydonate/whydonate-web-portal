/* This component comes into action after submitting the donation successful form details*/

import {
	Component,
	ElementRef,
	Inject,
	OnDestroy,
	OnInit,
	PLATFORM_ID,
	ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { FundraiserService } from 'src/app/pages/fundraiser/services/fundraiser.service';
import { environment } from 'src/environments/environment';
import { Tools } from 'src/utilities/tools';
import { DonationService } from '../../services/donation.service';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { ProfileService } from 'src/app/pages/user/profile/services/profile.service';
import { Subject } from 'rxjs';
import { DashboardService } from 'src/app/pages/user/dashboard/services/dashboard.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-share-contribution',
	templateUrl: './share-contribution.component.html',
	styleUrls: ['./share-contribution.component.scss'],
})
export class ShareContributionComponent implements OnInit, OnDestroy {
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	@ViewChild('pdfTable', { static: true })
	pdfTableRef!: ElementRef;

	slug: string = '';
	orderId: any;
	currentFundraiser: any;
	isFundraiserLoaded: boolean = false;
	isChild: boolean = false;
	backgroundImage: any;
	customURL: string = '';
	currentFundraiserData: any;
	fundraiserTitle: string = '';
	paymentDetails: any = '';
	profile: any = '';
	locale: any;
	defaultBackgroundImage: string =
		'https://res.cloudinary.com/whydonate/image/upload/v1689704507/whydonate-production/platform/svg-icons/fundraiser_default_bg.png';
	isBrowser: boolean = false;
	constructor(
		public activatedRoute: ActivatedRoute,
		public _accountService: AccountService,
		public donationService: DonationService,
		public cookieService: CookieService,
		public fundraiserService: FundraiserService,
		public router: Router,
		public _dashboardService: DashboardService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	ngAfterViewInit(): void {
		this._unsubscribeAll.complete();
	}

	ngOnInit(): void {
		// Get Transaction data
		this.locale = this._accountService.getLocaleId();
		if (this.isBrowser) this.orderId = localStorage.getItem('transactionId');

		//GETTING SLUG
		this.slug = this.router.url.substring(14, this.router.url.indexOf(';'));
		// CUSTOM URL TO SHARE ON SOCIAL MEDIA
		this.customURL = environment.homeUrl + '/fundraising/' + this.slug;

		//GET FUNDRAISER THROUGH SLUG
		this.fundraiserService
			.getFundraiserBySlug(this.slug, this.locale)
			.subscribe((res: any) => {
				this.currentFundraiser = res?.data?.result;
				this.setFundraiserTitle();
				this.isFundraiserLoaded = true;
				sessionStorage.setItem('slug', JSON.stringify(this.currentFundraiser));
				//SET SELECTED FUNDRAISER IN SERVICE
				this.donationService.setSelectedFundraiser(this.currentFundraiser);

				/*
				 * Check If the fundraiser is Child or Parent
				 */
				if (
					this.currentFundraiser?.parent != null &&
					Object.keys(this.currentFundraiser?.parent).length > 0
				) {
					this.isChild = true;
				}
				//UPDATE BACKGROUND
				this.loadBackgroundInView();
				//UPDATE META TAGS
				if (this.currentFundraiser && this.currentFundraiser?.description) {
					this.currentFundraiserData = {
						title: this.fundraiserTitle,
						description: this.currentFundraiser?.description,
						image: this.backgroundImage,
					};
				}
			}),
			(error: any) => {};
	}

	ngOnDestroy(): void {}

	/*
	 * Load Background In View
	 */
	loadBackgroundInView() {
		if (this.isChild) {
			if (this.currentFundraiser?.background != null) {
				this.backgroundImage = this.currentFundraiser?.background?.image;
			} else if (
				this.currentFundraiser?.background == null &&
				Object.keys(this.currentFundraiser?.parent).length > 0
			) {
				if (this.currentFundraiser?.parent?.background != null) {
					this.backgroundImage =
						this.currentFundraiser?.parent?.background?.image;
				}
			}
		} else {
			if (this.currentFundraiser?.background) {
				this.backgroundImage = this.currentFundraiser?.background?.image;
			}
		}
	}
	/*
	 * Donwload Receipt
	 */
	downloadReceipt() {
		this.router.navigate(['/donate', 'receipt', 'download'], {
			queryParams: { id: this.orderId, slug: this.slug },
		});
	}

	/** *Redirect To Donated Fundraiser  */
	redirectToFundraiser() {
		this.router.navigate(['fundraising/' + this.slug]);
	}

	/*
	 * Function to set Fundraiser Title according to language
	 */
	setFundraiserTitle() {
		let lang = this._accountService.getLocaleId();
		switch (lang) {
			case 'nl':
				if (
					this.currentFundraiser?.translations.title_nl != undefined &&
					this.currentFundraiser?.translations.title_nl != null
				) {
					this.fundraiserTitle =
						this.currentFundraiser?.translations.title_nl || '';
				} else {
					this.fundraiserTitle = this.currentFundraiser?.title || '';
				}

				break;
			case 'en':
				if (
					this.currentFundraiser?.translations.title_en != undefined &&
					this.currentFundraiser?.translations.title_en != null
				) {
					this.fundraiserTitle =
						this.currentFundraiser?.translations.title_en || '';
				} else {
					this.fundraiserTitle = this.currentFundraiser?.title || '';
				}
				break;
			case 'fr':
				if (
					this.currentFundraiser?.translations.title_fr != undefined &&
					this.currentFundraiser?.translations.title_fr != null
				) {
					this.fundraiserTitle =
						this.currentFundraiser?.translations.title_fr || '';
				} else {
					this.fundraiserTitle = this.currentFundraiser?.title || '';
				}
				break;
			case 'de':
				if (
					this.currentFundraiser?.translations.title_de != undefined &&
					this.currentFundraiser?.translations.title_de != null
				) {
					this.fundraiserTitle =
						this.currentFundraiser?.translations.title_de || '';
				} else {
					this.fundraiserTitle = this.currentFundraiser?.title || '';
				}
				break;
			case 'es':
				if (
					this.currentFundraiser?.translations.title_es != undefined &&
					this.currentFundraiser?.translations.title_es != null
				) {
					this.fundraiserTitle =
						this.currentFundraiser?.translations.title_es || '';
				} else {
					this.fundraiserTitle = this.currentFundraiser?.title || '';
				}
				break;
			default:
				this.fundraiserTitle = this.currentFundraiser?.title || '';
				break;
		}
	}

	handleImageError(event: any) {
		event.target.src = this.defaultBackgroundImage;
	}
}
