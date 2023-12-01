import {
	AfterViewInit,
	Component,
	Inject,
	Input,
	OnChanges,
	OnInit,
	PLATFORM_ID,
	SimpleChanges,
} from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import {
	UntypedFormBuilder,
	UntypedFormGroup,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { log } from 'console';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { Fundraiser } from 'src/app/pages/fundraiser/models/fundraiser';
import { FundraiserService } from 'src/app/pages/fundraiser/services/fundraiser.service';
import { BankService } from 'src/app/pages/user/profile/services/bank.service';
import { FundraiserCardData } from 'src/app/shared/interfaces/fundraiser-card-interface';
import { FundraiserCardService } from 'src/app/shared/services/fundraiser-card.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-target-amount',
	templateUrl: './target-amount.component.html',
})
export class TargetAmountComponent implements OnInit, OnChanges, AfterViewInit {
	@Input() currentFundraiserData: any = {};

	fundraiserCardData!: FundraiserCardData;
	editFundraiserForm!: UntypedFormGroup;
	minEndDate: string | any;

	donationProgress = 0;

	isTargetAmountDisable: boolean = true;
	isSaveTargetAmount: boolean = false;
	isFindable: any;
	isOpened: any;
	isDraft: any;
	chargesEnabled!: boolean;
	payoutEnabled!: boolean;
	stripeStatus: any = {};
	detailsSubmitted!: boolean;
	showStripePrompt!: boolean;
	oppVerificationCheck: boolean = false;
	isSave = false;
	isLoading = false;
	isCurrentChildFundraiser: any;
	disableButton: boolean = false;
	disableEndButton: boolean = true;
	unlimitedDateCheck: boolean = true;
	disableDonateButton: boolean = true;
	currency_symbol: string = '';
	currencyConversionFactor: number = 1;
	maxTargetAmount: number = 99;
	minTargetAmount: number = 5;
	isBrowser: boolean = false;
	constructor(
		public _media: MediaObserver,
		private _formBuilder: UntypedFormBuilder,
		private _fundraiserService: FundraiserService,
		private _fundraiserCardService: FundraiserCardService,
		private notificationService: NotificationService,
		private _bankService: BankService,
		public router: Router,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}
	ngOnChanges(changes: SimpleChanges): void {
		if (Object.keys(changes.currentFundraiserData?.currentValue || {}).length) {
			this.setControlsAndFlags();
		}

		this.disableButton = this.currentFundraiserData?.is_draft;
	}

	ngOnInit(): void {
		this.editFundraiserForm = this._formBuilder.group({
			id: '',
			amount_target: ['', [Validators.min(10), Validators.max(999999)]],
			end_date: '',
			// allow_connected_fundraisers: false,
			show_donation_details: false,
			unlimited: false,
			open_status: false,
			visible_status: false,
		});

		if (this.isBrowser)
			this.isCurrentChildFundraiser =
				this.getBool(localStorage.getItem('childFundraiser')) || false;
	}
	ngAfterViewInit(): void {}
	getBool(val: any) {
		return !!JSON.parse(String(val)?.toLowerCase());
	}

