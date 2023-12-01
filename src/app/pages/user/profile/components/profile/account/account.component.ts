import {
	Component,
	Inject,
	OnInit,
	PLATFORM_ID,
	ViewChild,
} from '@angular/core';
import {
	UntypedFormArray,
	FormBuilder,
	UntypedFormControl,
	UntypedFormGroup,
	NgForm,
	Validators,
	UntypedFormBuilder,
} from '@angular/forms';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProfileService } from '../../../services/profile.service';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
	MatDialog,
	MatDialogRef,
	MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';
import { MediaObserver } from '@angular/flex-layout';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { ActivatedRoute } from '@angular/router';
import { ResetPasswordDialog } from './reset-password-dialog/resetpassworddialog.component';
import { VerifyPasswordDialog } from './verify-password-dialog/verifypassworddialog.component';
import { User } from 'src/app/global/models/user';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.scss'],
})
/** *Account Component */
export class AccountComponent implements OnInit {
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	@ViewChild('updateProfileForm') updateProfileForm!: NgForm;

	isLoading: boolean;
	isSave: boolean;
	profileType: any = '';

	accountForm: UntypedFormGroup;
	currentRoute = 'account';
	email = '';
	API_URL: string = environment.apiUrl;
	profile: any = {};
	profileImage: any;
	imagePath: any;
	selectedProfileImage: any;
	userAccount: any = {};
	password: any;
	profileName!: string;
	closeCropper = false;
	didPhotoChanged: boolean = false;
	verificationCheck: boolean = false;
	tempCheck: boolean = false;
	isBrowser: boolean = false;
	/**
	 * Constructor
	 */
	constructor(
		private _dialog: MatDialog,
		private _http: HttpClient,
		public _media: MediaObserver,
		private _profileService: ProfileService,
		public notificationService: NotificationService,
		public _accountService: AccountService,
		public sanitizer: DomSanitizer,
		public formBuilder: UntypedFormBuilder,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		this.isLoading = false;
		this.isSave = false;

		// DEFINE ACCOUNT FORM
		this.accountForm = new UntypedFormGroup({
			profileType: new UntypedFormControl('', []),
			firstName: new UntypedFormControl('', [
				Validators.required,
				Validators.minLength(1),
				Validators.maxLength(100),
				Validators.pattern('^[a-zA-Z ]*$'),
			]),
			lastName: new UntypedFormControl('', [
				Validators.required,
				Validators.minLength(1),
				Validators.maxLength(100),
				Validators.pattern('^[a-zA-Z ]*$'),
			]),
			email: new UntypedFormControl({ value: '', disabled: true }, [
				Validators.required,
				Validators.email,
				Validators.pattern(
					'^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'
				),
			]),
			phoneNumber: new UntypedFormControl('', [
				Validators.minLength(10),
				Validators.maxLength(20),
				Validators.pattern('^[0-9]*$'),
			]),
			organisationName: new UntypedFormControl('', [
				Validators.required,
				Validators.minLength(1),
				Validators.maxLength(100),
				Validators.pattern(
					/^(?=.{1,100}$)(?=.*[a-zA-Z])(?=.*\d)|^[a-zA-Z\s]+$/
				),
			]),
		});
	}

	get profileTypeControl(): UntypedFormArray {
		return this.accountForm.get('profileTypeControl') as UntypedFormArray;
	}

	/** *----------------------------------------------------------------------------------------------------- */
	/** *@ Lifecycle hooks */
	/** *----------------------------------------------------------------------------------------------------- */

