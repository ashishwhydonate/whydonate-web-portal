import {
	AfterViewInit,
	Component,
	Inject,
	OnDestroy,
	OnInit,
	Output,
	PLATFORM_ID,
} from '@angular/core';
import { BankService } from '../../../services/bank.service';
import {
	UntypedFormBuilder,
	UntypedFormControl,
	UntypedFormGroup,
	Validators,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import {
	MatLegacyDialog as MatDialog,
	MatLegacyDialogRef as MatDialogRef,
	MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import { ProfileService } from '../../../services/profile.service';
import { MediaObserver } from '@angular/flex-layout';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { BalanceService } from 'src/app/pages/user/balance/balance.service';
import { FundraiserService } from 'src/app/pages/fundraiser/services/fundraiser.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-bank',
	templateUrl: './bank.component.html',
	styleUrls: ['./bank.component.scss'],
})
/** *Bank Component */
export class BankComponent implements OnInit, AfterViewInit, OnDestroy {
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	isLoading: boolean;
	isSave: boolean;
	isErrorMessage: string;
	sub!: Subscription;
	isValueChange: boolean;
	bankAccountForm: UntypedFormGroup;
	profile!: any;
	profile_routes: any;
	profileImage: any;
	profileName?: any;
	currentRoute = 'bank';
	bankHolderPlace = $localize`:@@bank_bankHolder_placeholder:Placeholder`;
	verificationStatus: boolean = false;
	pendingStatus: boolean = false;
	disapprovedStatus: boolean = false;
	initialStatus: boolean = false;
	bankObject: any;
	identityDocumentObj: any;
	documentCheck: boolean = false;
	pageLoading: boolean = false;
	firstAccountCheck: boolean = false;
	complianceStatus: any;
	personalVerificationObj: any;
	addButtonCheck: boolean = false;
	overallCheck: boolean = false;
	hideBankDetails: boolean = false;
	typeCheck: boolean = false;
	complianceStatusOverall: any;
	isBrowser: boolean = false;
	notYetCheck: boolean = false;
	/**
	 * Constructor
	 */
	constructor(
		private _bankService: BankService,
		private _dialog: MatDialog,
		public _media: MediaObserver,
		private _profileService: ProfileService,
		_formBuilder: UntypedFormBuilder,
		public dialog: MatDialog,
		private _route: ActivatedRoute,
		private accountService: AccountService,
		private notificationService: NotificationService,
		private _balanceService: BalanceService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		/** *formGroup and controls */
		this.bankAccountForm = new UntypedFormGroup({
			accountHolder: new UntypedFormControl(['', Validators.required]),
			accountType: new UntypedFormControl(['']),
			accountNumber: new UntypedFormControl(['', Validators.required]),
		});

		/** *flags */
		this.isLoading = true;
		this.isSave = false;
		this.isValueChange = false;
		this.isErrorMessage = '';
	}

	ngOnDestroy(): void {
		this.sub.unsubscribe();
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.unsubscribe();
		// this._unsubscribeAll.complete();
	}

	ngOnInit(): void {
		// if (this.localStorageCheck == true) {
		// 	console.log('LOcal', this.localStorageCheck);
		// 	this.newCheck = false;
		// } else {
		// 	this.newCheck = true;
		// }
		this.pageLoading = true;
		this.getUserAccount();
		this.getUserProfile();

		// this.isLoading = true;
		this.setIsLoading();

		this._bankService.getPersonalVerification().subscribe((res: any) => {
			this.complianceStatus = res.data.status;
			this.complianceStatusOverall = res.data;
			console.log('compliance res', res);
			//EDGE CASE : If verification is verified but compliance status is unverified
			if (
				res?.data?.contact_phonenumber == 'verified' &&
				res?.data?.contact_verification == 'verified' &&
				res?.data?.status == 'unverified'
			) {
				this.overallCheck = true;
			} else {
				this.overallCheck = false;
			}
			// if (
			// 	this.complianceStatusOverall?.contact_phonenumber == 'unverified' &&
			// 	this.complianceStatusOverall?.contact_verification == 'unverified' &&
			// 	this.complianceStatusOverall?.status == 'unverified'
			// ) {
			// 	this.notYetCheck = true;
			// } else {
			// 	this.notYetCheck = false;
			// }
			switch (this.complianceStatus) {
				case 'pending':
					this.pendingStatus = true;
					this.verificationStatus = false;
					this.disapprovedStatus = false;
					this.initialStatus = false;
					break;
				case 'verified':
					this.pendingStatus = false;
					this.verificationStatus = true;
					this.disapprovedStatus = false;
					this.initialStatus = false;
					break;
				case 'unverified':
					this.pendingStatus = false;
					this.verificationStatus = false;
					this.disapprovedStatus = true;
					this.initialStatus = false;
					break;
				default:
					this.pendingStatus = false;
					this.verificationStatus = false;
					this.disapprovedStatus = false;
					this.initialStatus = true;
					break;
			}
		});

		this._bankService.getTempAccount().subscribe((res: any) => {
			this.bankObject = res.data;
			console.log('BANK RES', res.data);
			console.log('BANK OBJ', this.bankObject);

			if (res.data?.account?.account_iban == null) {
				this.hideBankDetails = true;
			} else {
				this.hideBankDetails = false;
			}

			if (res.data?.account?.account_iban == null) {
				this.typeCheck = true;
			} else {
				this.typeCheck = false;
			}
			console.log('TYPE CHECK', this.typeCheck);

			// translating account type
			if (res.data?.type == 'consumer') {
				res.data.type = $localize`:@@bank_personal_radio:consumer`;
			} else if (res.data.type == 'business') {
				res.data.type = $localize`:@@bank_business_radio:business`;
			}

			if (
				res.errors.code == '2020' ||
				res.errors.code == '1005' ||
				res?.data?.response == 'Merchant_uidNotAvaliable'
			) {
				this.firstAccountCheck = true;
				console.log('first account', this.firstAccountCheck);
			} else {
				this.firstAccountCheck = false;
			}
			this.pageLoading = false;
		});
	}