	setControlsAndFlags() {
		// let allow_child = this.getBool(this.currentFundraiserData?.allow_child);
		console.log('SET1', this.currentFundraiserData);
		let show_donation_details = this.getBool(
			this.currentFundraiserData?.show_donation_details
		);
		this.currency_symbol = this.currentFundraiserData?.symbol;
		this.currencyConversionFactor = this.currentFundraiserData?.x_to_eur;
		this.maxTargetAmount = this.currencyConversionFactor * 999999;
		this.minTargetAmount = this.currencyConversionFactor * 5;

		let findable = this.getBool(this.currentFundraiserData?.is_findable);
		if (this.getBool(this.currentFundraiserData.is_opened) == false) {
			this.disableEndButton = false;
		} else {
			this.disableEndButton = true;
		}
		let open = this.getBool(this.currentFundraiserData?.is_opened);

		let unlimited = this.getBool(this.currentFundraiserData?.unlimited);
		let isEndDateUnlimited: boolean = false;

		if (
			this.currentFundraiserData?.end_date != undefined &&
			this.currentFundraiserData?.end_date != null
		) {
			isEndDateUnlimited =
				this._fundraiserCardService?.isFundraiserEndDateUnlimited(
					this.currentFundraiserData?.end_date
				) || false;
		}

		this.editFundraiserForm = this._formBuilder.group({
			id: [this.currentFundraiserData?.id],
			amount_target: [
				this.currentFundraiserData?.amount_target || '',
				[
					Validators.min(this.minTargetAmount),
					Validators.max(this.maxTargetAmount),
				],
			],
			end_date: [
				!isEndDateUnlimited && this.currentFundraiserData?.end_date
					? this.currentFundraiserData?.end_date
					: '',
			],
			// allow_connected_fundraisers: [allow_child],
			show_donation_details: [show_donation_details],
			unlimited: [unlimited],
			open_status: [open],
			visible_status: [findable],
		});

		// console.log('ISENDDATE', isEndDateUnlimited);
		if (!isEndDateUnlimited) {
			this.minEndDate = new Date().toISOString();
		} else {
			this.minEndDate = new Date().toISOString();
		}

		this.fundraiserCardData =
			this._fundraiserCardService.filterFundraiserCardDataListCustomDonation([
				this.currentFundraiserData,
			])?.[0]?.fundraiserCardData;
	}

	/** *Edit Target Amount Done */
	targetAmountChange(value: any) {
		if (value != null) {
			if (value > 999999) return;
			this.isTargetAmountDisable = false;

			let _fundraiserCardData = Object.create(this.fundraiserCardData);
			_fundraiserCardData.donationTargetAmount = value;

			this.fundraiserCardData = _fundraiserCardData;
		} else {
			let _fundraiserCardData = Object.create(this.fundraiserCardData);
			_fundraiserCardData.donationTargetAmount = value;

			this.fundraiserCardData = _fundraiserCardData;
		}
	}
	endDateChange(value: any) {
		if (value != null) {
			this.isTargetAmountDisable = false;

			let _fundraiserCardData = Object.create(this.fundraiserCardData);

			_fundraiserCardData.donationDaysLeft =
				this._fundraiserCardService.countDaysLeftToFundraiserEnd(value);

			if (_fundraiserCardData.donationDaysLeft == 0) {
				this.unlimitedDateCheck = false;
			} else {
				this.unlimitedDateCheck = true;
			}

			this.fundraiserCardData = _fundraiserCardData;
		} else {
			value = '';
			this.isTargetAmountDisable = false;

			let _fundraiserCardData = Object.create(this.fundraiserCardData);

			_fundraiserCardData.donationDaysLeft =
				this._fundraiserCardService.countDaysLeftToFundraiserEnd(value);

			if (_fundraiserCardData.donationDaysLeft == 0) {
				this.unlimitedDateCheck = false;
			} else {
				this.unlimitedDateCheck = true;
			}

			this.fundraiserCardData = _fundraiserCardData;
		}
	}
	targetToggleChange() {
		this.isTargetAmountDisable = false;

		let _fundraiserCardData = Object.create(this.fundraiserCardData);

		_fundraiserCardData.showDonationAmount =
			this.editFundraiserForm.value['show_donation_details'];
		this.fundraiserCardData = _fundraiserCardData;
	}

