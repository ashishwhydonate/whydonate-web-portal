/**This component is visible when registered user opens their fundraiser page */

import {
	Component,
	Inject,
	Input,
	OnChanges,
	OnInit,
	PLATFORM_ID,
	SimpleChanges,
} from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { UntypedFormControl } from '@angular/forms';
import { Fundraiser } from '../../../models/fundraiser';
import { FundraiserService } from '../../../services/fundraiser.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { forkJoin } from 'rxjs';
import { BankService } from 'src/app/pages/user/profile/services/bank.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
@Component({
	selector: 'app-fundraiser-status',
	templateUrl: './fundraiser-status.component.html',
})
/** *Fundraiser Status Component */
export class FundraiserStatusComponent implements OnInit, OnChanges {
	@Input() currentFundraiser!: Fundraiser;
	@Input() isCurrentChildFundraiser: boolean = false;
	isOpenRadioCtrl = new UntypedFormControl('close');
	isDraftRadioCtrl = new UntypedFormControl('draft');
	isFindableRadioCtrl = new UntypedFormControl('nonfindable');
	isSave = false;
	isLoading = false;
	@Input() slug: string = '';
	chargesEnabled!: boolean;
	payoutEnabled!: boolean;
	stripeStatus: any = {};
	detailsSubmitted!: boolean;
	showStripePrompt!: boolean;
	oppVerificationCheck: boolean = false;
	isBrowser: boolean = false;
	constructor(
		public notificationService: NotificationService,
		public fundraiserService: FundraiserService,
		public _media: MediaObserver,
		private _bankService: BankService,
		private router: Router,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}
	ngOnChanges(changes: SimpleChanges): void {
		if (this.currentFundraiser) {
			this.setAbilityToDonate(this.currentFundraiser);
			this.setVisibilityInSearch(this.currentFundraiser);
			this.setPublicView(this.currentFundraiser);
		}
	}

	ngOnInit(): void {}

	/** *IS FUNDRAISER OPEN OR CLOSE */
	setAbilityToDonate(currentFundraiser: any) {
		if (currentFundraiser?.is_opened) {
			this.isOpenRadioCtrl.setValue('open');
		} else {
			this.isOpenRadioCtrl.setValue('close');
		}
		// console.log('currentFundraiser', currentFundraiser?.is_opened);
		// console.log('this.isOpenRadioCtrl.value', this.isOpenRadioCtrl.value);
	}

	/** *IS FUNDRAISER VISIBLE IN SEARCH RESULTS */
	setVisibilityInSearch(currentFundraiser: any) {
		if (currentFundraiser?.is_findable) {
			this.isFindableRadioCtrl.setValue('findable');
		} else {
			this.isFindableRadioCtrl.setValue('nonfindable');
		}
		// console.log('currentFundraiser', currentFundraiser?.is_findable);
	}

	/** *SWITCH PUBLIC PAGE (Publish or Draft) */
	setPublicView(currentFundraiser: any) {
		if (!currentFundraiser?.is_draft) {
			this.isDraftRadioCtrl.setValue('published');
		} else {
			this.isDraftRadioCtrl.setValue('draft');
		}
	}

	/** *Save */
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

				if (this.showStripePrompt == false) {
					if (this.currentFundraiser) {
						let observableSourceList: any[] = [];
						let statusObject = {
							slug: this.currentFundraiser?.slug,
							is_opened: this.isOpenRadioCtrl.value === 'open' ? true : false,
							is_draft: this.isDraftRadioCtrl.value === 'draft' ? true : false,
							is_findable:
								this.isFindableRadioCtrl.value === 'findable' ? true : false,
						};

						observableSourceList.push(
							this.fundraiserService.updateFundraiserStatus(
								JSON.parse(JSON.stringify(statusObject))
							)
						);

						// logic for calling publish Api, Publish Api need to be called to send the mail to the owner that the fundraiser is published.
						if (
							statusObject?.is_draft === false &&
							this.currentFundraiser?.is_draft === true
						) {
							let publishBody = {
								slug: this.currentFundraiser?.slug,
							};

							observableSourceList.push(
								this.fundraiserService.publishFundraiser(publishBody)
							);
						}
						this.currentFundraiser.is_draft = statusObject?.is_draft;

						this.isSave = true;

						forkJoin(observableSourceList).subscribe(
							(response) => {
								this.notificationService.openNotification(
									$localize`:@@fundraiser_status_settings:Fundraisers settings saved successfully`,
									'',
									'success'
								);
								this.isSave = false;
								if (this.isBrowser) window.location.reload();
							},
							(error) => {
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
						{ slug: this.slug },
					]);
				}
			});
		});
	}
}