	/** *adding personal verification */
	addPersonalVerification() {
		if (this.accountService.checkHeaders()) {
			this.isLoading = true;
			let obj: any = {};
			this._bankService.addPersonalVerification(obj).subscribe(
				(response) => {
					this.personalVerificationObj = response;
					console.log('Personal Verification', this.personalVerificationObj);
					this.isLoading = false;
					if (this.isBrowser)
						window.open(this.personalVerificationObj.data.overview_url);
					this.addButtonCheck = true;
				},
				(error) => {
					this.isLoading = false;
					this.notificationService.openNotification(
						$localize`:@@donation_form_errorOcurred_notification:An error occured`,
						'OK',
						'error'
					);
				}
			);
		}
	}

	/** *Edit Bank Account Details */
	editBankAccountDetails() {
		this.isLoading = true;

		//Generate Url
		let returnURL: string = '';
		if (this.isBrowser)
			returnURL =
				window.location.protocol +
				'//' +
				window.location.hostname +
				'/' +
				this.accountService.getLocaleId() +
				'/profile/bank';

		//=========================================================/
		// Change return URL for localhost, **For dev purpose only
		if (this.isBrowser)
			if (window.location.hostname == 'localhost') {
				returnURL = 'https://whydonate.in/profile/bank';
			}

		//  Creating Obj for Editing Bank Account Details
		let obj: any = {
			return_url: returnURL,
		};
		this._bankService.updateBankAccount(obj).subscribe(
			(res: any) => {
				console.log('Edit Bank Account Response', res);
				this.isLoading = false;
				if (this.isBrowser) window.open(res.data?.verification_url);
			},
			(error: any) => {
				this.isLoading = false;
				this.notificationService.openNotification(
					$localize`:@@donation_form_errorOcurred_notification:An error occured`,
					'OK',
					'error'
				);
			}
		);
	}

	ngAfterViewInit() {
		/** *INFO: Enable save button if value is chnaged */
		this.sub = this.bankAccountForm.valueChanges
			.pipe(
				debounceTime(500),
				distinctUntilChanged((x, y) => {
					/** *INFO: If no actual change then cancel */
					if (JSON.stringify(x) === JSON.stringify(y)) {
						return true;
					}
					return false;
				}),
				/** *INFO: Skip the first event from being triggered while setting initial control from api when onInit hook called */
				/** *NOTE: Another approch is to give {emitEvent: false} in formcontrol.setValue. But in that case distinctUntilChanged will not have initial value and won't work properly. */
				skip(1)
			)
			.subscribe((value) => {
				this.enableSaveButton();
			});
	}

	// Flags
	setSaveBtnIsLoading() {
		this.isSave = true;
	}
	resetSaveBtnLoading() {
		this.isSave = false;
	}

	setIsLoading() {
		this.isLoading = true;
	}
	resetLoading() {
		this.isLoading = false;
	}

	enableSaveButton() {
		this.isValueChange = true;
	}
	disableSaveButton() {
		this.isValueChange = false;
	}

	resetErrorMessage() {
		this.isErrorMessage = '';
	}

	/**
	 * Get logged in user account
	 * To fetch email
	 */
	getUserAccount() {
		this._profileService.getAccount().subscribe((profile: any) => {
			// Update the profile
			this.profile = profile;
		});
	}

