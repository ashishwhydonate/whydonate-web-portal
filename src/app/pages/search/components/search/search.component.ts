/**This component comes into action when Search is selected from the header */

import {
	AfterViewInit,
	Component,
	Inject,
	OnDestroy,
	OnInit,
	PLATFORM_ID,
	ViewChild,
} from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import {
	UntypedFormGroup,
	UntypedFormBuilder,
	UntypedFormControl,
} from '@angular/forms';
import {
	MatLegacyListOption as MatListOption,
	MatLegacySelectionList as MatSelectionList,
	MatLegacySelectionListChange as MatSelectionListChange,
} from '@angular/material/legacy-list';
import {
	LegacyProgressBarMode as ProgressBarMode,
	LegacyProgressAnimationEnd as ProgressAnimationEnd,
} from '@angular/material/legacy-progress-bar';
import { MatLegacyRadioChange as MatRadioChange } from '@angular/material/legacy-radio';
import { MatSidenav } from '@angular/material/sidenav';
import { interval, Subject, timer } from 'rxjs';
import { debounce, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Category } from 'src/app/shared/interfaces/category-interface';
import { FundraiserCardData } from 'src/app/shared/interfaces/fundraiser-card-interface';
import { FundraiserCardService } from 'src/app/shared/services/fundraiser-card.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import {
	SearchService,
	TYPE_ORGANISATION,
	TYPE_PERSONAL,
} from '../../services/search.service';
import { categories } from './category-data';
import { isPlatformBrowser } from '@angular/common';

