/**This component provides view of all fundraisers and connected fundraisers made by a registered user */

import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
	FormControl,
	UntypedFormBuilder,
	UntypedFormControl,
	UntypedFormGroup,
} from '@angular/forms';
import {
	LegacyProgressAnimationEnd as ProgressAnimationEnd,
	LegacyProgressBarMode as ProgressBarMode,
} from '@angular/material/legacy-progress-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, timer } from 'rxjs';
import { debounce, distinctUntilChanged } from 'rxjs/operators';
import { APIService } from 'src/app/global/services/api.service';
import { HttpParams } from '@angular/common/http';
import { FundraiserCardService } from 'src/app/shared/services/fundraiser-card.service';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import { CurrencySelectorService } from 'src/app/shared/services/currency-selector.service';

export interface MyFundraisersTab {
	label: string;
	count: number;
	content: any[];
}
@Component({
	selector: 'app-my-fundraisers',
	templateUrl: './my-fundraisers.component.html',
})
/** *My Fundraisers Component */
export class MyFundraisersComponent implements OnInit, AfterViewInit {
	searchInputForm: UntypedFormGroup;
	debounceDelay: number = 1000; //debounce delay for search input and category selectionChange
	fundraiserDataList: any[] = [];
	//* param, loading and progress bar related flags
	progressBarMode: ProgressBarMode = 'determinate';
	progressbarValue: number = 0;
	isMoreFundraiserExist: boolean = true;
	fundraisersTotalCount: number = 0;
	filter = '';
	pageLimit = {
		drafts: 0,
		published: 0,
		closed: 0,
	};
	selectedTab = 0;
	/** *FLags */
	isCountLoading: boolean = false;
	isTabLoading = false;

	temp: boolean = true;

	type: string = '';
	tempLoader: boolean = false;
	types: any = [
		{
			id: 0,
			displayedName: $localize`:@@fundraisers_filter_list_all:All`,
			filterName: 'all',
		},
		{
			id: 1,
			displayedName: $localize`:@@create_fundraiser_fundraiser_status_radioGroup_open:Open`,
			filterName: 'open',
		},
		{
			id: 2,
			displayedName: $localize`:@@create_fundraiser_fundraiser_status_radioGroup_draft:Draft`,
			filterName: 'draft',
		},
		{
			id: 3,
			displayedName: $localize`:@@create_fundraiser_fundraiser_status_radioGroup_published:Published`,
			filterName: 'published',
		},
		{
			id: 4,
			displayedName: $localize`:@@create_fundraiser_fundraiser_status_radioGroup_close:Closed`,
			filterName: 'closed',
		},
		{
			id: 5,
			displayedName: $localize`:@@dashboard_fundraiser_summary_main:Main`,
			filterName: 'main',
		},
		{
			id: 6,
			displayedName: $localize`:@@dashboard_fundraiser_summary_connected:Connected`,
			filterName: 'connected',
		},
		{
			id: 7,
			displayedName: $localize`:@@fundraisers_filter_list_findable:Findable`,
			filterName: 'findable',
		},
		{
			id: 8,
			displayedName: $localize`:@@fundraisers_filter_list_nonFindable:Non-Findable`,
			filterName: 'non_findable',
		},
		{
			id: 9,
			displayedName: $localize`:@@fundraisers_filter_list_owned_connected:Owned-Connected`,
			filterName: 'owned_connected',
		},
	];
	filters: FormControl = new FormControl('all'); //Interval variable for setting the payout interval
	selectedFilter: any;
	myFundraiserDataList: any[] = [];
	fundraiserCount: number = 0;
	totalCount: number = 0;
	page: number = 1;
	isLoading: boolean = true;
	queryParameterValue: any;
	fundraiserCreated: boolean = true;
	currencyObject: any = {};
	currencies: any[] = [];
	defaultCurrency: string = '*';
	constructor(
		private _fundraiserCardService: FundraiserCardService,
		public _APIService: APIService,
		_formBuilder: UntypedFormBuilder,
		private _router: Router,
		public activatedRoute: ActivatedRoute,
		public _dashboardService: DashboardService,
		public currencyService: CurrencySelectorService
	) {
		this.searchInputForm = _formBuilder.group({});

		/** *Set loading flags true */
		this.isCountLoading = true;
	}

