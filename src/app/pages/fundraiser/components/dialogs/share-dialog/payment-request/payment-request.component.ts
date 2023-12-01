import { Clipboard } from '@angular/cdk/clipboard';
import { BuiltinTypeName } from '@angular/compiler';
import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
	Inject,
	PLATFORM_ID,
} from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import {
	UntypedFormControl,
	UntypedFormGroup,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { CustomDonationConfiguration } from 'src/app/pages/donation/models/custom-donation-configuration';
import { DonationService } from 'src/app/pages/donation/services/donation.service';
import { FundraiserService } from 'src/app/pages/fundraiser/services/fundraiser.service';
import { PaymentRequestService } from 'src/app/pages/fundraiser/services/payment-request.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { environment } from 'src/environments/environment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';
@Component({
	selector: 'app-payment-request',
	templateUrl: './payment-request.component.html',
	styleUrls: ['./payment-request.component.scss'],
})
/** *Payment Request Component */
export class PaymentRequestComponent implements OnInit, OnChanges {
	@Input() selectedFundraiser: any;
	anystring: string = '';
	currentPaymentValue: boolean = true;
	isOtherSelected: boolean = true;
	otherAmount: number = 1;
	presetUrl: any;
	paymentAmountButton: number = 1;
	shareLink: string = '';
	isLoading: boolean = false;
	saveButton: boolean = true;
	isBrowser: boolean = false;
	CustomDonationConfiguration: CustomDonationConfiguration =
		new CustomDonationConfiguration(
			true,
			'15',
			'50',
			'100',
			'250',
			true,
			true,
			'5',
			'10',
			'25',
			'100',
			true,
			true,
			'50',
			'100',
			'250',
			'500',
			true
		);
	elementIdsOnetime: string[] = [
		'onetimeFirst',
		'onetimeSecond',
		'onetimeThird',
		'onetimeForth',
		'onetimeOther',
	];

	paymentForm = new UntypedFormGroup({
		otherAmountInput: new UntypedFormControl('', [
			Validators.required,
			Validators.pattern(/^[0-9]*$/),
		]),
	});
	slug: string = '';
	currency_symbol: string = '';
	onetime_first: string = '';
	onetime_second: string = '';
	onetime_third: string = '';
	onetime_forth: string = '';
	other_amount_boolean: boolean = false;
	selectedAmount: string | undefined; // Allow for the possibility of undefined
	max_donation_amount: number = 1;
	min_donation_amount: number = 1;
	constructor(
		private _fundraiserService: FundraiserService,
		public router: Router,
		public clipboard: Clipboard,
		public paymentRequest: PaymentRequestService,
		public media: MediaObserver,
		private notificationService: NotificationService,
		public donationService: DonationService,
		public _accountService: AccountService,
		@Inject(MAT_DIALOG_DATA) public data: { fundraiser: any },
		public dialogRef: MatDialogRef<PaymentRequestComponent>,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	ngOnChanges(changes: SimpleChanges): void {}
	ngOnInit(): void {
		console.log('data', this.data);
		this.currency_symbol = this.data?.fundraiser?.currency_symbol;
		this.onetime_first =
			this.data?.fundraiser?.custom_donation_configuration?.onetime_first;
		this.onetime_second =
			this.data?.fundraiser?.custom_donation_configuration?.onetime_second;
		this.onetime_third =
			this.data?.fundraiser?.custom_donation_configuration?.onetime_third;
		this.onetime_forth =
			this.data?.fundraiser?.custom_donation_configuration?.onetime_forth;
		this.other_amount_boolean =
			this.data?.fundraiser?.custom_donation_configuration?.other_amount;
		this.otherAmount = parseFloat(this.onetime_first);
		this.max_donation_amount =
			this.data?.fundraiser?.custom_donation_configuration?.max_donation_amount;
		this.min_donation_amount =
			this.data?.fundraiser?.custom_donation_configuration?.min_donation_amount;
		// Update the validators for otherAmountInput
		this.paymentForm.controls['otherAmountInput'].setValidators([
			Validators.required,
			Validators.pattern(/^[0-9]*$/), // Pattern to allow only numbers
			Validators.min(this.min_donation_amount), // Set the minimum value
			Validators.max(this.max_donation_amount), // Set the maximum value
		]);
		// Trigger the validation update
		this.paymentForm.controls['otherAmountInput'].updateValueAndValidity();

		let url = this.router.url.split('/');
		this.slug = url[2];
		console.log('URL', url[2]);
		this.shareLink =
			'https://whydonate.com/' +
			this._accountService.getLocaleId() +
			this.router.url;
	}
	// setValue() {
	// 	this.otherAmount = this.paymentForm.value.otherAmountInput;
	// }
	/** * Disable or Enables the state of other buttons */
	checkButtons() {
		if (this.isOtherSelected == false) {
			this.isOtherSelected = true;
		}
	}
	/** *Copy Link */
	copyLink() {
		this.clipboard.copy(this.shareLink);
	}

	/** *Check Other Button */
	checkOtherButton() {
		if (this.isOtherSelected == true) {
			this.isOtherSelected = false;
		}
	}
	/** *Print Fundraiser */
	printFundraiser() {
		if (this.isBrowser) window.print();
	}
	/** *Set Payment Amount */
	setPaymentAmount(amountButton: any) {
		this.paymentAmountButton = amountButton;
		const getAmount = this.getAmount();
		this.selectedAmount = this.getAmount();
		console.log('get amount', getAmount);
		console.log('payment amount button', this.paymentAmountButton);
	}

	/** *Get Preset */
	getPreset() {
		//Getting
		this.isLoading = true;
		this.presetUrl =
			environment.homeUrl +
			'/' +
			this._accountService.getLocaleId() +
			'/' +
			'donate/' +
			`${this.slug}` +
			'?amount=' +
			`${this.getAmount()}`;
		console.log('RETURN URL', this.presetUrl);
		this.isLoading = false;
		this.currentPaymentValue = false;
		this.paymentRequest.changeText(this.presetUrl);
		this.notificationService.openNotification(
			$localize`:@@payment_request_linkAndQr:Link & QR Code Generated Succesfully`,
			'',
			'success'
		);
		// this._fundraiserService
		// 	.getSharePreset(this.selectedFundraiser.id, this.getAmount())
		// 	.subscribe((res: any) => {
		// 		if (res.status === 200) {
		// 			this.presetUrl = res.data.url;
		// 			this.isLoading = false;
		// 			this.currentPaymentValue = false;
		// 			console.log('url in payment request', res.data);
		// 			this.notificationService.openNotification(
		// 				$localize`:@@payment_request_linkAndQr:Link & QR Code Generated Succesfully`,
		// 				'',
		// 				'success'
		// 			);
		// 		}
		// 	});
	}
	/** *Get Amount */
	getAmount() {
		if (this.paymentAmountButton === 1) {
			this.checkButtons();
			return this.onetime_first;
		}
		if (this.paymentAmountButton === 2) {
			this.checkButtons();
			return this.onetime_second;
		}
		if (this.paymentAmountButton === 3) {
			this.checkButtons();
			return this.onetime_third;
		}
		if (this.paymentAmountButton === 4) {
			this.checkButtons();

			return this.onetime_forth;
		}
		if (this.paymentAmountButton === 5) {
			return this.onetime_first;
		}
	}
	updateSelectedAmount(newAmount: number) {
		this.selectedAmount = newAmount?.toString();
	}
}