	//Handling toggle of Open/Close
	targetOpenStatus(event: MatSlideToggleChange) {
		let isEndDateUnlimited: boolean = false;
		this.disableEndButton = event.checked;
		this.isTargetAmountDisable = false;

		let currentDate = new Date();
		let yesterDaysvalue = moment(currentDate)
			.subtract(1, 'days')
			.format('YYYY-MM-DD');

		if (
			this.disableEndButton == true &&
			this.editFundraiserForm.value['end_date'] == yesterDaysvalue
		) {
			this.editFundraiserForm.controls['end_date'].setValue('');
			let _fundraiserCardData = Object.create(this.fundraiserCardData);
			_fundraiserCardData.donationDaysLeft = '';
			this.fundraiserCardData = _fundraiserCardData;
		}

		if (this.isTargetAmountDisable == false) {
			let _fundraiserCardData = Object.create(this.fundraiserCardData);

			// this.fundraiserCardData = _fundraiserCardData;
			// console.log('FORM2', this.editFundraiserForm.value['end_date']);
			if (
				this.disableEndButton == true &&
				this.editFundraiserForm.value['end_date'] !== null
			) {
				this.unlimitedDateCheck = false;
				let _fundraiserCardData = Object.create(this.fundraiserCardData);
				_fundraiserCardData.donationDaysLeft =
					this._fundraiserCardService.countDaysLeftToFundraiserEnd(
						this.editFundraiserForm.value['end_date']
					);
				// console.log('HITTT', _fundraiserCardData.donationDaysLeft);
				this.fundraiserCardData = _fundraiserCardData;
			} else {
				let currentDate = new Date();
				let value = moment(currentDate)
					.subtract(1, 'days')
					.format('YYYY-MM-DD');
				_fundraiserCardData.donationDaysLeft =
					this._fundraiserCardService.countDaysLeftToFundraiserEnd(value);

				this.fundraiserCardData = _fundraiserCardData;
			}
		}
	}

	discardTargetAmountChanges() {
		let isEndDateUnlimited =
			this._fundraiserCardService?.isFundraiserEndDateUnlimited(
				this.currentFundraiserData?.end_date
			);
		this.editFundraiserForm = this._formBuilder.group({
			id: [this.currentFundraiserData?.id],
			amount_target: [
				this.currentFundraiserData?.amount_target || '',
				[
					Validators.min(this.minTargetAmount),
					Validators.max(this.maxTargetAmount),
				],
			],
			end_date: [
				!isEndDateUnlimited ? this.currentFundraiserData?.end_date : '',
			],
			// allow_connected_fundraisers: [this.currentFundraiserData?.allow_child],
			show_donation_details: [
				this.currentFundraiserData?.show_donation_details,
			],
			unlimited: [this.currentFundraiserData?.unlimited],
			open_status: [this.getBool(this.currentFundraiserData?.is_opened)],
			visible_status: [this.getBool(this.currentFundraiserData?.is_findable)],
		});

		this.isTargetAmountDisable = true;
	}
	saveAndApply() {
		this.isSaveTargetAmount = true;
		this.isTargetAmountDisable = true;
		if (this.editFundraiserForm.valid) {
			const fundraisingPayload = this.editFundraiserForm.value;
			// fundraisingPayload['allow_child'] =
			// 	this.editFundraiserForm.value.allow_connected_fundraisers;
			if (
				this.editFundraiserForm.value['amount_target'] != null ||
				this.editFundraiserForm.value['end_date'] != null
			) {
				fundraisingPayload['unlimited'] = false;
			} else {
				fundraisingPayload['unlimited'] = true;
			}

			if (this.editFundraiserForm.value['open_status']) {
				if (this.editFundraiserForm.value['end_date']) {
					fundraisingPayload['end_date'] = moment(
						this.editFundraiserForm.value['end_date']
					).format('YYYY-MM-DD');
				} else {
					fundraisingPayload['end_date'] =
						moment('9999-12-31').format('YYYY-MM-DD');
					this.unlimitedDateCheck = false;
				}
			} else {
				let currentDate = new Date();
				fundraisingPayload['end_date'] = moment(currentDate)
					.subtract(1, 'days')
					.format('YYYY-MM-DD');
			}

			if (this.editFundraiserForm.value['show_donation_details']) {
				fundraisingPayload['show_donation_details'] = true;
			} else {
				fundraisingPayload['show_donation_details'] = false;
			}
			if (!this.editFundraiserForm.value['amount_target']) {
				fundraisingPayload['amount_target'] = 0;
			} else {
				fundraisingPayload['amount_target'] =
					this.editFundraiserForm.value['amount_target'];
			}

			if (this.editFundraiserForm.value['open_status']) {
				fundraisingPayload['open_status'] = true;
			} else {
				fundraisingPayload['open_status'] = false;
			}

			if (this.editFundraiserForm.value['visible_status']) {
				fundraisingPayload['visible_status'] = true;
			} else {
				fundraisingPayload['visible_status'] = false;
			}

			if (this.editFundraiserForm.value.id) {
				fundraisingPayload['id'] = this.editFundraiserForm.value.id;
				// console.log('PAY', fundraisingPayload);

				this._fundraiserService
					.updateFundraiserInformationTargetAmount(fundraisingPayload)
					.subscribe((res: any) => {
						this.isSaveTargetAmount = false;
						this.notificationService.openNotification(
							$localize`:@@custom_donation_donationDetails_notification:The donation details updated`,
							'',
							'success'
						);
						if (this.isBrowser) window.location.reload();
					});
			} else {
				this.isSaveTargetAmount = false;
				this.isTargetAmountDisable = false;
				this.notificationService.openNotification(
					$localize`:@@custom_donation_alreadyEdited_notification:The fundraiser is already edited with this id`,
					'',
					'error'
				);
			}
		} else {
			this.isSaveTargetAmount = false;
		}
	}