	ngOnInit(): void {
		this.searchInputForm.setControl('searchCtrl', new UntypedFormControl());
		// this.currencyObject = this.currencyService.getSelectedCurrency();
		this.getUserCurrencyList();
		this.currencyService.selectedCurrency.subscribe((res) => {
			this.currencyObject = res;

			this.queryParameterValue =
				this.activatedRoute.snapshot.queryParamMap.get('filter');

			if (this.queryParameterValue) {
				this.filters.setValue(this.queryParameterValue);
				this.selectedFilter = this.queryParameterValue;
				this._dashboardService
					.getMyfundraisersAll(
						new HttpParams({
							fromObject: {
								['status']: this.queryParameterValue,
								['filter']: '',
								['page']: 1,
								['page_size']: 12,
								['currency']:
									this.currencyObject?.currency || this.defaultCurrency,
							},
						})
					)
					.subscribe((res: any) => {
						this.totalCount = res?.data?.count;
						let cardData =
							this._fundraiserCardService.filterFundraiserCardDataList(
								res?.data?.list
							);
						this.myFundraiserDataList = cardData;
						this.tempLoader = true;

						// console.log('12345', this.myFundraiserDataList);
						this.isLoading = false;
						if (this.totalCount) {
							this.tempLoader = true;
						}

						if (res) {
							this._router.navigate([], {
								queryParams: {
									filter: null, // Remove category query param
								},
								queryParamsHandling: 'merge',
							});
						}
					});
			} else {
				this.getAllFundraisers();
			}

			/** *Subscribed to filter input on valuechange event. Added pipe to optimsed the API call */
			this.filters.valueChanges
				.pipe(
					debounce(() => {
						this.startTabsLoading();
						this.startQueryProgress();
						this.tempLoader = false;

						return interval(this.debounceDelay);
					}),
					distinctUntilChanged((x, y) => {
						/** *INFO: If no actual change then cancel the loading and Search */
						if (x === y) {
							// console.log(`query x: ${x}, y: ${y} are identical, api called interrupted`);
							this.cancelLoadingAndProgress();
							return true;
						}
						// if (this.isLoading && this.progressBarMode === 'query') {
						// 	//TODO: If true then, new API request made while one is already running. (user switchMap from rxjs to resolve this scenario: https://www.learnrxjs.io/learn-rxjs/operators/transformation/switchmap)
						// }
						return false;
					})
				)
				.subscribe((res: any) => {
					this.selectedFilter = res;
					this._dashboardService
						.getMyfundraisersAll(
							new HttpParams({
								fromObject: {
									['status']: res,
									['filter']: '',
									['page']: 1,
									['page_size']: 12,
									['currency']:
										this.currencyObject?.currency || this.defaultCurrency,
								},
							})
						)
						.subscribe((res: any) => {
							this.totalCount = res?.data?.count;

							let cardData =
								this._fundraiserCardService.filterFundraiserCardDataList(
									res?.data?.list
								);
							this.myFundraiserDataList = cardData;
							// Reset the page when the filter changes
							this.page = 1;
							if (res) {
								this.searchInputForm?.controls.searchCtrl.setValue('');
							}
							this.isLoading = false;
							this.tempLoader = true;
						});

					// Set the totalCount property
				});

			/** *Subscribed to search input on valuechange event. Added pipe to optimsed the API call */
			this.searchInputForm?.controls.searchCtrl.valueChanges
				.pipe(
					debounce(() => {
						this.tempLoader = false;
						return interval(this.debounceDelay);
					}),
					distinctUntilChanged((x, y) => {
						/** *INFO: If no actual change then cancel the loading and Search */
						if (x === y) {
							// console.log(`query x: ${x}, y: ${y} are identical, api called interrupted`);
							this.cancelLoadingAndProgress();
							return true;
						}
						// if (this.isLoading && this.progressBarMode === 'query') {
						// 	//TODO: If true then, new API request made while one is already running. (user switchMap from rxjs to resolve this scenario: https://www.learnrxjs.io/learn-rxjs/operators/transformation/switchmap)
						// }
						return false;
					})
				)
				.subscribe((data) => {
					/** *loading flag and progress bar setting */
					this.startTabsLoading();
					this.startCountLoading();
					this.startQueryProgress();
					// console.log('native fromControl value changes with debounce: ', data);
					/** *INFO: If data is null or undefined then assign emtry param */
					this._dashboardService
						.getMyfundraisersAll(
							new HttpParams({
								fromObject: {
									['status']: this.selectedFilter ? this.selectedFilter : 'all',
									['filter']: data,
									['page']: 1,
									['page_size']: 12,
									['currency']:
										this.currencyObject?.currency || this.defaultCurrency,
								},
							})
						)
						.subscribe((res: any) => {
							this.totalCount = res?.data?.count;
							let cardData =
								this._fundraiserCardService.filterFundraiserCardDataList(
									res?.data?.list
								);
							this.myFundraiserDataList = cardData;
							this.tempLoader = true;
							this.isLoading = false;
							this.fundraiserCreated = true;
						});
				});
		});
	}

	ngAfterViewInit(): void {
		this.switchCurrency(this.defaultCurrency);
	}
	getAllFundraisers() {
		this.tempLoader = false;
		this._dashboardService
			.getMyfundraisersAll(
				new HttpParams({
					fromObject: {
						['status']: 'all',
						['filter']: '',
						['page']: 1,
						['page_size']: 12,
						['currency']: this.currencyObject?.currency || this.defaultCurrency,
					},
				})
			)
			.subscribe((res: any) => {
				if (res?.data && res?.data?.list?.length > 0) {
					this.totalCount = res?.data?.count;
					let cardData =
						this._fundraiserCardService.filterFundraiserCardDataList(
							res?.data?.list
						);
					this.myFundraiserDataList = cardData;

					this.fundraiserCreated = true;

					this.isLoading = false;
					this.tempLoader = true;
				} else {
					// No data received from the API
					this.fundraiserCreated = false; // Set the boolean to false
					this.isLoading = false;
					this.tempLoader = true;
				}
				// console.log('12345', this.myFundraiserDataList);
			});
	}