	ngOnInit(): void {
		this.isLoading = true;
		this.getUserProfile();
		let user: any = '{}';
		if (this.isBrowser) user = JSON.parse(localStorage.getItem('user') || '{}');
		// console.log('logged in object', user);
		if (user.is_email_verified == 0) {
			this.verificationCheck = false;
		} else {
			this.verificationCheck = true;
		}
		if (!this._profileService.getAccountObj) {
			this._profileService.getAccount().subscribe((res: any) => {
				this.userAccount = res;
				this.accountForm?.controls.firstName.setValue(
					res?.data?.profile?.first_name
				);
				this.accountForm?.controls.lastName.setValue(
					res?.data?.profile?.last_name
				);
				this.accountForm?.controls.email.setValue(res?.data?.profile?.email);
				this.email = res?.data?.profile?.email;
				this.isLoading = false;
			});
		} else {
			let accountObj = this._profileService.getAccountObj;
			this.accountForm?.controls.email.setValue(accountObj.email);
			this.accountForm?.controls.firstName.setValue(accountObj.firstName);
			this.accountForm?.controls.lastName.setValue(accountObj.lastName);
		}

		// set fields from profile api
		if (!this.tempCheck) {
			this.isLoading = true;
			this._profileService.getProfile().subscribe((res: any) => {
				const profileType =
					res.data?.profile?.type === 'organization' ||
					res.data?.profile?.type === 'organisation'
						? 'organisation'
						: 'personal';
				this.accountForm?.controls.profileType.setValue(profileType);
				this.profileType = profileType;

				if (profileType === 'organisation') {
					this.accountForm?.controls?.organisationName?.setValue(
						res.data?.profile?.name
					);
				} else {
					this.accountForm?.removeControl('organisationName');
				}

				if (res.data?.profile?.phone_number !== null) {
					this.accountForm?.controls?.phoneNumber?.setValue(
						res.data?.profile?.phone_number?.trim()
					);
				}

				this.isLoading = false;
			});
		} else {
			// console.log('PROFILE PROFILE PROFILE');
			let profileObj = this._profileService.getProfileObj;
			if (profileObj) {
				if (profileObj?.organisation) {
					this.accountForm?.controls.profileType.setValue('organisation');
					this.accountForm?.controls.organisationName.setValue(
						profileObj?.organisation?.organisationName
					);
					if (profileObj?.organisation?.phoneNumber) {
						this.accountForm?.controls.phoneNumber.setValue(
							profileObj?.organisation?.phoneNumber?.trim()
						);
					}
				} else {
					this.accountForm?.controls.profileType.setValue('personal');
					if (profileObj?.organisation?.phoneNumber) {
						this.accountForm?.controls.phoneNumber.setValue(
							profileObj?.personal?.phoneNumber?.trim()
						);
					}
				}
			}
		}
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.complete();
	}

	/** *----------------------------------------------------------------------------------------------------- */
	/** *@ Public methods */
	/** *----------------------------------------------------------------------------------------------------- */

	/** *Email getErrorMessage */
	getEmailErrorMessage() {
		return this.accountForm?.controls['email'].hasError('required')
			? $localize`:@@account_registeration_emailIsRequired_mat_error:Email is required`
			: this.accountForm?.controls['email'].hasError('emailInUse')
			? $localize`:@@account_registeration_emailIsInUse_mat_error:Email is in use`
			: '';
	}

	imageChangedEvent: any = '';
	show: boolean = false;

	fileChangeEvent(event: any): void {
		if (event?.target?.files[0]?.size < 5242880) {
			if (
				event.target.files[0].type == 'image/jpg' ||
				event.target.files[0].type == 'image/jpeg' ||
				event.target.files[0].type == 'image/png' ||
				event.target.files[0].type == 'image/webp'
			) {
				this.imageChangedEvent = event;
				this.imagePath = event.target.files;

				this.closeCropper = true;
			} else {
				this.notificationService.openNotification(
					$localize`:@@account_theFileError_notification:The file you have selected is not jpg or png. Please choose a different file.`,
					'OK',
					'error'
				);
			}
		} else {
			this.notificationService.openNotification(
				$localize`:@@account_fileTooLarge_notification:File is too large. Maximum file size should not be more than 5 MB.`,
				'OK',
				'error'
			);
		}
	}
	// Hide the image cropper
	cropImage() {
		this.closeCropper = false;
	}

	/*
	 * Convert data uri to blob-----------------------------------------------
	 */
	dataURItoBlob(dataURI: any) {
		var byteString = atob(dataURI.toString().split(',')[1]);
		var ab = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(ab);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		var blob = new Blob([ia], { type: 'image/jpeg' });
		return new File([blob], 'blob', { type: 'image/jpeg;charset=utf-8' });
	}

	imageCropped(event: ImageCroppedEvent) {
		this.profileImage = event.base64;
		this.selectedProfileImage = this.dataURItoBlob(this.profileImage);
	}

	imageLoaded() {
		// show cropper
	}
	cropperReady() {
		// cropper ready
	}
	loadImageFailed() {
		// show message
	}

	/** *radio button event */
	onprofileTypeChange(e: MatButtonToggleChange) {
		if (e?.value === 'personal') {
			this.profileType = 'personal';
			this.accountForm.removeControl('organisationName');
		}
		if (e?.value === 'organisation') {
			this.profileType = 'organisation';
			this.accountForm.addControl(
				'organisationName',
				this.formBuilder.control('', {
					validators: [
						Validators.required,
						Validators.minLength(1),
						Validators.maxLength(100),
						Validators.pattern(
							/^(?=.{1,100}$)(?=.*[a-zA-Z])(?=.*\d)|^[a-zA-Z\s]+$/
						),
					],
				})
			);
		}
	}

	/**
	 * Get logged in user profile
	 */
	getUserProfile() {
		this._profileService
			.getProfile()
			.pipe(takeUntil(this._unsubscribeAll)) // Unsubscribe
			.subscribe((profile: any) => {
				// Update the profile
				this.profile = profile;
				this.profileName = profile.data?.profile?.name;

				// Update the the profile image
				this.profileImage = profile.data?.profile?.image;
			});
	}