/**
 * TITLE: Search component
 * DESCRIPTION: Component for '/search' route
 * TODO: get '@input()' fundraiserType from /home else default to 'organisation'
 * TODO: Since we don't know when is the last page, we should Toast a proper msg to the user when we hide show more button.
 */

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	/** *PAGE LOADER */
	isPageLoading: boolean;

	@ViewChild('categorySelector', { static: true })
	_categorySelector!: MatSelectionList;

	@ViewChild('drawer') drawer!: MatSidenav;

	searchInputForm: UntypedFormGroup;
	fundraiserTypeForm: UntypedFormGroup;
	organisation_fundraiserType: string = TYPE_ORGANISATION; //TODO: get '@input()' fundraiserType from /home else default to 'organisation'
	personal_fundraiserType: string = TYPE_PERSONAL; //TODO: get '@input()' fundraiserType from /home else default to 'organisation'
	debounceDelay: number = 1000; //debounce delay for search input and category selectionChange

	/** *static category data */
	readonly _categories = categories;
	/** *variables holds data during runtime */
	selectedCategories: Category[] = [];
	_fundraiserCardDataList!: {
		slug: string;
		fundraiserCardData: FundraiserCardData;
	}[];
	/** *param, loading and progress bar related flags */
	currentSearchPage: any;
	isLoading: boolean = false;
	progressBarMode: ProgressBarMode = 'determinate';
	progressbarValue: number = 0;
	isMoreFundraiserExist: boolean = true;
	nextPageIs: any;
	isBrowser: boolean = false;

	constructor(
		private _searchService: SearchService,
		public media: MediaObserver,
		_fundraiserCardService: FundraiserCardService,
		_formBuilder: UntypedFormBuilder,
		public notificationService: NotificationService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		// iconRegistry.addSvgIconSet(
		// 	sanitizer.bypassSecurityTrustResourceUrl('assets/icons/cat-defs.svg'));
		this.searchInputForm = _formBuilder.group({});
		this.fundraiserTypeForm = _formBuilder.group({});

		this.nextPageIs = 1;
		this.currentSearchPage = 1;

		this.isPageLoading = true;
	}

	/** *----------------------------------------------------------------------------------------------------- */
	/** *@ Lifecycle hooks */
	/** *----------------------------------------------------------------------------------------------------- */

	ngOnInit(): void {
		this.searchInputForm.setControl('searchCtrl', new UntypedFormControl());
		this.fundraiserTypeForm.setControl(
			TYPE_ORGANISATION,
			new UntypedFormControl(false)
		);
		this.fundraiserTypeForm.setControl(
			TYPE_PERSONAL,
			new UntypedFormControl(false)
		);

		this.startLoading();
		this.startQueryProgress();

		this._searchService.setParam = this._searchService.getDefaultParams;

		/** *INFO: Show initial Fundraiser data on card with default parameter */
		this._searchService
			.searchFundraiser(this._searchService.getDefaultParams)
			.subscribe((response: any) => {
				this.scrollUp();
				this._fundraiserCardDataList =
					this._searchService.getSearchFundraiserCardDataListElasticSearch(
						(response as any).data
					);

				/** *loading flag and progress bar setting */
				this.startDeterminateProgress();
				this.finishDeterminateProgress();
				this.isPageLoading = false;
			});
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		/** *Unsubscribe from all subscriptions */
		this._unsubscribeAll.complete();
	}

	/** *Events start */
	ngAfterViewInit(): void {
		/** *Subscribed to search input on valuechange event. Added pipe to optimsed the API call */
		this.searchInputForm?.controls.searchCtrl.valueChanges
			.pipe(
				debounce(() => {
					return interval(this.debounceDelay);
				}),
				distinctUntilChanged((x: any, y: any) => {
					/** *INFO: If no actual change then cancel the loading and Search */
					if (x === y) {
						this.cancelLoadingAndProgress();
						return true;
					}
					return false;
				})
			)
			.subscribe((data: string) => {
				/** *loading flag and progress bar setting */
				this.startLoading();
				this.startQueryProgress();
				// this.progressbarValue = 0;
				/** *INFO: If data is null or undefined then assign emtry param */
				this._searchService.setQueryString = data || '';
				this.currentSearchPage = 1;
				/** *call search function and update the card */
				this._searchService
					.searchFundraiser(this._searchService.getSearchParams)
					.pipe(takeUntil(this._unsubscribeAll))
					.subscribe((response: any) => {
						this.startDeterminateProgress();

						this._fundraiserCardDataList =
							this._searchService.getSearchFundraiserCardDataListElasticSearch(
								(response as any)?.data
							);
						console.log('dataxxxxx', this._fundraiserCardDataList);
						let searchedCardsCount = this._fundraiserCardDataList?.length;
						this.isShowInfinitScroll(searchedCardsCount);

						this.finishDeterminateProgress();
					});
			});

		this.fundraiserTypeForm.valueChanges.subscribe((data: any) => {
			// SET TYPE
			this.setFundraiserTypePayload(data);
			/** *loading flag and progress bar setting */
			this.startLoading();
			this.startQueryProgress();

			/** *call search function and update the card */
			this._searchService
				.searchFundraiser(this._searchService.getSearchParams)
				.pipe(takeUntil(this._unsubscribeAll))
				.subscribe((response: any) => {
					this.startDeterminateProgress();

					this._fundraiserCardDataList =
						this._searchService.getSearchFundraiserCardDataListElasticSearch(
							(response as any)?.data
						);

					let searchedCardsCount = this._fundraiserCardDataList?.length;
					this.isShowInfinitScroll(searchedCardsCount);

					this.finishDeterminateProgress();
				});
		});

		this._categorySelector.selectionChange
			.pipe(
				debounce(() => {
					return interval(this.debounceDelay);
				})
			)
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((matListChange: MatSelectionListChange) => {
				/** *progress bar setting */
				this.startQueryProgress();

				let selectedCategoriesValue = this.selectedCategories
					.map((cat) => cat.id)
					.join(',');

				/** *INFO: If selectedCategories value changed then assign to category param and call API */
				if (
					selectedCategoriesValue !== this._searchService.getCategoryParamValue
				) {
					/** *set updated category to params */
					this._searchService.setCategory = selectedCategoriesValue;

					/** *call search function and update the card */
					this._searchService
						.searchFundraiser(this._searchService.getSearchParams)
						.pipe(takeUntil(this._unsubscribeAll))
						.subscribe((response: any) => {
							this._fundraiserCardDataList =
								this._searchService.getSearchFundraiserCardDataListElasticSearch(
									(response as any)?.data
								);
							let searchedCardsCount = this._fundraiserCardDataList?.length;
							this.isShowInfinitScroll(searchedCardsCount);

							/** *progress bar and loading flag */
							this.startDeterminateProgress();
							this.finishDeterminateProgress();
						});
				} else this.cancelLoadingAndProgress();
			});
	}

	setFundraiserTypePayload(formValue: any) {
		if (
			formValue[TYPE_PERSONAL] === true &&
			formValue[TYPE_ORGANISATION] === false
		) {
			this._searchService.setTypePersonal();
			return;
		}
		if (
			formValue[TYPE_ORGANISATION] === true &&
			formValue[TYPE_PERSONAL] === false
		) {
			this._searchService.setTypeOrganisation();
			return;
		} else this._searchService.setTypeBoth();
	}

	progressAnimationEnd(e: ProgressAnimationEnd) {
		this.isLoading = false;
	}

	/** *selection list event */
	onCategorySelectionChange(
		matListChange: MatSelectionListChange,
		matList: MatSelectionList
	) {
		/** *loading flag and progress bar setting */
		this.startLoading();
		this.startIndeterminateProgress();

		/** *check if the selection change on category is 'selected' or 'deselected' */
		let isSelected: boolean = matList.selectedOptions.isSelected(
			matListChange.options[0]
		);

		/** *get changed category */
		let category: Category = matListChange.options[0].value;

		if (isSelected) {
			this.selectedCategories.push(category);
		} else {
			let index = this.selectedCategories.indexOf(category);
			if (index >= 0) {
				this.selectedCategories.splice(index, 1);
			}
		}

		/** *Close drawer if opened in mobile */
		this.closeSideBar();
	}

	/** *matchip event */
	removeFromSelectedCategoryList(_category: any) {
		/** *loading flag and progress bar setting */
		this.startLoading();
		this.startQueryProgress();

		let MatListOptionFromChip = this._categorySelector.options.find(
			(ele: { value: any }) => ele.value === _category
		) as MatListOption;

		this._categorySelector.selectedOptions.deselect(MatListOptionFromChip);

		let index = this.selectedCategories.indexOf(_category);

		if (index >= 0) {
			this.selectedCategories.splice(index, 1);
		}
		/** *set updated category to params */
		this._searchService.setCategory = this.selectedCategories
			.map((cat) => cat.id)
			.join(',');

		/** *call search function and update the card */
		this._searchService
			.searchFundraiser(this._searchService.getSearchParams)
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((response: any) => {
				this._fundraiserCardDataList =
					this._searchService.getSearchFundraiserCardDataListElasticSearch(
						(response as any)?.data
					);
				let searchedCardsCount = this._fundraiserCardDataList?.length;
				this.isShowInfinitScroll(searchedCardsCount);

				/** *progress bar and loading flag */
				this.startDeterminateProgress();
				this.finishDeterminateProgress();
			});
	}

	/**
	 * DESCRIPTION: 'Show more' button On Click event - infinite scroll
	 *  To allow infinite scrolling for better UX, we are not showing pagination.
	 * On clickig show more button, we increment page param and call API.
	 * If data exist then append the new fundraiser data, If not then stop infinite scroll
	 * TODO: Since we don't know when is the last page, we should Toast a proper msg to the user when we hide show more button.
	 */
	showMoreFundraiserCards() {
		/** *loading flag and progress bar setting */
		this.startLoading();
		this.startQueryProgress();

		this.setParamForNextPage();
		/** *call search function and update the card */
		this._searchService
			.searchFundraiser(this._searchService.getSearchParams)
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((response: any) => {
				let newFundraiserCardDataList =
					this._searchService.getSearchFundraiserCardDataListElasticSearch(
						(response as any)?.data
					);

				let newCardsCount = newFundraiserCardDataList?.length;

				if (newCardsCount) {
					this._fundraiserCardDataList = [
						...this._fundraiserCardDataList,
						...newFundraiserCardDataList,
					];
				}
				this.checkIfInfiniteScrollEnded(newCardsCount);

				/** *progress bar and loading flag */
				this.startDeterminateProgress();
				this.finishDeterminateProgress();
			});
	}

	/** *onClick clear all button */
	clearAll() {
		/** *this._categorySelector.selectedOptions.clear(); */
		this._categorySelector.deselectAll();
		this.selectedCategories = [];
		this._searchService.setParam = this._searchService.getDefaultParams;

		/**
		 * ! NOTE:
		 * If we try to Form.reset() twice, distinctUntilChanged will stop from calling since second time value will be same (null).
		 * This creates a side effect when we are clear all the category selection multple time.
		 * Hence, we are checking if search input ctrl is empty then don't reset and call search api in else.
		 * Form.reset() emits change while _categorySelector.deselectAll() do not.
		 * */
		if (this.searchInputForm?.controls.searchCtrl.value) {
			/** *INFO: reset() will trigger onValueChange and it will load the data with Default params */
			this.searchInputForm.reset();
		} else {
			/** *loading flag and progress bar setting */
			this.startLoading();
			this.startQueryProgress();
			/** *call search function and update the card */
			this._searchService
				.searchFundraiser(this._searchService.getSearchParams)
				.pipe(takeUntil(this._unsubscribeAll))
				.subscribe((response: any) => {
					this._fundraiserCardDataList =
						this._searchService.getSearchFundraiserCardDataListElasticSearch(
							(response as any)?.data
						);
					/** progress bar and loading flag */
					this.startDeterminateProgress();
					this.finishDeterminateProgress();
					// this.resetInfiniteScroll();
					this.resetInfiniteScroll();
				});
		}
	}

	/** *helper functions */
	/** *Increment current page number and set it to the param */
	setParamForNextPage() {
		const nextPage = this.currentSearchPage++;
		this._searchService.setPage = nextPage;
	}

	/** *set flags for infinite scroll based on fundraiser count and show notification if end of fundraiser is reached. */
	checkIfInfiniteScrollEnded(cardsCount: number) {
		/** *after any change the current page should be reset (currentSearchPage is use in search params) */
		if (cardsCount < this._searchService.DEFAULT_PAGE_SIZE)
			this.stopInfiniteScroll();
		else this.resetInfiniteScroll();
	}
	/** *set flags for infinite scroll based on fundraiser count. */
	isShowInfinitScroll(cardsCount: number) {
		if (cardsCount < this._searchService.DEFAULT_PAGE_SIZE)
			this.isMoreFundraiserExist = false;
		else this.resetInfiniteScroll();
	}

	/** *when Clear All is clicked or fundraisers data >= 24 */
	resetInfiniteScroll() {
		this.isMoreFundraiserExist = true;
	}

	/** *when search result has fundraisers data < 24 */
	stopInfiniteScroll() {
		this.isMoreFundraiserExist = false;
		// NOTIFY USER THAT THERE ARE NO MORE FUNDRAISERS
		this.notificationService.openNotification(
			$localize`:@@search_noMoreFundraisers_notification:There are no more fundraisers available.`,
			'OK',
			'error'
		);
	}

	/** *Set isLoading to true. */
	startLoading() {
		this.isLoading = true;
	}

	/** *When user interacts with filter but no API is called yet. */
	startIndeterminateProgress() {
		/** *while user is giving input set the progress mode as indeterminate */
		this.progressBarMode = 'indeterminate';
		this.startLoading();
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
		this.isLoading = false;
	}

	/**
	 *  On setting progressBarValue 100, matProgressBar emits progressAnimationEnd when animation ends.
	 * Thats right time to change loading related flags to false.
	 * NOTE: progressBatMode should be 'determinate' before calling this function
	 */
	finishDeterminateProgress() {
		let subscribe = timer(100).subscribe((val: any) => {
			this.progressbarValue = 100;
			subscribe.unsubscribe();
		});
	}
	/** *used for showing Clear All button */
	isDirty() {
		return (
			this.selectedCategories.length ||
			this.searchInputForm?.controls.searchCtrl.value
		);
	}

	/** *Close drawer if opened in mobile */
	closeSideBar() {
		if (this.media.isActive('xs')) {
			this.drawer.close();
		}
	}

	scrollUp() {
		if (this.isBrowser)
			window.scroll({
				top: 0,
				left: 0,
				behavior: 'smooth',
			});
	}
}
