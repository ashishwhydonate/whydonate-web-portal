import { Component, Inject, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import {
	UntypedFormBuilder,
	UntypedFormControl,
	UntypedFormGroup,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@sentry/angular';
import { interval, Subject, timer } from 'rxjs';
import { debounce, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ThemeService } from 'src/app/global/services/theme.service';
import { FundraiserCardService } from 'src/app/shared/services/fundraiser-card.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Tools } from 'src/utilities/tools';
import { AccountService } from '../../account/services/account.service';
import { CustomBrandingService } from '../../user/custom-branding/services/custom-branding.service';
import { FundraiserService } from '../services/fundraiser.service';
import { MediaService } from '../services/media.service';
import { CreateAboutComponent } from './dialogs/about/create-about/create-about.component';
import { EditAboutComponent } from './dialogs/about/edit-about/edit-about.component';
import { EditAppealComponent } from './dialogs/appeal/edit-appeal/edit-appeal.component';
import { EditCreatedByComponent } from './dialogs/edit-created-by/edit-created-by.component';
import { EditFundraiserLocationComponent } from './dialogs/edit-fundraiser-location/edit-fundraiser-location.component';
import { TranslateAboutComponent } from './dialogs/about/translate-about/translate-about.component';
import { TranslateAppealComponent } from './dialogs/appeal/translate-appeal/translate-appeal.component';
import { DeleteFundraiserComponent } from './dialogs/delete-fundraiser/delete-fundraiser.component';
import { EditFundraiserCategoryComponent } from './dialogs/edit-fundraiser-category/edit-fundraiser-category.component';
import { OppOwnerComponent } from './shared/opp-owner/opp-owner.component';
import { BankService } from '../../user/profile/services/bank.service';
import {
	DomSanitizer,
	SafeHtml,
	SafeResourceUrl,
} from '@angular/platform-browser';

import { EditAboutDescriptionComponent } from './dialogs/about/edit-about-description/edit-about-description.component';
import { TranslateAboutDescriptionComponent } from './dialogs/about/translate-about-description/translate-about-description.component';
import { EditAppealDescriptionComponent } from './dialogs/appeal/edit-appeal-description/edit-appeal-description.component';
import { TranslateAppealDescriptionComponent } from './dialogs/appeal/translate-appeal-description/translate-appeal-description.component';
import { EventEmitter } from 'stream';
import { isPlatformBrowser } from '@angular/common';
type NavigateType = {
	navigate: () => void;
};

@Component({
	selector: 'app-fundraiser',
	templateUrl: './fundraiser.component.html',
})
export class FundraiserComponent implements OnInit {
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	slug: string = '';
	editDonationAmountURL: string = '/fundraising/donation-amount/';
	currentFundraiser: any | undefined;
	fundraiserUpdatesData: any;
	fundraiserUpdatesCount: any;
	fundraiserUpdatesTotalPages: any;
	fundraiserUpdatesList: any;
	donarDataParent: any;
	donorShortData: any;

	isConnectedFundraiserCountLoading: boolean = true;
	_connectedFundraisersData: any;
	connectedFundraisersData: any;
	connectedFundraisersCount: number = 0;
	debounceDelay: number = 1000; //debounce delay for search input and category selectionChange
	searchInputForm: UntypedFormGroup;

	defaultBackgroundImage = Tools.getBase64_FundraiserDefaultBg();
	backgroundImage: string = this.defaultBackgroundImage;
	backgroundVideo: string = '';

	cardShadow = '1';
	fontFamily = 'Roboto';
	whydonateSecondaryColor = '#2E2C96';
	isWhydonateSecondatColor = false;
	hideToggleSwitch = false;
	isBrowser: boolean = false;

	// Check construction for method definition
	_navigateType: NavigateType = {
		navigate: function (): void {
			throw new Error('Function not implemented.');
		},
	};

	goToEditAmount = this._navigateType;
	openEditCreatedByDialog = this._navigateType;
	openEditFundraiserLocationDialog = this._navigateType;
	openEditFundraiserCategoryDialog = this._navigateType;
	openTranslateFundraiserAboutDialog = this._navigateType;
	openTranslateFundraiserAboutDescriptionDialog = this._navigateType;
	openEditFundraiserAboutDialog = this._navigateType;
	openEditFundraiserAboutDescriptionDialog = this._navigateType;
	openEditFundraiserAppealDialog = this._navigateType;
	openEditFundraiserAppealDescriptionDialog = this._navigateType;
	openTranslateFundraiserAppealDialog = this._navigateType;
	openTranslateFundraiserAppealDescriptionDialog = this._navigateType;
	openCreateFundraiserAboutDialog = this._navigateType;

	fundraiserCardData: any;

	// View flags
	isLoggedInUserAdmin: boolean = false;
	showEdits: boolean = false;
	isViewChanging: boolean = false;
	isNewFundraiser: boolean = false;
	showPublishBanner: boolean = false;
	isDraftOrClosed: boolean = false;

	isCurrentChildFundraiser: boolean = false;
	isWholePreview: boolean = false;
	appealMediaList: any;

	previousRoute!: string;
	previoudRoutString!: string;

	locale!: string;
	localeSuffix: string | any = '';

	daysLeft: number = 0;
	isLoggedIn: boolean = false;
	user: any;
	userProfile: any;

	chargesEnabled!: boolean;
	payoutEnabled!: boolean;
	stripeStatus: any = {};
	detailsSubmitted!: boolean;

	youtubeIframe!: SafeHtml;
	page: number = 2;
	showStripePrompt: boolean = false;

	fundraiserDescriptionData: any;
	isDescriptionLoaded: boolean = false;
	previewNotificationEvent: boolean = false;

	oppVerificationCheck: boolean = false;
	isSave: boolean = false;
	defaultProfileImage: string =
		'https://res.cloudinary.com/whydonate/image/upload/v1689793299/whydonate-production/platform/svg-icons/whydonate_user.png';

	constructor(
		public router: Router,
		public _formBuilder: UntypedFormBuilder,
		public fundraiserService: FundraiserService,
		public notificationService: NotificationService,
		public mediaService: MediaService,
		public _customBrandingService: CustomBrandingService,
		public _fundraiserCardService: FundraiserCardService,
		public _themeService: ThemeService,
		public _media: MediaObserver,
		public activatedRoute: ActivatedRoute,
		public accountService: AccountService,
		public dialog: MatDialog,
		private _bankService: BankService,
		private sanitizer: DomSanitizer,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		this.locale = this.accountService.getLocaleId();
		this.localeSuffix = this.fundraiserService.getLocaleSuffix(this.locale);
		/** Set previous route */
		let previousRoute = this.router
			.getCurrentNavigation()
			?.previousNavigation?.finalUrl?.toString();
		if (previousRoute?.includes('?')) {
			this.previoudRoutString = previousRoute.split('?')[0];
			this.previousRoute = this.previoudRoutString;
		} else if (
			previousRoute?.startsWith('/') &&
			(previousRoute.includes('/dashboard') ||
				previousRoute.includes('/my-fundraisers'))
		) {
			this.previoudRoutString = previousRoute
				.replace('/', '')
				.replace('-', ' ');
			this.previousRoute = previousRoute;
		} else {
			this.previoudRoutString = 'Dashboard';
			this.previousRoute = '/dashboard';
		}

		this.searchInputForm = _formBuilder.group({});
		/**
		 * DESCRIPTION: Reusable edit action to be passed in [ngTemplateOutletContext]="{ routeTo: <EDIT ACTION HERE> }" of #editActionIcon template
		 * EXAMPLE:
		 * <ng-container
		 *    [ngTemplateOutlet]="editActionIcon"
		 *    [ngTemplateOutletContext]="{ routeTo: goToEditAmount }">
		 * </ng-container>
		 */
		this.goToEditAmount = {
			navigate: () => {
				this.router.navigate([this.editDonationAmountURL, this.slug]);
			},
		};
		this.openEditCreatedByDialog = {
			navigate: () => {
				let dialogRef = this.dialog.open(EditCreatedByComponent, {
					maxHeight: '98vh',
					width: '600px',
					data: { currentFundraiser: this.currentFundraiser },
				});
				dialogRef.afterClosed().subscribe((data) => {
					if (data) {
						// data.id = this.currentFundraiser?.result?.social_media?.id;
						this.currentFundraiser.social_media = data?.result;
					}
				});
			},
		};
		this.openEditFundraiserCategoryDialog = {
			navigate: () => {
				let dialogRef = this.dialog.open(EditFundraiserCategoryComponent, {
					width: '600px',
					data: { currentFundraiser: this.currentFundraiser },
				});

				dialogRef.afterClosed().subscribe((categortResponse) => {
					if (categortResponse) {
						this.currentFundraiser.category = categortResponse.result;
						if (this.isBrowser) window.location.reload();
					}
				});
			},
		};
		this.openEditFundraiserLocationDialog = {
			navigate: () => {
				let dialogRef = this.dialog.open(EditFundraiserLocationComponent, {
					width: '600px',
					data: { currentFundraiser: this.currentFundraiser },
				});

				dialogRef.afterClosed().subscribe((locationResponse) => {
					if (locationResponse) {
						this.currentFundraiser.location_local = locationResponse.result;
						if (this.isBrowser) window.location.reload();
					}
				});
			},
		};
		this.openEditFundraiserAboutDialog = {
			navigate: () => {
				const dialogRef = this.dialog.open(EditAboutComponent, {
					width: '100vh',
					maxHeight: '98vh',
					data: {
						currentFundraiser: this.currentFundraiser,
					},
				});
				dialogRef.afterClosed().subscribe((aboutContent) => {
					if (aboutContent) {
						let slug = this.currentFundraiser.slug;
						// removing slug will turn on the pageloader
						this.currentFundraiser.slug = '';
						this.scrollUp();
						this.fundraiserService
							.getFundraiserBySlugForAdmin(slug, this.locale)
							.subscribe((res: any) => {
								if (res?.errors?.code == '4005') {
									this.router.navigate(['/fundraising/fundraiser-not-found']);
								} else {
									// update the new data related to fundraiser about
									this.currentFundraiser =
										this.fundraiserService.filterFundraiserObj(
											res['data'].result
										);
								}
							});
					}
				});
			},
		};
		this.openEditFundraiserAboutDescriptionDialog = {
			navigate: () => {
				const dialogRef = this.dialog.open(EditAboutDescriptionComponent, {
					maxHeight: '98vh',
					data: {
						currentFundraiser: this.fundraiserDescriptionData,
						currentFundraiserImage: this.currentFundraiser,
					},
				});
				dialogRef.afterClosed().subscribe((aboutContent) => {
					if (aboutContent) {
						this.isDescriptionLoaded = false;
						let slug = this.currentFundraiser.slug;
						// removing slug will turn on the pageloader
						this.currentFundraiser.slug = '';
						this.scrollUp();
						this.fundraiserService
							.getFundraiserBySlugForAdmin(slug, this.locale)
							.subscribe((res: any) => {
								if (res?.errors?.code == '4005') {
									this.router.navigate(['/fundraising/fundraiser-not-found']);
								} else {
									// update the new data related to fundraiser about
									this.currentFundraiser =
										this.fundraiserService.filterFundraiserObj(
											res['data'].result
										);
								}
							});
					}
				});
			},
		};
		this.openTranslateFundraiserAboutDialog = {
			navigate: () => {
				const dialogRef = this.dialog.open(TranslateAboutComponent, {
					width: '100vh',
					maxHeight: '98vh',
					data: {
						currentFundraiser: this.currentFundraiser,
					},
				});
				dialogRef.afterClosed().subscribe((isTranslated) => {
					if (isTranslated) {
						let slug = this.currentFundraiser.slug;
						// removing slug will turn on the pageloader
						this.currentFundraiser.slug = '';
						this.scrollUp();
						this.fundraiserService
							.getFundraiserBySlugForAdmin(slug, this.locale)
							.subscribe((res: any) => {
								if (res?.errors?.code == '4005') {
									this.router.navigate(['/fundraising/fundraiser-not-found']);
								} else {
									// update the fundraiser translation with new data
									this.currentFundraiser =
										this.fundraiserService.filterFundraiserObj(
											res['data'].result
										);
								}
							});
					}
				});
			},
		};
		this.openTranslateFundraiserAboutDescriptionDialog = {
			navigate: () => {
				const dialogRef = this.dialog.open(TranslateAboutDescriptionComponent, {
					maxHeight: '98vh',
					data: {
						currentFundraiser: this.fundraiserDescriptionData,
						currentFundraiserImage: this.currentFundraiser,
					},
				});
				dialogRef.afterClosed().subscribe((isTranslated) => {
					if (isTranslated) {
						let slug = this.currentFundraiser.slug;
						// removing slug will turn on the pageloader
						this.currentFundraiser.slug = '';
						this.scrollUp();
						this.fundraiserService
							.getFundraiserBySlugForAdmin(slug, this.locale)
							.subscribe((res: any) => {
								if (res?.errors?.code == '4005') {
									this.router.navigate(['/fundraising/fundraiser-not-found']);
								} else {
									// update the fundraiser translation with new data
									this.currentFundraiser =
										this.fundraiserService.filterFundraiserObj(
											res['data'].result
										);
								}
							});
					}
				});
			},
		};
		this.openTranslateFundraiserAppealDialog = {
			navigate: () => {
				const dialogRef = this.dialog.open(TranslateAppealComponent, {
					width: '100vh',
					maxHeight: '98vh',
					data: {
						currentFundraiser: this.currentFundraiser,
					},
				});
				dialogRef.afterClosed().subscribe((isTranslated) => {
					if (isTranslated) {
						let slug = this.currentFundraiser.slug;
						// removing slug will turn on the pageloader
						this.currentFundraiser.slug = '';
						this.scrollUp();
						this.fundraiserService
							.getFundraiserBySlugForAdmin(slug, this.locale)
							.subscribe((res: any) => {
								if (res?.errors?.code == '4005') {
									this.router.navigate(['/fundraising/fundraiser-not-found']);
								} else {
									// update the fundraiser translation with new data
									this.currentFundraiser =
										this.fundraiserService.filterFundraiserObj(
											res['data'].result
										);
								}
							});
					}
				});
			},
		};
		this.openEditFundraiserAppealDialog = {
			navigate: () => {
				const dialogRef = this.dialog.open(EditAppealComponent, {
					width: '100vh',
					maxHeight: '98vh',
					data: {
						currentFundraiser: this.currentFundraiser,
					},
				});
				dialogRef.afterClosed().subscribe((newAppeal) => {
					if (newAppeal) {
						let slug = this.currentFundraiser.slug;
						// removing slug will turn on the pageloader
						this.currentFundraiser.slug = '';
						this.scrollUp();
						this.fundraiserService
							.getFundraiserBySlugForAdmin(slug, this.locale)
							.subscribe((res: any) => {
								if (res?.errors?.code == '4005') {
									this.router.navigate(['/fundraising/fundraiser-not-found']);
								} else {
									// update the new data related to fundraiser about
									this.currentFundraiser =
										this.fundraiserService.filterFundraiserObj(
											res['data'].result
										);
								}
							});
					}
				});
			},
		};
		this.openEditFundraiserAppealDescriptionDialog = {
			navigate: () => {
				const dialogRef = this.dialog.open(EditAppealDescriptionComponent, {
					width: '100vh',
					maxHeight: '98vh',
					data: {
						currentFundraiser: this.fundraiserDescriptionData,
						currentFundraiserImage: this.currentFundraiser,
					},
				});
				dialogRef.afterClosed().subscribe((newAppeal) => {
					if (newAppeal) {
						let slug = this.currentFundraiser.slug;
						// removing slug will turn on the pageloader
						this.currentFundraiser.slug = '';
						this.scrollUp();
						this.fundraiserService
							.getFundraiserBySlugForAdmin(slug, this.locale)
							.subscribe((res: any) => {
								if (res?.errors?.code == '4005') {
									this.router.navigate(['/fundraising/fundraiser-not-found']);
								} else {
									// update the new data related to fundraiser about
									this.currentFundraiser =
										this.fundraiserService.filterFundraiserObj(
											res['data'].result
										);
								}
							});
					}
				});
			},
		};
		this.openTranslateFundraiserAppealDescriptionDialog = {
			navigate: () => {
				const dialogRef = this.dialog.open(
					TranslateAppealDescriptionComponent,
					{
						maxHeight: '98vh',
						data: {
							currentFundraiser: this.fundraiserDescriptionData,
							currentFundraiserImage: this.currentFundraiser,
						},
					}
				);
				dialogRef.afterClosed().subscribe((isTranslated) => {
					if (isTranslated) {
						let slug = this.currentFundraiser.slug;
						// removing slug will turn on the pageloader
						this.currentFundraiser.slug = '';
						this.scrollUp();
						this.fundraiserService
							.getFundraiserBySlugForAdmin(slug, this.locale)
							.subscribe((res: any) => {
								if (res?.errors?.code == '4005') {
									this.router.navigate(['/fundraising/fundraiser-not-found']);
								} else {
									// update the fundraiser translation with new data
									this.currentFundraiser =
										this.fundraiserService.filterFundraiserObj(
											res['data'].result
										);
								}
							});
					}
				});
			},
		};
		this.openCreateFundraiserAboutDialog = {
			navigate: () => {
				const dialogRef = this.dialog.open(CreateAboutComponent, {
					data: {
						currentFundraiser: this.currentFundraiser,
					},
				});
				dialogRef.afterClosed().subscribe((isAboutContentCreated) => {
					if (isAboutContentCreated) {
						let slug = this.currentFundraiser.slug;
						// removing slug will turn on the pageloader
						this.currentFundraiser.slug = '';
						this.scrollUp();
						this.fundraiserService
							.getFundraiserBySlugForAdmin(slug, this.locale)
							.subscribe(
								(res: any) => {
									if (res?.errors?.code == '4005') {
										this.router.navigate(['/fundraising/fundraiser-not-found']);
									} else {
										// update the new data related to fundraiser about
										this.currentFundraiser =
											this.fundraiserService.filterFundraiserObj(
												res['data'].result
											);
										this.isNewFundraiser = false;
									}
								},
								(error) => {
									this.notificationService.openNotification(
										$localize`:@@edit_fundraiser_refreshingData_notification:Error occured while refreshing data`,
										'',
										'error'
									);
								}
							);
					}
				});
			},
		};
	}

	ngOnDestroy(): void {
		/** *Unsubscribe from all subscriptions */
		this._unsubscribeAll.complete();
	}
	ngAfterViewInit(): void {
		this.searchInputForm?.controls.searchCtrl.valueChanges
			.pipe(
				debounce(() => {
					return interval(this.debounceDelay);
				}),
				distinctUntilChanged((x, y) => {
					//* INFO: If no actual change then cancel the loading and Search
					if (x == y) {
						return true;
					}
					// if (this.isLoading && this.progressBarMode == 'query') {
					// 	//TODO: If true then, new API request made while one is already running. (user switchMap from rxjs to resolve this scenario: https://www.learnrxjs.io/learn-rxjs/operators/transformation/switchmap)
					// }
					return false;
				})
			)
			.subscribe((data) => {
				this.connectedFundraisersData =
					this.filterConnectedFundraisersData(data);
				this.connectedFundraisersCount =
					this.connectedFundraisersData?.length || 0;
			});
	}

	ngOnInit(): void {
		this.isDescriptionLoaded = false;
		//Abdur Custom Branding Hiding div (Header) value logic
		this.accountService.getLoginInformation().subscribe((data: Boolean) => {
			if (data == true) {
				this.isLoggedIn = true;
				if (this.isBrowser) this.user = localStorage.getItem('user');
			} else {
				this.isLoggedIn = false;
			}
		});
		/** *Condition for Custom Branding Div for Header */
		if (this.isLoggedIn == true && this.accountService.checkHeaders()) {
			this._customBrandingService
				.getProfile()
				.pipe(takeUntil(this._unsubscribeAll))
				.subscribe((userProfile) => {
					this.userProfile = userProfile;
					this._customBrandingService.setIsReceived(
						this.userProfile.data?.profile?.is_receiver
					);
				});
		}
		if (this.router.url.includes('?')) {
			this.slug = this.router.url.split('?')[0].substring(13);
		} else {
			this.slug = this.router.url.substring(13);
		}
		// Below code Ensure that component is reloaded when route changes for connected fundraisers
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;

		// set control for connected tab
		this.searchInputForm.setControl('searchCtrl', new UntypedFormControl());
		// Extract Slug

		//Get Fundraiser Description
		this.fundraiserService
			.getFundraiserDescription(this.slug, this.locale)
			.subscribe((res: any) => {
				this.fundraiserDescriptionData = res?.data?.result;
				this.isDescriptionLoaded = true;
			});

		//Get Login Information
		this.accountService
			.getLoginInformation()
			.subscribe((loginData: Boolean) => {
				this.fundraiserService
					.getDonorShort(this.slug, this.locale)
					.subscribe((response: any) => {
						if (response && response?.data?.result?.result) {
							this.donorShortData = response;
							this.donarDataParent = Object.keys(
								response?.data?.result?.result
							)?.length;
						}
					});
				if (loginData == true) {
					// get Fundraiser from service
					this.fundraiserService
						.getFundraiserBySlugForAdmin(this.slug, this.locale)
						.subscribe((data: any) => {
							if (data?.errors?.code == '4005') {
								this.router.navigate(['/fundraising/fundraiser-not-found']);
							} else {
								let user: User;
								if (this.isBrowser)
									user = JSON.parse(localStorage.getItem('user') || '{}');
								if (data['details'] == 'Error decoding signature.') {
									this.notificationService.openNotification(
										$localize`:@@edit_fundraiser_sessionExpired_notification:Session Expired, logging out`,
										'',
										'error'
									);
									this.accountService.logout();
									this.router.navigate(['/account']);
								}
								// if (data['data']['is_draft'] == true) {
								// 	this.router.navigate(['/']);
								// }
								if (data['errors']['code'] == '4001') {
									this.router.navigate(['/fundraising/fundraiser-not-found']);
								} else {
									this.isNewFundraiser = this.isLoggedInToNewFundraiser(
										data['data']?.result
									);
									this.showPublishBanner = this.isShowPublishBanner(
										data['data']?.result
									);

									if (this.isNewFundraiser) {
										this.currentFundraiser = data['data']?.result;
									} else {
										this.currentFundraiser =
											this.fundraiserService.filterFundraiserObj(
												data['data']?.result
											);
									}

									// Check If the fundraiser is Child or Parent
									if (
										this.currentFundraiser?.parent != null &&
										Object.keys(this.currentFundraiser?.parent).length > 0
									) {
										this.currentFundraiser =
											this.fundraiserService.filterFundraiserObj(
												data['data']?.result
											);
										this.isCurrentChildFundraiser = true;
										if (this.isBrowser)
											localStorage.setItem(
												'childFundraiser',
												JSON.stringify(this.isCurrentChildFundraiser)
											);
										this.setConnectedFundriserData();
									}

									// Set Custom Branding
									this.setCustomBranding(this.currentFundraiser);

									//Check if user is the admin
									if (this.accountService.checkHeaders()) {
										this.isLoggedInUserAdminOfCurrentFundraiser();
									}

									// Set fundraiser card object for donation card
									this.fundraiserCardData =
										this._fundraiserCardService.filterFundraiserCardDataList([
											this.currentFundraiser,
										])[0]?.fundraiserCardData;

									// Set Current Fundraiser in service
									this.fundraiserService.setCurrentFundraiser(
										this.currentFundraiser
									);

									//Load Background
									this.loadBackgroundInView();

									// Get updates of fundraising
									this.fundraiserService
										.getUpdates(this.slug, this.locale, 1)
										.subscribe((updatesData: any) => {
											this.fundraiserUpdatesData = updatesData['data'];
											this.fundraiserUpdatesCount =
												updatesData['data'].totalDoc;
											this.fundraiserUpdatesTotalPages =
												updatesData['data'].totalPages;
										});

									this.fundraiserService
										.getConnectedFundraisers(this.slug, 1)
										.subscribe((connectedFundraisersRes: any) => {
											this.connectedFundraisersData =
												this.fundraiserService.getConnectedFundraisersObj(
													connectedFundraisersRes['data']
												);
											this.connectedFundraisersCount =
												connectedFundraisersRes['data'].count || 0;

											// store original object
											this._connectedFundraisersData =
												this.connectedFundraisersData;

											this.isConnectedFundraiserCountLoading = false;
										});

									// CHECK IF FUNDRAISER HAS END DATE, then calculate days left

									if (
										this.currentFundraiser &&
										this.currentFundraiser?.end_date != undefined &&
										this.currentFundraiser?.end_date != null &&
										this.currentFundraiser?.end_date
									) {
										let isEndDateUnlimited =
											this._fundraiserCardService?.isFundraiserEndDateUnlimited(
												this.currentFundraiser?.end_date
											);
										if (isEndDateUnlimited) {
											let endDate = new Date(this.currentFundraiser?.end_date);
											let currentDate = new Date();
											this.daysLeft = this.fundraiserService.getDateDiff(
												currentDate,
												endDate
											);
										} else {
											this.daysLeft = -1;
										}
									}

									if (this.isNewFundraiser && !this.isCurrentChildFundraiser) {
										this.openCreateFundraiserAboutDialog.navigate();
									}
								}
							}
						}),
						(error: any) => {
							this.notificationService.openNotification(
								$localize`:@@edit_fundraiser_errorLoading_notification:Error Loading Fundraiser. Error: ` +
									error,
								'',
								'error'
							);
						};
				} else {
					this.fundraiserService
						.getFundraiserBySlug(this.slug, this.locale)
						.subscribe((data: any) => {
							if (data['errors']['code'] == '4001') {
								this.router.navigate(['/fundraising/fundraiser-not-found']);
							}
							if (data['errors']['code'] == '4005') {
								this.router.navigate(['/fundraising/fundraiser-not-found']);
							} else {
								// Get Fundraiser
								this.currentFundraiser =
									this.fundraiserService.filterFundraiserObj(
										data['data']?.result
									);

								// Check if fundraiser in draft
								this.isDraftOrClosed = this.isFundraiserClosed(
									this.currentFundraiser
								);

								if (this.isFundraiserClosedNew(this.currentFundraiser)) {
									this.router.navigate(['/fundraising/fundraiser-is-draft']);
								}

								this.fundraiserCardData =
									this._fundraiserCardService.filterFundraiserCardDataList([
										this.currentFundraiser,
									])[0]?.fundraiserCardData;
								this.setCustomBranding(this.currentFundraiser);

								// Set Current Fundraiser in service
								this.fundraiserService.setCurrentFundraiser(
									this.currentFundraiser
								);

								// Check If the fundraiser is Child or Parent
								if (
									this.currentFundraiser?.parent != null &&
									Object.keys(this.currentFundraiser?.parent)?.length > 0
								) {
									this.isCurrentChildFundraiser = true;
									this.setConnectedFundriserData();
								}
								//Load Background
								this.loadBackgroundInView();

								// Get updates of fundraising
								this.fundraiserService
									.getUpdates(this.slug, this.locale, 1)
									.subscribe((updatesData: any) => {
										this.fundraiserUpdatesData = updatesData['data'];
										this.fundraiserUpdatesCount = updatesData['data'].totalDoc;
										this.fundraiserUpdatesTotalPages =
											updatesData['data'].totalPages;
									});

								this.fundraiserService
									.getConnectedFundraisers(this.slug, 1)
									.subscribe((connectedFundraisersRes: any) => {
										this.connectedFundraisersData =
											this.fundraiserService.getConnectedFundraisersObj(
												connectedFundraisersRes['data']
											);

										this.connectedFundraisersCount =
											connectedFundraisersRes['data'].count || 0;

										// store original object
										this._connectedFundraisersData =
											this.connectedFundraisersData;

										this.isConnectedFundraiserCountLoading = false;
									});

								// CHECK IF FUNDRAISER HAS END DATE, then calculate days left

								if (
									this.currentFundraiser &&
									this.currentFundraiser?.end_date != undefined &&
									this.currentFundraiser?.end_date != null &&
									this.currentFundraiser?.end_date
								) {
									let isEndDateUnlimited =
										this._fundraiserCardService?.isFundraiserEndDateUnlimited(
											this.currentFundraiser?.end_date
										);
									if (isEndDateUnlimited) {
										let endDate = new Date(this.currentFundraiser?.end_date);
										let currentDate = new Date();
										this.daysLeft = this.fundraiserService.getDateDiff(
											currentDate,
											endDate
										);
										// this.daysLeft = Math.ceil(diff / (1000 * 3600 * 24));
									} else {
										this.daysLeft = -1;
									}
								}
							}
						}),
						(error: any) => {
							this.notificationService.openNotification(
								$localize`:@@edit_fundraiser_errorLoading_notification:Error Loading Fundraiser. Error: ` +
									error,
								'',
								'error'
							);
						};
				}
			});

		// CHECK STRIPE STATUS
		this._bankService.getStripeStatus().subscribe((res: any) => {
			this.stripeStatus = res?.data;
			this.chargesEnabled = this.stripeStatus?.charges_enabled;
			this.payoutEnabled = this.stripeStatus?.payout_enabled;
			this.detailsSubmitted = this.stripeStatus?.details_submitted;

			this._bankService.getPersonalVerification().subscribe((res: any) => {
				if (res?.errors?.code == '1005') {
					this.showStripePrompt = true;
				}
				if (
					this.chargesEnabled == true &&
					this.payoutEnabled == true &&
					this.detailsSubmitted == true
				) {
					this.showStripePrompt = false;
				} else if (
					this.chargesEnabled == false &&
					this.payoutEnabled == false &&
					this.detailsSubmitted == false
				) {
					this.showStripePrompt = true;
				} else if (
					this.chargesEnabled == true &&
					this.payoutEnabled == true &&
					this.detailsSubmitted == true
				) {
					this.showStripePrompt = false;
				} else {
					this.showStripePrompt = true;
				}
			});
		});
	}

	routeToParentFundraiser(parentSlug = this.slug) {
		this.router.navigate(['fundraising', parentSlug]);
	}

	routeToConnectFundraiser() {
		// localStorage.setItem('previous_path', 'fundraising/connect/' + this.slug);
		let connectedUrl = 'fundraising/connect/' + this.slug;
		Tools.setPreviousPath(connectedUrl);
		this.router.navigate([connectedUrl]);
	}
	// Filter connectedFundraisers object with query_string
	filterConnectedFundraisersData(query_string: string) {
		return this._connectedFundraisersData.filter(
			(item: any) =>
				!!item.fundraiserCardData.title.match(new RegExp(query_string, 'i'))
		);
	}
	viewMore() {
		this.isConnectedFundraiserCountLoading = true;
		this.fundraiserService
			.getConnectedFundraisers(this.slug, this.page)
			.subscribe((connectedFundraisersRes: any) => {
				const newData = this.fundraiserService.getConnectedFundraisersObj(
					connectedFundraisersRes['data']
				);

				// Append the new data to the existing connectedFundraisersData array
				this.connectedFundraisersData = [
					...this.connectedFundraisersData,
					...newData,
				];
				this.isConnectedFundraiserCountLoading = false;
				this.page++;
			});
	}

	loadBackgroundInView() {
		if (this.isCurrentChildFundraiser) {
			if (
				this.currentFundraiser?.background?.image !== '' ||
				this.currentFundraiser?.background?.video !== ''
			) {
				this.backgroundImage = this.currentFundraiser?.background?.image;
				this.backgroundVideo = this.currentFundraiser?.background?.video;
				this.youtubeIframe = this.checkVideoUrl(
					this.currentFundraiser?.background?.video
				);
				return;
			}
			if (this.currentFundraiser?.parent?.background != null) {
				this.backgroundImage =
					this.currentFundraiser?.parent?.background?.image;
				this.backgroundVideo =
					this.currentFundraiser?.parent?.background?.video;
				this.youtubeIframe = this.checkVideoUrl(
					this.currentFundraiser?.parent?.background?.video
				);

				return;
			}
			if (this.currentFundraiser?.root_fundraiser?.background != null) {
				this.backgroundImage =
					this.currentFundraiser?.root_fundraiser?.background?.image;
				this.backgroundVideo =
					this.currentFundraiser?.root_fundraiser?.background?.video;
				this.youtubeIframe = this.checkVideoUrl(
					this.currentFundraiser?.root_fundraiser?.background?.video
				);

				return;
			}
		} else if (this.currentFundraiser?.background) {
			this.backgroundVideo = this.currentFundraiser?.background?.video;
			this.backgroundImage = this.currentFundraiser?.background?.image;
			this.youtubeIframe = this.checkVideoUrl(
				this.currentFundraiser?.background?.video
			);
		}
	}

	checkVideoUrl(url: string) {
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

		const angularTag = `
		<style>
		.embed-container {
			--video--width: 1920;
			--video--height: 1080;

			position: relative;
			padding-bottom: calc(var(--video--height) / var(--video--width) * 100%); /* 41.66666667% */
			overflow: hidden;
			max-width: 100%;
			max-height: 100%;
			background: black;
		}

		.embed-container iframe,
		.embed-container object,
		.embed-container embed {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
		</style>
		<div class='embed-container'>
			<iframe
				width="560"
				height="315"
				src="https://player.vimeo.com/video/${vimeoVideoId}"

				srcdoc="<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=https://player.vimeo.com/video/${vimeoVideoId}?autoplay=1&muted=1><img src=https://vumbnail.com/${vimeoVideoId}.jpg><span>▶</span></a>"
				frameborder="0"
				allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
			></iframe>
		</div>
		`;

		// Sanitize the HTML tag using DomSanitizer
		const safeHTML = this.sanitizer.bypassSecurityTrustHtml(angularTag);

		return safeHTML;
	}

	generateYouTubeIframe(videoLink: string): SafeHtml {
		const videoId = this.getVideoIdYoutube(videoLink);
		const angularTag = `
		<iframe
			loading="lazy"
			src="https://www.youtube-nocookie.com/embed/${videoId}"
			width="100%"
			height="100%"
			frameborder="0"
			allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
			title="The Youtube Video"
		></iframe>`;
		// Sanitize the HTML tag using DomSanitizer
		const safeHTML = this.sanitizer.bypassSecurityTrustHtml(angularTag);

		return safeHTML;
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

	/**
	 * Check if current logged in user is the admin of current fundraiser
	 */
	isLoggedInUserAdminOfCurrentFundraiser() {
		try {
			this.fundraiserService
				.isLoggedInUserAdminOfFundraiser(this.currentFundraiser.id)
				.subscribe((res: any) => {
					if (res['status'] == 200 && res['data']['is_fundraiser_owner']) {
						this.isLoggedInUserAdmin = true;
						this.showEdits = true;
						this.isDraftOrClosed = this.isFundraiserClosedNew(
							this.currentFundraiser
						);

						// If currently opened fundraiser is a CONNECTED FUNDRAISER, show message that owner can edit it
						if (this.isCurrentChildFundraiser) {
							/*
              There would be 3 scenarios in this situation
              1. Parent profile/account and Connected fundraiser profile/account are same
              2. Parent profile/account and Connected fundraiser profile/account are not same
                if not same, then we need to check who is logged in(parent or connected owner) and show message accordingly

              */

							if (
								this.currentFundraiser?.parent?.profile?.name !=
								this.currentFundraiser?.profile?.name
							) {
								//Check who is logged In - get user data from local storage
								let userStringObj: any;
								if (this.isBrowser)
									userStringObj = localStorage.getItem('user') || '{}';
								let user = JSON.parse(userStringObj);

								if (user?.id == this.currentFundraiser?.profile?.user_id) {
									this.notificationService.openNotification(
										$localize`:@@fundraiser_adminCanEdit:This is a supporting fundraiser which gives main fundraiser owner complete rights to edit and delete this fundraiser`,
										'Got it',
										'success'
									);
								} else {
									this.notificationService.openNotification(
										$localize`:@@fundraiser_informAdmin:This fundraiser does not belong to you. So we recommend you to inform the fundraiser owner about changes by message or mail.`,
										'Got it',
										'success'
									);
								}
							}
						}
					} else {
						// if not admin then check if fundraiser is in draft and redirect to home if true
						if (this.currentFundraiser['is_draft'] == true) {
							this.router.navigate(['/fundraising/fundraiser-is-draft']);
						}
					}
				});
		} catch (error) {
			this.isLoggedInUserAdmin = false;
		}
	}

	isLoggedInToNewFundraiser(currentFundraiser: any) {
		let isDraft = currentFundraiser?.is_draft == true;
		let isContent = currentFundraiser?.content?.trim() == '';
		if (isDraft && isContent) {
			return true;
		} else {
			return false;
		}
	}
	isShowPublishBanner(currentFundraiser: any) {
		let isDraft = currentFundraiser?.is_draft == true;
		if (isDraft) {
			return true;
		} else {
			return false;
		}
	}
	isFundraiserClosed(currentFundraiser: any) {
		return this.fundraiserService.isFundraiserClosed(currentFundraiser);
	}
	isFundraiserClosedNew(currentFundraiser: any) {
		return this.fundraiserService.isFundraiserClosedNew(currentFundraiser);
	}
	openDeleteFundraiserDialog() {
		const dialogRef = this.dialog.open(DeleteFundraiserComponent, {
			data: { slug: this.currentFundraiser.slug },
		});
		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				let subscribe = timer(1000).subscribe((val) => {
					this.router.navigate(['/dashboard']);
					subscribe.unsubscribe();
				});
			}
		});
	}
	openCreateFundraiserAboutDialog2() {
		const dialogRef = this.dialog.open(CreateAboutComponent, {
			data: {
				currentFundraiser: this.currentFundraiser,
			},
		});
		dialogRef.afterClosed().subscribe((isAboutContentCreated) => {
			if (isAboutContentCreated) {
				let slug = this.currentFundraiser.slug;
				// removing slug will turn on the pageloader
				this.currentFundraiser.slug = '';
				this.scrollUp();
				this.fundraiserService
					.getFundraiserBySlugForAdmin(slug, this.locale)
					.subscribe(
						(res: any) => {
							// update the new data related to fundraiser about
							this.currentFundraiser =
								this.fundraiserService.filterFundraiserObj(res['data']);
							this.isNewFundraiser = false;
						},
						(error) => {
							this.notificationService.openNotification(
								$localize`:@@edit_fundraiser_refreshingData_notification:Error occured while refreshing data`,
								'',
								'error'
							);
						}
					);
			}
		});
	}

	/*
	 * Function to show public view
	 */
	showPublicView() {
		if (this.isLoggedInUserAdmin) {
			this.showEdits = false;
			this.isViewChanging = true;
			this.hideToggleSwitch = true;
			let subscribe = timer(1000).subscribe((val) => {
				this.isViewChanging = false;
				subscribe.unsubscribe();
			});
		}
	}
	/*
	 * Function to show public view
	 */
	hidePublicView() {
		if (this.isLoggedInUserAdmin) {
			this.showEdits = true;
			this.isViewChanging = true;
			if (this.isBrowser) window.location.reload();
			let subscribe = timer(500).subscribe((val) => {
				this.isViewChanging = false;
				subscribe.unsubscribe();
			});
		}
	}
	logNotificationEvent(event: boolean) {
		this.previewNotificationEvent = event;
		if (this.isLoggedInUserAdmin && this.previewNotificationEvent == true) {
			this.showEdits = false;
			this.isViewChanging = true;
			this.hideToggleSwitch = true;
			this.isWholePreview = true;
			let subscribe = timer(1000).subscribe((val) => {
				this.isViewChanging = false;
				subscribe.unsubscribe();
			});
		}
	}
	goToEditAmount2() {
		this.editDonationAmountURL = this.editDonationAmountURL + this.slug;
		this.router.navigate([this.editDonationAmountURL, this.slug]);
	}
	fallbackToDefaultImage() {
		this.backgroundImage = this.defaultBackgroundImage;
	}

	publishFundraiserFunction(event: any) {
		if (event == true) {
			this.emitPublishClick();
		}
	}
	emitPublishClick() {
		this.isSave = true;
		if (this.isCurrentChildFundraiser) {
			this.publishFundraiser();
		} else {
			this._bankService.getStripeStatus().subscribe((res: any) => {
				this.stripeStatus = res?.data;
				this.chargesEnabled = this.stripeStatus?.charges_enabled;
				this.payoutEnabled = this.stripeStatus?.payout_enabled;
				this.detailsSubmitted = this.stripeStatus?.details_submitted;

				this._bankService.getPersonalVerification().subscribe((res: any) => {
					if (res?.errors?.code == '1005') {
						this.showStripePrompt = true;
					}
					if (
						this.chargesEnabled == true &&
						this.payoutEnabled == true &&
						this.detailsSubmitted == true
					) {
						this.showStripePrompt = false;
					} else if (
						this.chargesEnabled == false &&
						this.payoutEnabled == false &&
						this.detailsSubmitted == false
					) {
						this.showStripePrompt = true;
					} else if (
						this.chargesEnabled == true &&
						this.payoutEnabled == true &&
						this.detailsSubmitted == true
					) {
						this.showStripePrompt = false;
					} else {
						this.showStripePrompt = true;
					}

					// Route To Publish
					if (this.showStripePrompt == false) {
						this.publishFundraiser();
						// this.isSave = false;
					}
				});
			});
		}
	}

	publishFundraiser() {
		let publishBody = {
			slug: this.currentFundraiser?.slug,
		};
		this.fundraiserService.publishFundraiser(publishBody).subscribe(
			(response: any) => {
				this.notificationService.openNotification(
					$localize`:@@fundraiser_fundraiser_published_successfully_notification:Fundraisers published successfully`,
					'',
					'success'
				);
				if (this.isBrowser) window.location.reload();
				this.isSave = false;
			},
			(error: any) => {
				this.notificationService.openNotification(
					$localize`:@@fundraiser_there_was_an_error_notification:There was an error publishing Fundraiser`,
					'',
					'error'
				);
				this.isSave = false;
			}
		);
	}

	setCustomBranding(currentFundraiser: any) {
		// Set Custom Branding
		this._customBrandingService.setProfileObj = currentFundraiser?.profile;
		let customSettings = this._customBrandingService.getBrandingObj;

		if (customSettings.secondaryColor == this.whydonateSecondaryColor) {
			this.isWhydonateSecondatColor = true;
		}

		this.cardShadow = this._customBrandingService.calculateCardShadow(
			customSettings.cardShadow
		);
		this.fontFamily = customSettings.customFont;
		this._themeService.setTheme(
			customSettings?.primaryColor,
			customSettings?.secondaryColor,
			customSettings?.customFont
		);
	}

	setConnectedFundriserData() {
		this.appealMediaList = this.mediaService.getSliderMediaList(
			this.currentFundraiser?.appeal_image_list
		);
	}

	scrollUp() {
		if (this.isBrowser)
			window.scroll({
				top: 0,
				left: 0,
				behavior: 'smooth',
			});
	}

	handleImageError(event: any) {
		event.target.src = this.defaultProfileImage;
	}
}
