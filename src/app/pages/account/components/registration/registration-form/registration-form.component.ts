/**This component comes into action when unregistered user clicks Register on login screen*/

import {
	Component,
	Inject,
	InjectionToken,
	OnInit,
	PLATFORM_ID,
} from '@angular/core';
import {
	AbstractControl,
	AsyncValidatorFn,
	UntypedFormBuilder,
	UntypedFormControl,
	UntypedFormGroup,
	ValidationErrors,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
//import heic2any from 'heic2any';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { CropperSettings } from 'ngx-image-cropper/lib/interfaces/cropper.settings';
import { JWT } from 'src/app/global/models/jwt';
import { User } from 'src/app/global/models/user';
import { APIService } from 'src/app/global/services/api.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Tools } from 'src/utilities/tools';
import { UserRegistration } from '../../../models/user-registration-model';
import { AccountService } from '../../../services/account.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CustomBrandingService } from 'src/app/pages/user/custom-branding/services/custom-branding.service';
import { Observable, of } from 'rxjs';

declare global {
	interface Window {
		dataLayer: any[];
	}
}

@Component({
	selector: 'app-registration-form',
	templateUrl: './registration-form.component.html',
	styleUrls: ['./registration-form.component.scss'],
})

/*
 * *Registration Component
 */
export class RegistrationFormComponent implements OnInit {
	isPersonal: boolean = true;
	isOrganization: boolean = false;
	registrationForm: any;
	fieldPassword: any;
	imageChangedEvent: any = '';
	croppedImage: any = '';
	show: boolean = false;
	imageBase64: any;
	cropperSettings: CropperSettings | undefined;
	imageFile!: File;
	contactNamePlaceholder = $localize`:@@account_registeration_contactName_placeholder:Contact Number (Optional)`;
	currentLocale: string = '';
	homeUrl = 'https://whydonate.com';
	termsAndCondition = $localize`:@@donation_form_terms&conditions:terms-and-conditions`;
	termsHref: any;
	profileResponse: any;
	onlinePaymentHref = 'https://onlinepaymentplatform.com/en/terms-policies';
	public isLoading: boolean | undefined;
	isBrowser: boolean = false;

	/*
	 * Constructor
	 * @param _accountService
	 * @param _router
	 * @param _apiService
	 * @param notificationService
	 * @param formBuilder
	 * @param iconRegistry
	 * @param sanitizer
	 * @param _customBrandingService
	 */
	constructor(
		private _accountService: AccountService,
		private _router: Router,
		private _apiService: APIService,
		private notificationService: NotificationService,
		public formBuilder: UntypedFormBuilder,
		public sanitizer: DomSanitizer,
		private _customBrandingService: CustomBrandingService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrwoser(PLATFORM_ID);
	}

	ngOnInit(): void {
		// set meta data in registration screen

		//Registration Form Group
		this.registrationForm = new UntypedFormGroup({
			organisation_name: new UntypedFormControl('', []),

			image: new UntypedFormControl('', []),
			first_name: new UntypedFormControl('', [
				Validators.required,
				Validators.minLength(1),
				Validators.maxLength(100),
				Validators.pattern('^[a-zA-Z ]*$'),
			]),

			last_name: new UntypedFormControl('', [
				Validators.required,
				Validators.minLength(1),
				Validators.maxLength(100),
				Validators.pattern('^[a-zA-Z ]*$'),
			]),
			email: new UntypedFormControl(
				'',
				[
					Validators.required,
					Validators.email,
					Validators.pattern(
						'^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'
					),
				],
				[this.isEmailUnique()]
			),
			password: new UntypedFormControl('', [
				Validators.required,
				Validators.minLength(8),
				Validators.maxLength(100),
				Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$'),
			]),
			password_confirm: new UntypedFormControl(
				'',
				[Validators.required],
				[this.passwordsMustMatch()]
			),
			contactNumber: new UntypedFormControl('', [
				Validators.minLength(10),
				Validators.maxLength(20),
				Validators.pattern('^[0-9]*$'),
			]),
		});

		// Manually set the href of terms and conditions
		this.currentLocale = this._accountService.getLocaleId();
		if (this.currentLocale == 'nl') {
			this.termsHref = `${this.homeUrl}/${this.termsAndCondition}`;
		} else {
			this.termsHref = `${this.homeUrl}/${this.currentLocale}/${this.termsAndCondition}`;
		}
	}

	/*
	 * Function to get safe resource url
	 * @param url
	 * @returns
	 */
	getSafeResourceUrl(url: string): SafeResourceUrl {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

	/*
	 * Function to submit the proper values for registration
	 */
	registerMethod() {
		/** *stop here if form is invalid */
		if (this.registrationForm.invalid) {
			this.notificationService.openNotification(
				$localize`:@@account_register_registrationFailed:Registration Failed ! Kindly Check The Form`,
				'',
				'error'
			);
			return;
		}
		/** *else continue */
		//Identify User Type
		let userType = 'personal';
		if (this.isOrganization) {
			userType = 'organization';
		}

		// Check if previous_path exists else send blank
		let previous_path = Tools.getPreviousPath() || '';

		let user;
		if (this.croppedImage.toString().length > 0) {
			user = new UserRegistration(
				this.registrationForm?.value?.first_name,
				this.registrationForm?.value?.last_name,
				this._accountService.getLocaleId(),
				this.registrationForm?.value?.email,
				this.registrationForm?.value?.password,
				userType,
				this.registrationForm?.value?.organisation_name,
				previous_path,
				this.registrationForm?.value?.contactNumber || ' ',
				this.croppedImage,
				this.imageFile && this.imageFile?.name,
				this.imageFile && this.imageFile?.type
			);
		} else {
			user = new UserRegistration(
				this.registrationForm?.value?.first_name,
				this.registrationForm?.value?.last_name,
				this._accountService.getLocaleId(),
				this.registrationForm?.value?.email,
				this.registrationForm?.value?.password,
				userType,
				this.registrationForm?.value?.organisation_name,
				previous_path,
				this.registrationForm?.value?.contactNumber || ' '
			);
		}

		this.isLoading = true;
		this._accountService.register(user).subscribe((res: any) => {
			if (res['status'] == 200 || res['status'] == 201) {
				let user_val = new User(
					res.data.id,
					new JWT(res.data.jwt, ''),
					res.is_email_verified
				);

				/** *SET USER LANGUAGE */
				if (this.isBrowser)
					Tools.setUserlanguage(this._accountService.getLocaleId());

				this._router.navigate([
					'account/registration-complete',
					{ email: this.registrationForm.value.email },
				]);

				this.isLoading = false;
			} else {
				this.notificationService.openNotification(
					$localize`:@@account_register_errorOccured_notification:Error Occurred`,
					'',
					'error'
				);
			}
		}, this._apiService.handleError);
	}

	/*
	 * File Change Event
	 */
	async fileChangeEvent(event: any, newFile?: any): Promise<any> {
		this.imageChangedEvent = event;
		this.imageFile = event.target.files[0];
		if (
			!(
				this.imageFile?.type?.toString().toLocaleLowerCase() == 'image/jpg' ||
				this.imageFile?.type?.toString().toLocaleLowerCase() == 'image/jpeg' ||
				this.imageFile?.type?.toString().toLocaleLowerCase() == 'image/png' ||
				this.imageFile?.type?.toString().toLocaleLowerCase() == 'image/webp'
			)
		) {
			if (
				this.imageFile?.name?.includes('.heic') ||
				this.imageFile?.name?.includes('.HEIC')
			) {
				//TCOVERTING TO JPG
				let f: File = this.imageFile;

				let blob: Blob = f;
				let file: File = f;
				const heic2any = (await import('heic2any')).default;
				heic2any({ blob, toType: 'image/jpeg', quality: 0 }).then(
					(jpgBlob: any) => {
						//Change the name of the file according to the new format
						let newName = f.name.replace(/\.[^/.]+$/, '.jpg');
						//Convert blob back to file
						file = this.blobToFile(jpgBlob, newName);
						this.imageFile = file;
						this.getBase64(this.imageFile);
					}
				);
			} else {
				this.notificationService.openNotification(
					'Upsupported image format',
					'OK',
					'error'
				);
				this.imageChangedEvent = null;
				return;
			}
		}
	}

	blobToFile = (theBlob: Blob, fileName: string): File => {
		let b: any = theBlob;

		//A Blob() is almost a File() - it's just missing the two properties below which we will add
		b.lastModified = new Date();
		b.name = fileName;

		//Cast to a File() type
		return <File>theBlob;
	};

	getBase64(file: any) {
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			//me.modelvalue = reader.result;
			this.imageBase64 = reader.result;
		};
		reader.onerror = function (error) {
			console.log('Error: ', error);
		};
	}

	imageCropped(event: ImageCroppedEvent) {
		this.croppedImage = event.base64;
	}

	imageLoaded() {
		/** *show cropper */
	}
	cropperReady() {
		/** *cropper ready */
	}
	loadImageFailed() {
		/** *show message */
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

	/*
	 * Function to check if given email is unique / already registered
	 * @returns
	 */
	isEmailUnique(): AsyncValidatorFn {
		return (control: AbstractControl) => {
			const validationPromise: Promise<ValidationErrors | null> = new Promise(
				(resolve, reject) => {
					this._accountService.isEmailInUse(control.value).subscribe(
						(result: any) => {
							if (result['data']['email_in_use']) {
								resolve({ emailInUse: true });
							} else {
								resolve(null);
							}
						},
						() => {
							resolve(null);
						}
					);
				}
			);
			return validationPromise;
		};
	}

	/*
	 * Function to check if passwords match
	 * @param control
	 * @returns
	 */
	passwordsMustMatch(): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			const password = this.registrationForm.get('password')?.value;
			const confirmPassword = control.value;

			if (password === confirmPassword) {
				return of(null); // Return null if passwords match
			} else {
				return of({ passwordMismatch: true }); // Return error object if passwords do not match
			}
		};
	}

	/*
	 * Function to switch user type (Personal/Organisation)
	 * @param value
	 */
	switchRegisterType(value: string) {
		if (value == 'personal') {
			this.show = false;
			this.registrationForm.removeControl('organisation_name');
			this.isPersonal = true;
			this.isOrganization = false;
		} else {
			this.show = true;

			this.registrationForm.addControl(
				'organisation_name',
				this.formBuilder.control('', {
					validators: [
						Validators.required,
						Validators.minLength(1),
						Validators.maxLength(100),
						Validators.pattern('^[a-zA-Z0-9]*$'),
					],
				})
			);

			this.isOrganization = true;
			this.isPersonal = false;
		}
	}

	togglePassword() {
		this.fieldPassword = !this.fieldPassword;
	}

	/*
	 * Function to route to login page
	 */
	routeToLogin() {
		this._router.navigate(['account/login']);
	}
	/*
	 *Email getErrorMessage
	 */
	getErrorMessage() {
		return this.registrationForm?.controls['email'].hasError('required')
			? $localize`:@@account_registeration_emailIsRequired_mat_error:Email is required`
			: this.registrationForm?.controls['email'].hasError('emailInUse')
			? $localize`:@@account_registeration_emailIsInUse_mat_error:Email is in use`
			: '';
	}

	/*
	 *Password getErrorMessage
	 */
	getPasswordErrorMessage() {
		return this.registrationForm?.controls['password'].hasError('required')
			? $localize`:@@account_registeration_passwordIsRequired_mat_error:Password is required`
			: this.registrationForm?.controls['password'].hasError('pattern')
			? $localize`:@@account_registeration_minimum8Digits_mat_error:Minimum 8 digit. Must contains 1 Uppercase, 1 number & 0 special characters`
			: '';
	}

	/*
	 * Route to terms & payment
	 */
	routeToTerms() {
		if (this.isBrowser) window.open(this.termsHref, '_blank');
	}

	/** *Route to Online Payment Platform */
	routeToOnlinePayment() {
		if (this.isBrowser) window.open(this.onlinePaymentHref, '_blank');
	}
}
function isPlatformBrwoser(PLATFORM_ID: InjectionToken<Object>): boolean {
	throw new Error('Function not implemented.');
}