	/** *Get User Profile */
	getUserProfile() {
		this._profileService
			.getProfile()
			.pipe(takeUntil(this._unsubscribeAll)) // Unsubscribe
			.subscribe((profile: any) => {
				console.log('USER profile', profile);

				// Update the profile
				this.profile = profile;
				this.profileName = profile.data?.profile?.name;

				// Update the the profile image
				this.profileImage = profile.data?.profile?.image;
				if (profile?.data?.has_bank_information) {
					if (
						profile?.data?.profile?.type == 'organization' ||
						profile?.data?.profile?.type == 'organisation'
					) {
						this.bankAccountForm?.controls['accountType'].patchValue(
							'organisation'
						);
					} else {
						this.bankAccountForm?.controls['accountType'].patchValue(
							'personal'
						);
					}
				}
			});
	}
	/**
	 * Open verify dialog
	 */
	openVerifyPasswordDialog(): void {
		// get the account details from the input
		const accountHolder = this.bankAccountForm?.controls.accountHolder.value;
		const accountNumber = this.bankAccountForm?.controls.accountNumber.value;
		const userEmail = this.profile.data.email;

		// Set dialog data
		this._dialog.open(VerifyBankPasswordDialog, {
			width: '600px',
			height: '240px',
			data: {
				accountHolder,
				accountNumber,
				email: userEmail,
			},
		});
	}

	/** *Open Bank Account Type Dialog */
	openBankTypeDialog(): void {
		this._dialog.open(BankAccountType, {
			width: '600px',
			maxHeight: '85vh',
		});
	}
}

@Component({
	selector: 'verify-password-dialog',
	templateUrl: './verify-password-dialog.html',
})
/** *Verify Bank Password Dialog */
export class VerifyBankPasswordDialog {
	verifyPasswordForm: UntypedFormGroup;
	profile!: any;
	isBrowser: boolean = false;

	constructor(
		public _verifyPasswordDialogRef: MatDialogRef<VerifyBankPasswordDialog>,
		private _formBuilder: UntypedFormBuilder,
		private _bankServices: BankService,
		public notificationService: NotificationService,
		@Inject(MAT_DIALOG_DATA) public inputedDetails: any,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		this.verifyPasswordForm = this._formBuilder.group({
			password: ['', Validators.required],
		});
	}

	/**
	 * verify password
	 */
	verifyPassword() {
		// Return if the form is invalid
		if (this.verifyPasswordForm.invalid) {
			return;
		}

		// Disable the form
		this.verifyPasswordForm.disable();

		// get the value from the from input
		const password = this.verifyPasswordForm?.controls.password.value;

		//get email from local storage
		let userString: any;
		if (this.isBrowser) userString = localStorage.getItem('user') || '{}';
		let userJSON = JSON.parse(userString);

		// verify password payload
		const payload = {
			email: userJSON.email,
			password: password,
		};

		// call the bank service to verify password
		this._bankServices.verifyPassword(payload).subscribe(
			(response) => {
				// Construct update account detials payload
				const updateAccountPayload = {
					account_holder: this.inputedDetails.accountHolder,
					account_number: this.inputedDetails.accountNumber,
				};

				// Call the this to update the bank details
				this._updateBankDetails(updateAccountPayload);

				// Re-enable the form
				this.verifyPasswordForm.enable();
			},
			(error) => {
				this.notificationService.openNotification(
					$localize`:@@bank_passwordNotValid_notification:Your password is not valid`,
					'Close',
					'error'
				);

				// Re-enable the form
				this.verifyPasswordForm.enable();
			}
		);
	}

	/**
	 * verify password
	 */
	_updateBankDetails(payload: any) {
		this._bankServices.saveBankAccount(payload).subscribe(
			(data) => {
				// Close dialog once the details is updated with a success massage
				this._verifyPasswordDialogRef.close({ event: 'Cancel' });

				this.notificationService.openNotification(
					$localize`:@@bank_bankDetails_notification:Bank details updated`,
					'Close',
					'success'
				);
			},
			(error) => {
				this.notificationService.openNotification(
					$localize`:@@bank_unableToUpdating:Unable to updating your details`,
					'Close',
					'error'
				);
			}
		);
	}
}

