import { Component, Output, Input, EventEmitter } from '@angular/core';
import {
	AbstractControl,
	AsyncValidatorFn,
	FormGroup,
	UntypedFormControl,
	UntypedFormGroup,
	ValidationErrors,
	Validators,
} from '@angular/forms';
import { FundraiserService } from '../../../services/fundraiser.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-fundraiser-contact',
	templateUrl: './fundraiser-contact.component.html',
	styleUrls: ['./fundraiser-contact.component.scss'],
})
export class FundraiserContactComponent {
	shareFundraiserForm!: UntypedFormGroup;
	isShareFundraiserFormValid: boolean = false;
	isLoading: boolean = false;
	@Input() fundraiserData: any = '';
	slug: string = '';
	@Output() shareForm: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
	@Output() shareFormValidity: EventEmitter<boolean> =
		new EventEmitter<boolean>();
	test!: boolean;

	constructor(
		public fundraiserService: FundraiserService,
		public notificationService: NotificationService,
		public router: Router
	) {
		this.shareFundraiserForm = new UntypedFormGroup({
			email: new UntypedFormControl('', [Validators.email]),
			facebook: new UntypedFormControl('', {
				validators: [],
				asyncValidators: [this.isValidFacebookURL()],
			}),
			twitter: new UntypedFormControl('', {
				validators: [],
				asyncValidators: [this.isValidTwitterURL()],
			}),
			linked_in: new UntypedFormControl('', {
				validators: [],
				asyncValidators: [this.isValidLinkedInURL()],
			}),
			instagram: new UntypedFormControl('', {
				validators: [],
				asyncValidators: [this.isValidInstagramURL()],
			}),
			website: new UntypedFormControl('', {
				validators: [],
				asyncValidators: [this.isValidWebsiteURL()],
			}),
		});
	}

	ngOnInit(): void {
		this.shareFundraiserForm?.controls?.email?.patchValue(
			this.fundraiserData?.currentFundraiser?.social_media?.email || ''
		);
		this.shareFundraiserForm?.controls?.facebook?.patchValue(
			this.fundraiserData?.currentFundraiser?.social_media?.facebook || ''
		);
		this.shareFundraiserForm?.controls?.twitter?.patchValue(
			this.fundraiserData?.currentFundraiser?.social_media?.twitter || ''
		);
		this.shareFundraiserForm?.controls?.instagram?.patchValue(
			this.fundraiserData?.currentFundraiser?.social_media?.instagram || ''
		);
		this.shareFundraiserForm?.controls?.website?.patchValue(
			this.fundraiserData?.currentFundraiser?.social_media?.website || ''
		);
		this.shareFundraiserForm?.controls?.linked_in?.patchValue(
			this.fundraiserData?.currentFundraiser?.social_media?.linkedin || ''
		);
		this.shareFundraiserForm.statusChanges.subscribe((val: any) => {
			// console.log('VALLL', val);
			this.shareForm.emit(this.shareFundraiserForm.getRawValue()); // Emit raw form values
			// console.log('VALUEVAL', this.shareFundraiserForm.get('email')?.value);
			if (this.shareFundraiserForm.status === 'VALID') {
				if (
					this.shareFundraiserForm.get('email')?.value.length > 0 ||
					this.shareFundraiserForm.get('facebook')?.value.length > 0 ||
					this.shareFundraiserForm.get('twitter')?.value.length > 0 ||
					this.shareFundraiserForm.get('linked_in')?.value.length > 0 ||
					this.shareFundraiserForm.get('instagram')?.value.length > 0 ||
					this.shareFundraiserForm.get('website')?.value.length > 0
				) {
					this.test = false; // Enable the button if any value is non-empty
				} else {
					this.test = true; // Disable the button if all values are empty
				}
			} else {
				this.test = true; // Disable the button if the form is not valid
			}
			this.shareFormValidity.emit(this.test); // Emit the form validity
		});
	}

	isValidFacebookURL(): AsyncValidatorFn {
		return (control: AbstractControl) => {
			const validationPromise: Promise<ValidationErrors | null> = new Promise(
				(resolve, reject) => {
					let url = control.value;
					if (url?.length <= 0) {
						resolve(null);
					} else {
						let pattern = /facebook\.com/i;
						var match = url?.match(pattern);
						if (match) {
							resolve(null);
						} else {
							resolve({ invalid: 'true' });
						}
					}
				}
			);
			return validationPromise;
		};
	}

	isValidTwitterURL(): AsyncValidatorFn {
		return (control: AbstractControl) => {
			const validationPromise: Promise<ValidationErrors | null> = new Promise(
				(resolve, reject) => {
					let url = control.value;
					if (url?.length <= 0) {
						resolve(null);
					} else {
						let pattern = /twitter\.com/i;
						var match = url?.match(pattern);
						if (match) {
							resolve(null);
						} else {
							resolve({ invalid: 'true' });
						}
					}
				}
			);
			return validationPromise;
		};
	}

	isValidLinkedInURL(): AsyncValidatorFn {
		return (control: AbstractControl) => {
			const validationPromise: Promise<ValidationErrors | null> = new Promise(
				(resolve, reject) => {
					let url = control.value;
					if (url?.length <= 0) {
						resolve(null);
					} else {
						let pattern = /linkedin\.com/i;
						var match = url?.match(pattern);
						if (match) {
							resolve(null);
						} else {
							resolve({ invalid: 'true' });
						}
					}
				}
			);
			return validationPromise;
		};
	}

	isValidInstagramURL(): AsyncValidatorFn {
		return (control: AbstractControl) => {
			const validationPromise: Promise<ValidationErrors | null> = new Promise(
				(resolve, reject) => {
					let url = control.value;
					if (url?.length <= 0) {
						resolve(null);
					} else {
						let pattern = /instagram\.com/i;
						var match = url?.match(pattern);
						if (match) {
							resolve(null);
						} else {
							resolve({ invalid: 'true' });
						}
					}
				}
			);
			return validationPromise;
		};
	}

	isValidWebsiteURL(): AsyncValidatorFn {
		return (control: AbstractControl) => {
			const validationPromise: Promise<ValidationErrors | null> = new Promise(
				(resolve, reject) => {
					let url = control.value;
					// console.log(this.shareFundraiserForm, 'this.shareFundraiserForm');
					if (url?.length <= 0) {
						resolve(null);
					} else {
						let pattern =
							/^(https?:\/\/)?([a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5})(\/.*)?$/i;

						var match = url?.match(pattern);
						// console.log(match, 'match');
						if (match) {
							resolve(null);
						} else {
							resolve({ invalid: 'true' });
						}
					}
				}
			);
			return validationPromise;
		};
	}
}