	viewMore() {
		this.page = this.page + 1;
		this.startTabsLoading();
		this.startQueryProgress();
		this._dashboardService
			.getMyfundraisersAll(
				new HttpParams({
					fromObject: {
						['status']: this.selectedFilter ? this.selectedFilter : 'all',
						['page']: this.page,
						['page_size']: 12,
						['filter']: '',
						['currency']: this.currencyObject?.currency || this.defaultCurrency,
					},
				})
			)
			.subscribe(
				(res: any) => {
					this.totalCount = res?.data?.count;
					let cardData =
						this._fundraiserCardService.filterFundraiserCardDataList(
							res?.data?.list
						);
					this.myFundraiserDataList = [
						...this.myFundraiserDataList,
						...cardData,
					];
					if (this.totalCount) {
						this.tempLoader = true;
					}
					// this.setProgressbar(res?.label);
					this.finishCountLoading();
					this.cancelLoadingAndProgress();
					this.isLoading = false;
				},
				(error) => {
					this._APIService.handleError(error).subscribe(
						() => {},
						(errorMessage) => {
							this._router.navigate(['account']);
						}
					);
				}
			);
	}

	// Tab index change event
	logIndex(e: any) {
		this.selectedTab = e;
	}

	/** *Set isLoading to true. */
	startTabsLoading() {
		this.isLoading = true;
	}
	startCountLoading() {
		this.isCountLoading = true;
	}
	finishCountLoading() {
		this.isCountLoading = false;
	}

	/** *When user interacts with filter but no API is called yet. */
	startIndeterminateProgress() {
		// while user is giving input set the progress mode as indeterminate
		this.progressBarMode = 'indeterminate';
		this.startCountLoading();
		this.startTabsLoading();
	}
	/** *Mat Progress Bar - mode: query */
	startQueryProgress() {
		this.progressBarMode = 'query';
	}
	/** *Mat Progress Bar - mode: determinate & value: 0 */
	startDeterminateProgress() {
		this.progressBarMode = 'determinate';
		this.progressbarValue = 0;
	}
	/** *Mat Progress Bar - mode: determinate & value: 100 */
	cancelLoadingAndProgress() {
		this.progressBarMode = 'determinate';
		this.progressbarValue = 100;
		this.isCountLoading = false;
		this.isLoading = false;
	}
	finishDeterminateProgress() {
		let subscribe = timer(100).subscribe((val) => {
			this.progressbarValue = 100;
			subscribe.unsubscribe();
		});
	}
	progressAnimationEnd(e: ProgressAnimationEnd) {
		// 	console.log('progressAnimationEnd');
		// 	// this.isLoading = false;
	}
	getUserCurrencyList() {
		this.currencyService
			.getUserCurrencyListForMyFundraisers()
			?.subscribe((res: any) => {
				if (res?.data?.currencies?.length > 0) {
					this.currencies = res?.data?.currencies;
					// SET DEFAULT CURRENCY
					// this.defaultCurrency = '*';
					this.currencyService.setSelectedCurrency(this.defaultCurrency);
					this.totalCount = res?.data?.count;
				}
			});
	}

	switchCurrency(value: any) {
		if (value == '*') {
			// Handle "All" option
			this.isLoading = true; // Set loading flag
			this.myFundraiserDataList = []; // Clear the existing data
			this._dashboardService
				.getMyfundraisersAll(
					new HttpParams({
						fromObject: {
							status: this.selectedFilter || 'all',
							filter: '',
							page: 1,
							page_size: 12,
							currency: '*', // Pass 'all' as the currency
						},
					})
				)
				.subscribe((res: any) => {
					this.isLoading = false; // Turn off loading flag
					this.totalCount = res?.data?.count;
					let cardData =
						this._fundraiserCardService.filterFundraiserCardDataList(
							res?.data?.list
						);
					this.myFundraiserDataList = cardData;
				});
		} else {
			// Handle other currency selections
			this.currencyService.setSelectedCurrency(value);
			this.isLoading = true; // Set loading flag
			this.myFundraiserDataList = []; // Clear the existing data
			this._dashboardService
				.getMyfundraisersAll(
					new HttpParams({
						fromObject: {
							status: this.selectedFilter || 'all',
							filter: '',
							page: 1,
							page_size: 12,
							currency: this.currencyObject?.currency || '*',
						},
					})
				)
				.subscribe((res: any) => {
					this.isLoading = false; // Turn off loading flag
					this.totalCount = res?.data?.count;
					let cardData =
						this._fundraiserCardService.filterFundraiserCardDataList(
							res?.data?.list
						);
					this.myFundraiserDataList = cardData;
				});
		}
	}
}