@Component({
	selector: 'bank-account-dialog',
	templateUrl: './bank-account-dialog.html',
})
/** *Select Bank Account Type */
export class BankAccountType {
	types: string[] = ['Personal', 'Business'];
	personalTypeCheck: boolean = false;
	businessTypeCheck: boolean = false;
	bankTypeForm: UntypedFormGroup;
	personalBankForm: UntypedFormGroup;
	newPersonalBankForm: UntypedFormGroup;
	documentCheck: boolean = false;
	identityDocumentObj: any;
	personalQuestionCheck: boolean = false;
	businessQuestionCheck: boolean = false;
	isBrowser: boolean = false;
	constructor(
		public _verifyPasswordDialogRef: MatDialogRef<VerifyBankPasswordDialog>,
		private _formBuilder: UntypedFormBuilder,
		private _bankServices: BankService,
		public notificationService: NotificationService,
		private _bankService: BankService,
		private accountService: AccountService,
		private fundraiserService: FundraiserService,
		@Inject(MAT_DIALOG_DATA) public inputedDetails: any,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		this.bankTypeForm = this._formBuilder.group({
			chamberOfCommerce: ['', Validators.required],
		});
		this.newPersonalBankForm = this._formBuilder.group({
			consumerFundsUsage: [
				'',
				[
					Validators.required,
					Validators.minLength(30),
					Validators.maxLength(250),
				],
			],
		});
		this.personalBankForm = this._formBuilder.group({
			businessFundsUsage: [
				'',
				[
					Validators.required,
					Validators.minLength(30),
					Validators.maxLength(250),
				],
			],
			purposeOrganisation: [
				'',

				[
					Validators.required,
					Validators.minLength(30),
					Validators.maxLength(250),
				],
			],
		});
	}

	onTypeChange(event: any) {
		console.log('radio change ecvent', event);
		if (event.value == 'personal') {
			this.personalTypeCheck = true;
			this.businessTypeCheck = false;
			// console.log('IF CHECK', this.personalTypeCheck, this.businessTypeCheck);
		} else {
			this.personalTypeCheck = false;
			this.businessTypeCheck = true;
			// console.log('ELSE CHECK', this.personalTypeCheck, this.businessTypeCheck);
		}
	}
	onConfirm() {
		if (this.personalTypeCheck == true) {
			this.personalQuestionCheck = true;
		} else {
			this.businessQuestionCheck = true;
		}
	}
	// ** *Adding Identity Document */
	saveIdentityDocument() {
		this._bankService.changeCheck(false);

		this.documentCheck = true;
		//Generate Url
		let returnURL: string;
		if (this.isBrowser)
			returnURL =
				window.location.protocol +
				'//' +
				window.location.hostname +
				'/' +
				this.accountService.getLocaleId() +
				'/profile/bank';

		//=========================================================/
		// Change return URL for localhost, **For dev purpose only
		if (this.isBrowser)
			if (window.location.hostname == 'localhost') {
				returnURL = 'https://whydonate.in/profile/bank';
			}
		//=========================================================/
		if (this.personalTypeCheck == true) {
			console.log('this.personal', this.personalTypeCheck);
			//Adding Empty Bank Account API to create an empty container for user
			let emptyDataObj = {
				returnURL: 'https://whydonate.in',
			};
			this.fundraiserService
				.addEmptyBank(emptyDataObj)
				.subscribe((res: any) => {
					console.log('Empty Bank Added Successfully', res);
					//Merchant Onboading API to redirect user to OPP merchant onboarding url (Consumer)
					let obj: any = {
						funds_used_for:
							this.newPersonalBankForm.controls['consumerFundsUsage']?.value,
						organisation_purpose: '-',
					};

					console.log('OBJ PERSONAL', obj);
					this._bankService.addBankAccount(obj).subscribe(
						(response) => {
							this.identityDocumentObj = response;
							console.log('IDENTITY', this.identityDocumentObj);
							this.documentCheck = false;
							if (this.isBrowser) {
								window.open(this.identityDocumentObj?.data?.verification_url);
								window.location.reload();
							}
						},
						(error) => {
							this.documentCheck = false;
							this.notificationService.openNotification(
								$localize`:@@donation_form_errorOcurred_notification:An error occured`,
								'OK',
								'error'
							);
						}
					);
				});
		}
		if (this.businessTypeCheck == true) {
			//Empty bank Account API for creating an empty container for used to add details later.
			let emptyDataObj = {
				returnURL: 'https://whydonate.in',
			};
			this.fundraiserService
				.addEmptyBank(emptyDataObj)
				.subscribe((res: any) => {
					console.log('Empty Bank Added Successfully', res);
					//Merchant Onboading API to redirect user to OPP merchant onboarding url (Business)
					let obj: any = {
						coc_nr: this.bankTypeForm.controls['chamberOfCommerce']?.value,
						country: 'nld', //HardCoded country as discussed
						funds_used_for:
							this.personalBankForm.controls['businessFundsUsage']?.value,
						organisation_purpose:
							this.personalBankForm.controls['purposeOrganisation']?.value,
					};
					console.log('Business Type Obj', obj);
					this._bankService.addBankAccount(obj).subscribe(
						(response) => {
							this.identityDocumentObj = response;
							console.log('response in business', response);
							this.documentCheck = false;
							if (this.isBrowser) {
								window.open(this.identityDocumentObj?.data?.verification_url);
								window.location.reload();
							}
						},
						(error) => {
							this.documentCheck = false;
							this.notificationService.openNotification(
								$localize`:@@donation_form_errorOcurred_notification:An error occured`,
								'OK',
								'error'
							);
						}
					);
				});
		}
	}
}
