/* This component is recalled upon successful payment to enter details about donation*/

import { _getTextWithExcludedElements } from '@angular/cdk/testing';
import { Component, Input, OnInit } from '@angular/core';
import {
	UntypedFormControl,
	UntypedFormGroup,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { FundraiserService } from 'src/app/pages/fundraiser/services/fundraiser.service';
import { CustomBrandingService } from 'src/app/pages/user/custom-branding/services/custom-branding.service';
import { DashboardService } from 'src/app/pages/user/dashboard/services/dashboard.service';
import { ProfileService } from 'src/app/pages/user/profile/services/profile.service';
import { FundraiserCardData } from 'src/app/shared/interfaces/fundraiser-card-interface';
import { FundraiserCardService } from 'src/app/shared/services/fundraiser-card.service';
import { DonationService } from '../../../services/donation.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
	selector: 'app-donation-successful-form',
	templateUrl: './donation-successful-form.component.html',
	styleUrls: ['./donation-successful-form.component.scss'],
})
/** *Donation Successful Form Component */
export class DonationSuccessfulFormComponent implements OnInit {
	@Input() slug: string | null = '';
	@Input() donorId: string | null = '';
	@Input() orderId: string | null = '';
	@Input() currentFundraiser: any;
	donationSuccessfulForm: UntypedFormGroup;
	isAnonymous: boolean = false;
	hideValue: boolean = false;
	isLoading: boolean = false;
	donationReceipt: any;
	transactionCost: any;
	fundraiserGetFundraiser: any;
	fundraiserGetFundraiser2: any;
	_fundraiserCardData: FundraiserCardData;
	fundraiser: any;
	userAccount: any;