	/**
	 * Update logged in user profile
	 */
	updateProfile() {
		// Return if the form is invalid
		if (this.accountForm.invalid) {
			return;
		}

		this.closeCropper = false;

		// Disable the form
		this.accountForm.disable();

		// Update the profile

		let payloadFormDataProfile = new FormData();
		if (this.profileType == 'organisation') {
			/** *For Organisation Configurations */
			if (this.selectedProfileImage) {
				payloadFormDataProfile.append('image', this.selectedProfileImage);
			}

			// payloadFormDataProfile.append('id', this.profile.data.profile.id);
			payloadFormDataProfile.append(
				'first_name',
				this.accountForm?.controls?.firstName.value
			);
			payloadFormDataProfile.append(
				'last_name',
				this.accountForm?.controls?.lastName.value
			);
			payloadFormDataProfile.append('type', this.profileType);
			payloadFormDataProfile.append(
				'phone_number',
				this.accountForm?.controls.phoneNumber?.value || ''
			);
			payloadFormDataProfile.append(
				'organisation_name',
				this.accountForm?.controls.organisationName?.value.trim() || ''
			);
			payloadFormDataProfile.append(
				'email',
				this.accountForm?.controls.email.value
			);
			payloadFormDataProfile.append(
				'language_code',
				this._accountService.getLocaleId()
			);
		} else {
			/** *For Personal Configurations */
			if (this.selectedProfileImage) {
				payloadFormDataProfile.append('image', this.selectedProfileImage);
			}

			payloadFormDataProfile.append(
				'first_name',
				this.accountForm?.controls?.firstName.value
			);
			payloadFormDataProfile.append(
				'last_name',
				this.accountForm?.controls?.lastName.value
			);
			payloadFormDataProfile.append('type', this.profileType);
			payloadFormDataProfile.append(
				'phone_number',
				this.accountForm?.controls.phoneNumber?.value || ''
			);
			payloadFormDataProfile.append(
				'email',
				this.accountForm?.controls.email.value
			);
			payloadFormDataProfile.append(
				'language_code',
				this._accountService.getLocaleId()
			);
		}

		this._profileService.updateProfile(payloadFormDataProfile).subscribe(
			(response) => {
				this.notificationService.openNotification(
					$localize`:@@account_profileSaved_notification:Profile saved successfull`,
					'Close',
					'success'
				);

				// Re-enable the form
				this.accountForm.enable();

				this._profileService.profileChange(response);
				this.tempCheck = true;
				if (this.accountForm?.controls.email.value != this.email) {
					this._accountService.logout();
					if (this.isBrowser) window.location.reload();
				} else {
					if (this.isBrowser) window.location.reload();
				}
			},
			(error) => {
				console.log(error);
			}
		);
	}

	openResetPasswordDialog(): void {
		if (this.isLoading) {
			this.notificationService.openNotification(
				$localize`:@@loading_please_wait:Loading... Please Wait!`,
				'',
				'info'
			);
			return;
		}
		const dialogRef = this._dialog.open(ResetPasswordDialog, {
			width: '600px',
			height: '424px',
			data: this.userAccount.data,
		});

		dialogRef.afterClosed().subscribe((result) => {});
	}

	openVerifyPasswordDialog(): void {
		const verifyDialogRef = this._dialog.open(VerifyPasswordDialog, {
			width: '600px',
			height: '220px',
			data: {
				email: this.email,
			},
		});

		verifyDialogRef.afterClosed().subscribe((result: any) => {
			// Check if there is response from password verify
			// Then update profile
			if (result === undefined) {
				return;
			}

			this.password = result.password;

			if (result.passwordVerified) {
				this.updateProfile();
			}
		});
	}

	openVerifyPasswordDialogDeactivate(): void {
		const verifyDialogRef = this._dialog.open(VerifyPasswordDialog, {
			width: '600px',
			height: '220px',
			data: {
				email: this.email,
			},
		});

		verifyDialogRef.afterClosed().subscribe((result: any) => {
			// Check if there is response from password verify
			if (result?.passwordVerified) {
				this.password = result?.password;
				this.deactivateAccount(this.password);
			} else {
				return;
			}
		});
	}

	/**
	 *  Deactivate account
	 */
	deactivateAccount(password: string) {
		if (this._accountService.checkHeaders()) {
			this.isLoading = true;
			const payload = {
				password: password,
			};

			// Call deactivate services
			this._profileService.deactivateAccount(payload).subscribe(
				(response: any) => {
					this.notificationService.openNotification(
						$localize`:@@deactivate_accountDeactivated_notification:Account Deactivated successfull`,
						'Close',
						'success'
					);
					this._accountService.logout();
					this.isLoading = false;
				},
				(error: any) => {
					this.notificationService.openNotification(
						$localize`:@@deactivate_error_notification:There was an error while Deactivating your Account`,
						'',
						'error'
					);
				}
			);
		}
	}
}