	saveAndApplyFundraiserStatus() {
		this.isSave = true;
		this._bankService.getStripeStatus().subscribe((res: any) => {
			this.stripeStatus = res?.data;
			this.chargesEnabled = this.stripeStatus?.charges_enabled;
			this.payoutEnabled = this.stripeStatus?.payout_enabled;
			this.detailsSubmitted = this.stripeStatus?.details_submitted;
			this._bankService.getPersonalVerification().subscribe((res: any) => {
				console.log('RES', res);
				if (res?.errors?.code === '1005') {
					this.oppVerificationCheck = true;
				} else {
					this.oppVerificationCheck = false;
				}
				if (
					this.chargesEnabled === true &&
					this.payoutEnabled === true &&
					this.detailsSubmitted === true &&
					this.oppVerificationCheck === true
				) {
					this.showStripePrompt = false;
				} else if (
					this.chargesEnabled === false &&
					this.payoutEnabled === false &&
					this.detailsSubmitted === false &&
					this.oppVerificationCheck === false
				) {
					this.showStripePrompt = false;
				} else if (
					this.chargesEnabled === true &&
					this.payoutEnabled === true &&
					this.detailsSubmitted === true &&
					this.oppVerificationCheck === false
				) {
					this.showStripePrompt = false;
				} else {
					this.showStripePrompt = true;
				}

				if (
					this.showStripePrompt == false ||
					this.isCurrentChildFundraiser == true
				) {
					if (this.currentFundraiserData) {
						let observableSourceList: any[] = [];
						let statusObject = {
							slug: this.currentFundraiserData?.slug,
							is_opened: false,
							is_draft: true,
							is_findable: false, //this.currentFundraiserData?.is_findable,
						};

						observableSourceList.push(
							this._fundraiserService.updateFundraiserStatus(
								JSON.parse(JSON.stringify(statusObject))
							)
						);

						// logic for calling publish Api, Publish Api need to be called to send the mail to the owner that the fundraiser is published.
						if (
							statusObject?.is_draft === false &&
							this.currentFundraiserData?.is_draft === true
						) {
							let publishBody = {
								slug: this.currentFundraiserData?.slug,
							};

							observableSourceList.push(
								this._fundraiserService.publishFundraiser(publishBody)
							);
						}
						this.currentFundraiserData.is_draft = statusObject?.is_draft;

						this.isSave = true;

						forkJoin(observableSourceList).subscribe(
							(response: any) => {
								this.notificationService.openNotification(
									$localize`:@@fundraiser_status_settings:Fundraisers settings saved successfully`,
									'',
									'success'
								);
								this.isSave = false;
								if (this.isBrowser) window.location.reload();
							},
							(error: any) => {
								this.notificationService.openNotification(
									$localize`:@@fundraiser_status_errorSaving_notification:There was an error saving Fundraiser settings`,
									'',
									'error'
								);
								this.isSave = false;
							}
						);
					}
				} else {
					this.router.navigate([
						'fundraising/stripe-prompt',
						{ slug: this.currentFundraiserData?.slug },
					]);
				}
			});
		});
	}
}