	constructor(
		public donationService: DonationService,
		public router: Router,
		public _fundraiserCardService: FundraiserCardService,
		public activatedRoute: ActivatedRoute,
		public fundraiserService: FundraiserService,
		public _dashboardService: DashboardService,
		public _customBrandingService: CustomBrandingService,
		private _accountService: AccountService,
		public _notificationService: NotificationService
	) {
		/** *Donation Successful Form Group */
		this.donationSuccessfulForm = new UntypedFormGroup({
			first_name: new UntypedFormControl('', [
				Validators.required,
				Validators.minLength(2),
				Validators.maxLength(100),
				Validators.pattern(
					/^[a-zA-Z0-9_\s\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FAC0}-\u{1FAFF}\u{1FB00}-\u{1FBFF}\u{1FC00}-\u{1FCFF}\u{1FD00}-\u{1FDFF}\u{1FE00}-\u{1FEFF}\u{1FF00}-\u{1FFFF}\u{2B05}\u{1F004}]*$/u
				),
			]),
			last_name: new UntypedFormControl('', [
				Validators.required,
				Validators.minLength(2),
				Validators.maxLength(100),
				Validators.pattern(
					/^[a-zA-Z0-9_\s\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FAC0}-\u{1FAFF}\u{1FB00}-\u{1FBFF}\u{1FC00}-\u{1FCFF}\u{1FD00}-\u{1FDFF}\u{1FE00}-\u{1FEFF}\u{1FF00}-\u{1FFFF}\u{2B05}\u{1F004}]*$/u
				),
			]),
			email: new UntypedFormControl('', [
				Validators.required,
				Validators.email,
				Validators.pattern(
					'^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'
				),
			]),
			message: new UntypedFormControl('', [
				Validators.minLength(0),
				Validators.maxLength(140),
				Validators.pattern(
					/^[a-zA-Z0-9_\s\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FAC0}-\u{1FAFF}\u{1FB00}-\u{1FBFF}\u{1FC00}-\u{1FCFF}\u{1FD00}-\u{1FDFF}\u{1FE00}-\u{1FEFF}\u{1FF00}-\u{1FFFF}\u{2B05}\u{1F004}a-zA-Z0-9\s!@#$%^&*(),.?"';:{}|<>_+=\-\[\]\\\/]+$/u
				),
			]),
			organisation_name: new UntypedFormControl('', [
				Validators.pattern(
					/^[a-zA-Z0-9_\s\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FAC0}-\u{1FAFF}\u{1FB00}-\u{1FBFF}\u{1FC00}-\u{1FCFF}\u{1FD00}-\u{1FDFF}\u{1FE00}-\u{1FEFF}\u{1FF00}-\u{1FFFF}\u{2B05}\u{1F004}]*$/u
				),
			]),
			address: new UntypedFormControl('', [
				Validators.minLength(1),
				Validators.maxLength(100),
				Validators.pattern(/^(?:(?!\p{Emoji}).|\d)*$/u),
			]),
			city: new UntypedFormControl('', [
				Validators.minLength(1),
				Validators.maxLength(100),
				Validators.pattern('^[a-zA-Z0-9_/s ]*$'),
			]),
			zipcode: new UntypedFormControl('', [
				Validators.minLength(1),
				Validators.maxLength(12),
				Validators.pattern(/^(?:(?!\p{Emoji}).|\d)*$/u),
			]),
			country: new UntypedFormControl('', [
				Validators.minLength(1),
				Validators.maxLength(100),
				Validators.pattern('^[a-zA-Z0-9_/s ]*$'),
			]),
		});

		this._fundraiserCardService = _fundraiserCardService;
		this._fundraiserCardData = this._fundraiserCardService.getObjWithData();
	}

	/**
	 * Function to get safe url of svg
	 * @param url
	 * @returns
	 */

	ngOnInit(): void {
		this.currentFundraiser = JSON.parse(sessionStorage.getItem('slug') || '{}');

		// THE FORM WILL FILL AUTOMATICALLY
		this.donationService.getOrderStatus(this.orderId).subscribe(
			(response: any) => {
				let status: string = response['data']['status'];
				this.donationSuccessfulForm?.controls.first_name.setValue(
					response.data.first_name
				);
				this.donationSuccessfulForm?.controls.last_name.setValue(
					response.data.last_name
				);
				this.donationSuccessfulForm?.controls.email.setValue(
					response.data.email
				);
				this.isLoading = false;
			},
			(err) => {}
		);
	}

	onSubmit() {
		if (this.donationSuccessfulForm.valid) {
			this.isLoading = true;

			//UPDATE MESSAGE IF NULL
			let message_string: string =
				this.donationSuccessfulForm?.value.message || '';

			let payload = {
				id: this.donorId,
				is_anonymous: this.isAnonymous,
				firstname: this.donationSuccessfulForm?.value?.first_name,
				lastname: this.donationSuccessfulForm?.value?.last_name,
				email: this.donationSuccessfulForm?.value?.email,
				o_id: this.orderId,
				//Tax Related Fields
				name:
					this.donationSuccessfulForm?.value?.name_tax_receipt ||
					this.donationSuccessfulForm?.value?.first_name +
						' ' +
						this.donationSuccessfulForm?.value?.last_name,
				message: message_string,
				address: this.donationSuccessfulForm?.value?.address,
				city: this.donationSuccessfulForm.value?.city,
				zipcode: this.donationSuccessfulForm.value?.zipcode,
				country: this.donationSuccessfulForm.value?.country,
				language_code: this._accountService.getLocaleId() || 'en',
			};
			//UPDATE DONOR DEATILS
			this.donationService.saveDonorDetails(payload).subscribe(
				(response) => {
					if (this.donationSuccessfulForm.value.message) {
						// Donor Details saved, now save the message
						let messagePayload2 = this.donationSuccessfulForm.value;
						messagePayload2['id'] = this.donorId;
						messagePayload2['email'] = this.donationSuccessfulForm.value.email;

						this.donationService.saveMessage(messagePayload2).subscribe(
							(response) => {},

							(error) => {
								console.log('Error', error);
							}
						);
					}
					this.router.navigate([
						'donate/share/' + this.slug,
						{ orderId: this.orderId },
					]);
				},
				(error) => {
					this._notificationService.openNotification(
						'There was an error in saving the details.',
						'OK',
						'error'
					);
				}
			);
		}
	}

	switchAnonymous() {
		this.isAnonymous = !this.isAnonymous;
		this.hideValue = !this.hideValue;
	}

	generateReceiptName() {
		this.donationSuccessfulForm?.controls['organisation_name'].setValue(
			this.donationSuccessfulForm.get('first_name')?.value +
				' ' +
				this.donationSuccessfulForm.get('last_name')?.value
		);
	}
}
