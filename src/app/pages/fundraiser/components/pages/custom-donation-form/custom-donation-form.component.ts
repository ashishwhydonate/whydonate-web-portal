/**This component comes into action upon clicking edit button on Donate section of registered user */

import {
	AfterViewInit,
	Component,
	Inject,
	OnInit,
	PLATFORM_ID,
} from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import {
	UntypedFormGroup,
	Validators,
	UntypedFormBuilder,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, isPlatformBrowser } from '@angular/common';
import { combineLatest, forkJoin, Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { FundraiserService } from '../../../services/fundraiser.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { FundraiserCardData } from 'src/app/shared/interfaces/fundraiser-card-interface';
import { FundraiserCardService } from 'src/app/shared/services/fundraiser-card.service';
import { environment } from 'src/environments/environment';
import { FundraiserCardDataCustomDonation } from 'src/app/shared/interfaces/fundraiser-card-interface-custom-donation';
import { DonationService } from 'src/app/pages/donation/services/donation.service';
import { SafeHtml } from '@angular/platform-browser';

export type DonationField =
	| 'onetime'
	| 'monthly'
	| 'yearly'
	| 'otherAmount'
	| 'tipBox';

export type DonationConfigField =
	| 'onetime_select'
	| 'onetime_first'
	| 'onetime_second'
	| 'onetime_third'
	| 'onetime_forth'
	| 'onetime_style'
	| 'monthly_select'
	| 'monthly_first'
	| 'monthly_second'
	| 'monthly_third'
	| 'monthly_forth'
	| 'monthly_style'
	| 'yearly_select'
	| 'yearly_first'
	| 'yearly_second'
	| 'yearly_third'
	| 'yearly_forth'
	| 'yearly_style'
	| 'other_amount';
export type DonationConfig = {
	[key in DonationConfigField | tipEnabled]?: boolean | string;
};
export type tipEnabled = 'tip_enabled';
export type fundraisingLocalId = 'fundraising_local_id';
export type CustomDonationBody = {
	[key in DonationConfigField | tipEnabled | fundraisingLocalId]?:
		| boolean
		| string
		| number;
};

@Component({
	selector: 'app-custom-donation-form',
	templateUrl: './custom-donation-form.component.html',
})
/** *Custom Donation Form Component */
export class CustomDonationFormComponent implements OnInit, AfterViewInit {
	fundraiserCardData!: FundraiserCardDataCustomDonation;
	customDonationForm!: UntypedFormGroup;
	defaultDonationForm!: UntypedFormGroup;
	slug = '';
	fundraiserData!: any;
	fundData_custom_config_created_at: any;

	ONCE: DonationField = 'onetime';
	MONTHLY: DonationField = 'monthly';
	YEARLY: DonationField = 'yearly';
	amount: any;
	currentFundraiser: any;
	public currentLanguageCode: string = '';
	subject = new Subject<string>();
	oneTimeValue: boolean = true;
	monthlyValue: boolean = true;
	yearlyValue: boolean = true;
	isCustomDonationDisable: boolean = true;
	isSaveCustomDonation: boolean = false;
	pricingOptionsHelpdeskURL!: string;
	pricingOptionURLEndPoint = $localize`:@@helpDesk_pricingOptionsURL:article/edit-donation-form-fundraiser-1ceupda/`;
	targetAmountTab = $localize`:@@custom_donation_form_targetAmountTab:Target amount`;
	donationAmountTab = $localize`:@@custom_donation_form_donationAmountTab:Donation amount`;
	oneTimeLabel = $localize`:@@donation_form_oneTime_label:One Time`;
	monthlyLabel = $localize`:@@donation_form_monthly_label:Monthly`;
	yearlyLabel = $localize`:@@donation_form_yearly_label:Yearly`;
	currency: any = {
		currency_code: '',
		currency_symbol: '',
	};
	locale: any;
	fundraiserBackgroundImage: string = '';
	min_donation_amount: string = '';
	max_donation_amount: string = '';
	video: string = '';
	youtubeThumbnail: any;
	videoPath!: any;
	isBrowser: boolean = false;

	constructor(
		public _media: MediaObserver,
		private _fundraiserService: FundraiserService,
		public activatedRoute: ActivatedRoute,
		private _formBuilder: UntypedFormBuilder,
		public notificationService: NotificationService,
		private _location: Location,
		public router: Router,
		private _accountService: AccountService,
		private _fundraiserCardService: FundraiserCardService,
		private _donationService: DonationService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		this.customDonationForm = this._formBuilder.group({
			onetimeFlag: [true],
			onetimeCtrls: this._formBuilder.group({
				onetime1: [
					'',
					Validators.compose([
						Validators.required,
						Validators.pattern('^[0-9]*$'),
					]),
				],
				onetime2: [
					'',
					Validators.compose([
						Validators.required,
						Validators.pattern('^[0-9]*$'),
					]),
				],
				onetime3: [
					'',
					Validators.compose([
						Validators.required,
						Validators.pattern('^[0-9]*$'),
					]),
				],
				onetime4: [
					'',
					Validators.compose([
						Validators.required,
						Validators.pattern('^[0-9]*$'),
					]),
				],
			}),
			onetimeOpenAmountFlag: [false],

			monthlyFlag: [true],
			monthlyCtrls: this._formBuilder.group({
				monthly1: [
					'',
					Validators.compose([
						Validators.required,
						Validators.pattern('^[0-9]*$'),
					]),
				],
				monthly2: [
					'',
					Validators.compose([
						Validators.required,
						Validators.pattern('^[0-9]*$'),
					]),
				],
				monthly3: [
					'',
					Validators.compose([
						Validators.required,
						Validators.pattern('^[0-9]*$'),
					]),
				],
				monthly4: [
					'',
					Validators.compose([
						Validators.required,
						Validators.pattern('^[0-9]*$'),
					]),
				],
			}),
			monthlyOpenAmountFlag: [false],

			yearlyFlag: [true],
			yearlyCtrls: this._formBuilder.group({
				yearly1: [
					'',
					Validators.compose([
						Validators.required,
						Validators.pattern('^[0-9]*$'),
					]),
				],
				yearly2: [
					'',
					Validators.compose([
						Validators.required,
						Validators.pattern('^[0-9]*$'),
					]),
				],
				yearly3: [
					'',
					Validators.compose([
						Validators.required,
						Validators.pattern('^[0-9]*$'),
					]),
				],
				yearly4: [
					'',
					Validators.compose([
						Validators.required,
						Validators.pattern('^[0-9]*$'),
					]),
				],
			}),
			yearlyOpenAmountFlag: [false],

			otherAmountFlag: [true],
			tipBoxFlag: [true],
		});

		this.defaultDonationForm = this._formBuilder.group({
			...this.customDonationForm?.value,
		});
		this.slug = this.activatedRoute.snapshot.url[1].path;

		this.pricingOptionsHelpdeskURL = `${
			environment.helpDeskUrl
		}/${this._accountService.getLocaleId()}/${this.pricingOptionURLEndPoint}`;
	}

	ngAfterViewInit(): void {}

	ngOnInit(): void {
		this.locale = this._accountService.getLocaleId();

		this._fundraiserService
			.getFundraiserBySlug(this.slug, this.locale)
			.subscribe((data: any) => {
				this.currentFundraiser = data['data']?.result;
				// SET CURRENCY
				this.currency = {
					currency: this.currentFundraiser?.currency_code,
					symbol: this.currentFundraiser?.currency_symbol,
				};

				this._donationService
					.getCustomDonationConfiguration(this.slug, this.currency?.currency)
					.subscribe((customDonationData: any) => {
						console.log('Custom Donation Data:', customDonationData);
						this.fundraiserData = customDonationData;
						this.fundraiserCardData = customDonationData;

						this.fundraiserBackgroundImage = customDonationData?.image?.src;
						const url: any = customDonationData?.image?.video;
						this.youtubeThumbnail = this.checkVideoUrl(url);
						this.videoPath = url;
						this.min_donation_amount = customDonationData?.min_donation_amount;
						this.max_donation_amount = customDonationData?.max_donation_amount;
						// Now update the form controls with the received data
						this.customDonationForm.patchValue({
							onetimeCtrls: {
								onetime1: customDonationData?.onetime_first.toString(),
								onetime2: customDonationData?.onetime_second.toString(),
								onetime3: customDonationData?.onetime_third.toString(),
								onetime4: customDonationData?.onetime_forth.toString(),
							},
							monthlyCtrls: {
								monthly1: customDonationData?.monthly_first.toString(),
								monthly2: customDonationData?.monthly_second.toString(),
								monthly3: customDonationData?.monthly_third.toString(),
								monthly4: customDonationData?.monthly_forth.toString(),
							},
							yearlyCtrls: {
								yearly1: customDonationData?.yearly_first.toString(),
								yearly2: customDonationData?.yearly_second.toString(),
								yearly3: customDonationData?.yearly_third.toString(),
								yearly4: customDonationData?.yearly_forth.toString(),
							},
						});
						// Update Validators.min and Validators.max dynamically based on customDonationData
						this.updateOneTimeValidators(customDonationData);
						this.updateMonthlyValidators(customDonationData);
						this.updateYearlyValidators(customDonationData);

						let filteredCustomDonationConfig = customDonationData;
						if (this.fundraiserData?.custom_config_created_at == null) {
							let tipEnabledKey: tipEnabled = 'tip_enabled';
							if (
								Object.keys(filteredCustomDonationConfig).find(
									(x) => x === tipEnabledKey
								)
							) {
								this.getFlagCtrl('tipBox')?.patchValue(
									filteredCustomDonationConfig?.tip_enabled
								);
							}
						} else {
							this.setCustomDonationView(filteredCustomDonationConfig);
						}
						this.setAmountDisable();
						this.setListners();
					});
			});

		this.currentLanguageCode = this._accountService.getLocaleId();
		/** *Dont disable all toggle */
		this.customDonationForm
			.get('onetimeFlag')
			?.valueChanges.subscribe((val) => {
				if (val == false) {
					if (!this.monthlyValue && !this.yearlyValue) {
						this.customDonationForm?.controls.onetimeFlag.setValue(true);
					} else {
						this.oneTimeValue = val;
					}
				} else {
					this.oneTimeValue = val;
				}
			});

		this.customDonationForm
			.get('monthlyFlag')
			?.valueChanges.subscribe((val) => {
				if (val == false) {
					if (!this.oneTimeValue && !this.yearlyValue) {
						this.customDonationForm?.controls.monthlyFlag.setValue(true);
					} else {
						this.monthlyValue = val;
					}
				} else {
					this.monthlyValue = val;
				}
			});

		this.customDonationForm.get('yearlyFlag')?.valueChanges.subscribe((val) => {
			if (val == false) {
				if (!this.monthlyValue && !this.oneTimeValue) {
					this.customDonationForm?.controls.yearlyFlag.setValue(true);
				} else {
					this.yearlyValue = val;
				}
			} else {
				this.yearlyValue = val;
			}
		});
		/** *Create the fundraiser status form */
		this.activatedRoute.params.subscribe((params: any) => {
			this.amount = params;
		});
	}
	updateOneTimeValidators(customDonationData: any) {
		const onetimeCtrls = this.customDonationForm.get('onetimeCtrls');
		if (onetimeCtrls && customDonationData) {
			const onetimeControls = ['onetime1', 'onetime2', 'onetime3', 'onetime4'];

			for (const controlName of onetimeControls) {
				const control = onetimeCtrls.get(controlName);
				if (control) {
					control.setValidators([
						Validators.required,
						Validators.min(customDonationData?.min_donation_amount),
						Validators.max(customDonationData?.max_donation_amount),
						Validators.pattern('^[0-9]*$'),
					]);
					control.updateValueAndValidity();
				}
			}
		}
	}
	updateMonthlyValidators(customDonationData: any) {
		const monthlyCtrls = this.customDonationForm.get('monthlyCtrls');
		if (monthlyCtrls && customDonationData) {
			const monthlyControls = ['monthly1', 'monthly2', 'monthly3', 'monthly4'];

			for (const controlName of monthlyControls) {
				const control = monthlyCtrls.get(controlName);
				if (control) {
					control.setValidators([
						Validators.required,
						Validators.min(customDonationData?.min_donation_amount),
						Validators.max(customDonationData?.max_donation_amount),
						Validators.pattern('^[0-9]*$'),
					]);
					control.updateValueAndValidity();
				}
			}
		}
	}
	updateYearlyValidators(customDonationData: any) {
		const yearlyCtrls = this.customDonationForm.get('yearlyCtrls');
		if (yearlyCtrls && customDonationData) {
			const yearlyControls = ['yearly1', 'yearly2', 'yearly3', 'yearly4'];

			for (const controlName of yearlyControls) {
				const control = yearlyCtrls.get(controlName);
				if (control) {
					control.setValidators([
						Validators.required,
						Validators.min(customDonationData?.min_donation_amount),
						Validators.max(customDonationData?.max_donation_amount),
						Validators.pattern('^[0-9]*$'),
					]);
					control.updateValueAndValidity();
				}
			}
		}
		// Mark all controls in the form group as touched to trigger error message display
		this.customDonationForm.markAllAsTouched();
	}

	setToDefault() {
		// let value = this.customDonationForm.setValue(this.defaultDonationForm.value);
		// console.log("deff",value)
		this._donationService
			.getDefaultDonationCustomBranding(this.currency.currency)
			.subscribe((resetData: any) => {
				// console.log('defaultData', resetData);
				// console.log('?????????', this.customDonationForm);

				this.customDonationForm.patchValue({
					onetimeCtrls: {
						onetime1: resetData?.data?.onetime_first,
						onetime2: resetData?.data?.onetime_second,
						onetime3: resetData?.data?.onetime_third,
						onetime4: resetData?.data?.onetime_forth,
					},
					monthlyCtrls: {
						monthly1: resetData?.data?.monthly_first,
						monthly2: resetData?.data?.monthly_second,
						monthly3: resetData?.data?.monthly_third,
						monthly4: resetData?.data?.monthly_forth,
					},
					yearlyCtrls: {
						yearly1: resetData?.data?.yearly_first,
						yearly2: resetData?.data?.yearly_second,
						yearly3: resetData?.data?.yearly_third,
						yearly4: resetData?.data?.yearly_forth,
					},
					onetimeOpenAmountFlag: resetData?.data?.onetime_style,
					onetimeFlag: resetData?.data?.onetime_select,
					monthlyOpenAmountFlag: resetData?.data?.monthly_style,
					monthlyFlag: resetData?.data?.monthly_select,
					yearlyOpenAmountFlag: resetData?.data?.yearly_style,
					yearlyFlag: resetData?.data?.yearly_select,
					tipBoxFlag: this.getBool(resetData?.data?.tip_enabled),
					otherAmountFlag: this.getBool(resetData?.data?.other_amount),
				});
			});
	}

	/** *Language for pricing options*/
	goToPricingOptions() {
		if (this.isBrowser) window.open(this.pricingOptionsHelpdeskURL, '_blank');
	}
	/** *Discard Changes */
	discardChanges() {
		let filteredCustomDonationConfig = this.filterCustomDonationConfig(
			this.fundraiserData
		);
		// console.log('filtered config', filteredCustomDonationConfig);
		// console.log('datas', this.fundraiserData);

		if (
			Object.keys(filteredCustomDonationConfig).includes('onetime_first') &&
			Object.keys(filteredCustomDonationConfig).includes('tip_enabled')
		) {
			this.setCustomDonationView(filteredCustomDonationConfig);
		} else {
			this.setToDefault();
		}
		// console.log(
		// 	'Filtered Custom Donation Config:',
		// 	filteredCustomDonationConfig
		// );
		// console.log('Fundraiser Data:', this.fundraiserData);
		// console.log('Form values before reset:', this.customDonationForm.value);
		// // this.customDonationForm.reset();
		// console.log('Form values after reset:', this.customDonationForm.value);

		this.setAmountDisable();
		this.setListners();
		this.isCustomDonationDisable = true;
	}

	saveAndApplyCustomDonation() {
		this.isSaveCustomDonation = true;
		this.isCustomDonationDisable = true;
		let observableSourceList: any[] = [];
		let customDonationObj: CustomDonationBody = this.getCustomDonationObj(
			this.customDonationForm
		);

		// customDonationObj['fundraising_local_id'] = this.fundraiserData?.id;
		if (
			this.fundraiserData?.custom_config_created_at != null ||
			this.fundData_custom_config_created_at != null
		) {
			observableSourceList.push(
				this._fundraiserService.updateCustomDonationFormValuesBySlug(
					{
						customDonationObj,
					},
					this.amount['slug']
				)
			);
		} else {
			observableSourceList.push(
				this._fundraiserService.createCustomDonationFormValuesBySlugForAdmin(
					{
						customDonationObj,
					},
					this.amount['slug']
				)
			);
		}

		forkJoin(observableSourceList).subscribe(
			(response) => {
				this.notificationService.openNotification(
					$localize`:@@custom_donation_setting_notification:Custom donation settings saved successfully`,
					'',
					'success'
				);
				this.isSaveCustomDonation = false;
				this.isCustomDonationDisable = true;
				this._donationService
					.getCustomDonationConfiguration(this.slug, this.currency?.currency)
					.subscribe((customDonationData: any) => {
						// console.log('Custom Donation Data:', customDonationData);

						this.fundData_custom_config_created_at =
							customDonationData?.custom_config_created_at;
					});
			},
			(error) => {
				this.notificationService.openNotification(
					$localize`:@@custom_donation_errorSettings_notification:There was an error saving Custom donation settings`,
					'',
					'error'
				);
				this.isSaveCustomDonation = false;
				this.isCustomDonationDisable = false;
			}
		);
	}

	filterCustomDonationConfig(data: any): DonationConfig {
		// console.log('>>>>', data);
		let tipEnabledObj = { tip_enabled: data?.tip_enabled };
		return { ...data, ...tipEnabledObj };
	}

	getBool(val: any) {
		return !!JSON.parse(String(val)?.toLowerCase());
	}
	setCustomDonationView(donationFormConfig: DonationConfig) {
		// console.log('donationFormConfig:', donationFormConfig);

		this.getFlagCtrl('otherAmount')?.patchValue(
			this.getBool(donationFormConfig?.other_amount)
		);
		this.getFlagCtrl('tipBox')?.patchValue(
			this.getBool(donationFormConfig?.tip_enabled)
		);

		this.getFlagCtrl(this.ONCE)?.patchValue(
			this.getBool(donationFormConfig?.onetime_select)
		);
		this.getFlagCtrl(this.MONTHLY)?.patchValue(
			this.getBool(donationFormConfig?.monthly_select)
		);
		this.getFlagCtrl(this.YEARLY)?.patchValue(
			this.getBool(donationFormConfig?.yearly_select)
		);

		this.getAmountGroup(this.ONCE)?.patchValue(
			this.filterAndCreateAmountObj(this.ONCE, donationFormConfig)
		);
		this.getAmountGroup(this.MONTHLY)?.patchValue(
			this.filterAndCreateAmountObj(this.MONTHLY, donationFormConfig)
		);
		this.getAmountGroup(this.YEARLY)?.patchValue(
			this.filterAndCreateAmountObj(this.YEARLY, donationFormConfig)
		);

		this.getOpenCtrl(this.ONCE)?.patchValue(
			this.getBool(donationFormConfig?.onetime_style)
		);
		this.getOpenCtrl(this.MONTHLY)?.patchValue(
			this.getBool(donationFormConfig?.monthly_style)
		);
		this.getOpenCtrl(this.YEARLY)?.patchValue(
			this.getBool(donationFormConfig?.yearly_style)
		);
	}

	/** *filter and create amount object, this object can easily pass to setValue method od amount group */
	filterAndCreateAmountObj(
		field: DonationField,
		donationFormConfig: DonationConfig
	): {} {
		return {
			[field + '1']:
				donationFormConfig[`${field}_first` as DonationConfigField],
			[field + '2']:
				donationFormConfig[`${field}_second` as DonationConfigField],
			[field + '3']:
				donationFormConfig[`${field}_third` as DonationConfigField],
			[field + '4']:
				donationFormConfig[`${field}_forth` as DonationConfigField],
		};
	}

	/** *Responsible for setting amount group disable if, shouldAmountGroupDisabled criteria is met */
	setAmountDisable() {
		this.shouldAmountGroupDisabled(this.ONCE)
			? this.getAmountGroup(this.ONCE)?.disable()
			: undefined;
		this.shouldAmountGroupDisabled(this.MONTHLY)
			? this.getAmountGroup(this.MONTHLY)?.disable()
			: undefined;
		this.shouldAmountGroupDisabled(this.YEARLY)
			? this.getAmountGroup(this.YEARLY)?.disable()
			: undefined;
	}
	/** Set Listners */
	setListners() {
		combineLatest([
			this.getOpenCtrl(this.ONCE)?.valueChanges.pipe(startWith(false)) as any,
			this.getFlagCtrl(this.ONCE)?.valueChanges.pipe(startWith(false)) as any,
		]).subscribe((data) => {
			this.shouldAmountGroupDisabled(this.ONCE)
				? this.getAmountGroup(this.ONCE)?.disable()
				: this.getAmountGroup(this.ONCE)?.enable();
		});
		combineLatest([
			this.getOpenCtrl(this.MONTHLY)?.valueChanges.pipe(
				startWith(false)
			) as any,
			this.getFlagCtrl(this.MONTHLY)?.valueChanges.pipe(
				startWith(false)
			) as any,
		]).subscribe((data) => {
			this.shouldAmountGroupDisabled(this.MONTHLY)
				? this.getAmountGroup(this.MONTHLY)?.disable()
				: this.getAmountGroup(this.MONTHLY)?.enable();
		});
		combineLatest([
			this.getOpenCtrl(this.YEARLY)?.valueChanges.pipe(startWith(false)) as any,
			this.getFlagCtrl(this.YEARLY)?.valueChanges.pipe(startWith(false)) as any,
		]).subscribe((data) => {
			this.shouldAmountGroupDisabled(this.YEARLY)
				? this.getAmountGroup(this.YEARLY)?.disable()
				: this.getAmountGroup(this.YEARLY)?.enable();
		});

		this.customDonationForm.valueChanges.subscribe((value) => {
			this.isCustomDonationDisable = false;
		});
	}

	/** *if <fieldName>Flag is false && <fieldName>OpenAmountFlag is true, then amount group should be disabled */
	shouldAmountGroupDisabled(fieldName: DonationField) {
		return (
			!this.getFlagCtrl(fieldName)?.value || this.getOpenCtrl(fieldName)?.value
		);
	}

	getCustomDonationObj(customDonationForm: UntypedFormGroup): DonationConfig {
		let onetimeFlag: boolean = this.getFlagCtrl(this.ONCE)?.value;
		let onetime1: string = onetimeFlag
			? this.getAmountValue(this.ONCE, 1)
			: this.getAmountValue(this.ONCE, 1, this.defaultDonationForm);
		let onetime2: string = onetimeFlag
			? this.getAmountValue(this.ONCE, 2)
			: this.getAmountValue(this.ONCE, 2, this.defaultDonationForm);
		let onetime3: string = onetimeFlag
			? this.getAmountValue(this.ONCE, 3)
			: this.getAmountValue(this.ONCE, 3, this.defaultDonationForm);
		let onetime4: string = onetimeFlag
			? this.getAmountValue(this.ONCE, 4)
			: this.getAmountValue(this.ONCE, 4, this.defaultDonationForm);
		let onetimeOpen: boolean = this.getOpenAmountFlagValue(this.ONCE);

		let monthlyFlag: boolean = this.getFlagCtrl(this.MONTHLY)?.value;
		let monthly1: string = monthlyFlag
			? this.getAmountValue(this.MONTHLY, 1)
			: this.getAmountValue(this.MONTHLY, 1, this.defaultDonationForm);
		let monthly2: string = monthlyFlag
			? this.getAmountValue(this.MONTHLY, 2)
			: this.getAmountValue(this.MONTHLY, 2, this.defaultDonationForm);
		let monthly3: string = monthlyFlag
			? this.getAmountValue(this.MONTHLY, 3)
			: this.getAmountValue(this.MONTHLY, 3, this.defaultDonationForm);
		let monthly4: string = monthlyFlag
			? this.getAmountValue(this.MONTHLY, 4)
			: this.getAmountValue(this.MONTHLY, 4, this.defaultDonationForm);
		let monthlyOpen: boolean = this.getOpenAmountFlagValue(this.MONTHLY);

		let yearlyFlag: boolean = this.getFlagCtrl(this.YEARLY)?.value;
		let yearly1: string = yearlyFlag
			? this.getAmountValue(this.YEARLY, 1)
			: this.getAmountValue(this.YEARLY, 1, this.defaultDonationForm);
		let yearly2: string = yearlyFlag
			? this.getAmountValue(this.YEARLY, 2)
			: this.getAmountValue(this.YEARLY, 2, this.defaultDonationForm);
		let yearly3: string = yearlyFlag
			? this.getAmountValue(this.YEARLY, 3)
			: this.getAmountValue(this.YEARLY, 3, this.defaultDonationForm);
		let yearly4: string = yearlyFlag
			? this.getAmountValue(this.YEARLY, 4)
			: this.getAmountValue(this.YEARLY, 4, this.defaultDonationForm);
		let yearlyOpen: boolean = this.getOpenAmountFlagValue(this.YEARLY);
		return {
			other_amount: this.getFlagValue('otherAmount'),
			tip_enabled: this.getFlagValue('tipBox'),
			onetime_select: onetimeFlag,
			onetime_first: onetime1,
			onetime_second: onetime2,
			onetime_third: onetime3,
			onetime_forth: onetime4,
			onetime_style: onetimeOpen,
			monthly_select: monthlyFlag,
			monthly_first: monthly1,
			monthly_second: monthly2,
			monthly_third: monthly3,
			monthly_forth: monthly4,
			monthly_style: monthlyOpen,
			yearly_select: yearlyFlag,
			yearly_first: yearly1,
			yearly_second: yearly2,
			yearly_third: yearly3,
			yearly_forth: yearly4,
			yearly_style: yearlyOpen,
		};
	}

	private getFlagCtrl(fieldName: DonationField) {
		return this.customDonationForm.get(`${fieldName}Flag`);
	}
	private getOpenCtrl(fieldName: DonationField) {
		return this.customDonationForm.get(`${fieldName}OpenAmountFlag`);
	}
	private getAmountGroup(fieldName: DonationField) {
		return this.customDonationForm.get(`${fieldName}Ctrls`);
	}
	public getAmountValue(
		fieldName: DonationField,
		index: number,
		formGroup: UntypedFormGroup = this.customDonationForm
	) {
		return formGroup.get(`${fieldName}Ctrls.${fieldName}${index}`)?.value;
	}
	public getFlagValue(fieldName: DonationField) {
		return this.customDonationForm.get(`${fieldName}Flag`)?.value;
	}
	public getOpenAmountFlagValue(fieldName: string) {
		return this.customDonationForm.get(`${fieldName}OpenAmountFlag`)?.value;
	}
	goBack() {
		this._location.back();
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
	showError(
		groupName: string,
		controlName: string,
		errorType: string
	): boolean {
		const control = this.customDonationForm.get(`${groupName}.${controlName}`);

		if (errorType === 'max') {
			return control?.hasError('max') || false;
		} else {
			if (errorType === 'min') {
				return control?.hasError('min') || false;
			} else {
				return false;
			}
		}
	}
}
