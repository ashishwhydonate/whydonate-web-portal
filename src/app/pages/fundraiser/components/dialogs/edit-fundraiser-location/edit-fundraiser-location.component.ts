import {
	AfterViewInit,
	Component,
	Inject,
	OnInit,
	PLATFORM_ID,
} from '@angular/core';
import {
	AbstractControl,
	AsyncValidatorFn,
	FormBuilder,
	UntypedFormControl,
	UntypedFormGroup,
	ValidationErrors,
	Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CategoryService } from '../../../services/category.service';
import { FundraiserService } from '../../../services/fundraiser.service';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { interval } from 'rxjs';
import { debounce, distinctUntilChanged } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-edit-fundraiser-location',
	templateUrl: './edit-fundraiser-location.component.html',
})
export class EditFundraiserLocationComponent implements OnInit, AfterViewInit {
	locationForm!: UntypedFormGroup;
	debounceDelay: number = 500; //debounce delay for location input
	locations: any = [];
	locationBody: any = {};
	isLoading: boolean = false;
	isSave: boolean = false;
	isBrowser: boolean = false;
	constructor(
		public fundraiserService: FundraiserService,
		public _accountService: AccountService,
		public categoryService: CategoryService,
		public notificationService: NotificationService,
		@Inject(MAT_DIALOG_DATA) public data: { currentFundraiser: any },
		public dialogRef: MatDialogRef<EditFundraiserLocationComponent>,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		this.locationForm = new UntypedFormGroup({
			locationControl: new UntypedFormControl('', {
				validators: [Validators.required],
				asyncValidators: [this.isLocationValid()],
			}),
		});

		this.locationForm?.controls['locationControl'].setValue(
			data?.currentFundraiser?.location_local?.name
		);
	}

	ngOnInit(): void {}

	/**
	 * Function to validate location---------------------------------------
	 * @returns validationPromise
	 */

	isLocationValid(): AsyncValidatorFn {
		return (control: AbstractControl) => {
			const validationPromise: Promise<ValidationErrors | null> = new Promise(
				(resolve, reject) => {
					let value = control.value;
					// Find location value from control and try to find it on the location object from the API.
					let selectedLocation = (this.locations || []).find((item: any) => {
						return item?.description === value;
					});
					// If location from control value not found in location object from API then throw validation error.
					if (Object.keys(selectedLocation || {}).length) {
						resolve(null);
					} else {
						resolve({ location: 'doNotExist' });
					}
				}
			);
			return validationPromise;
		};
	}

	ngAfterViewInit(): void {
		/*
		 * Retrieve places list---------------------------------------
		 * @returns
		 */
		this.locationForm
			.get('locationControl')
			?.valueChanges.pipe(
				debounce(() => {
					return interval(this.debounceDelay + 100);
				}),
				distinctUntilChanged((x, y) => {
					/** *INFO: If no actual change then cancel the loading and Search */
					if (x === y) {
						// console.log(`query x: ${x}, y: ${y} are identical, api called interrupted`);
						this.isLoading = false;
						return true;
					}
					return false;
				})
			)
			.subscribe((searchTerm) => {
				try {
					this.isLoading = true;
					if (searchTerm.trim()) {
						this.categoryService.getLocation(searchTerm).subscribe(
							(result) => {
								this.locations = JSON.parse(JSON.stringify(result))['data'][
									'result'
								];
								this.setPlaceId();
								this.isLoading = false;
							},
							(err: any) => {
								if (err?.error?.errors?.code == '1002') {
									this.notificationService.openNotification(
										err?.error?.errors?.message,
										'',
										'error'
									);
								} else {
									// console.log('err', err);
									this.notificationService.openNotification(
										$localize`:@@edit_fundraiser_location_fetchingLocation_notification:There was an error while fetching location`,
										'close',
										'error'
									);
								}
								this.isLoading = false;
							}
						);
					}
				} catch (e) {
					this.isLoading = false;
				}
			});
	}

	setPlaceId() {
		// console.log('location name',this.locationForm.get('locationControl')?.value);
		this.locations.forEach((location: any) => {
			if (
				location['description'] ==
				this.locationForm.get('locationControl')?.value
			) {
				this.locationBody['location_local'] = location['description'];
				console.log('LOCATION', this.locationBody['location_local']);
			}
		});
	}
	dialogClose() {
		this.isSave = true;
		try {
			// this.locationBody['language_code'] = this._accountService.getLocaleId();
			this.locationBody['id'] = this.data?.currentFundraiser?.id;
			if (
				this.data?.currentFundraiser?.parent != null &&
				Object.keys(this.data?.currentFundraiser?.parent).length > 0
			) {
				this.locationBody['slug'] = this.data?.currentFundraiser?.slug;
				console.log('LOCATION BODY', this.locationBody);
				this.fundraiserService
					.updateConnectedFundraiserLocation(this.locationBody)
					.subscribe(
						(res: any) => {
							console.log('CONNECTED RES', res.data);
							this.isSave = false;
							// console.log('Location Updated', res);
							this.notificationService.openNotification(
								$localize`:@@edit_fundraiser_location_locationUpdated_notification:Fundraiser location is updated`,
								'',
								'success'
							);
							// console.log('EditFundraiserLocationComponent', res);
							this.dialogRef.close(res?.data?.location_local);
							if (this.isBrowser) window.location.reload();
						},
						(err: any) => {
							this.notificationService.openNotification(
								$localize`:@@edit_fundraiser_location_errorUpdating_notification:There was an error updating fundraiser location`,
								'close',
								'error'
							);
							this.isSave = false;
						}
					);
			} else {
				this.fundraiserService
					.updateFundraiserLocation(this.locationBody)
					.subscribe(
						(res: any) => {
							this.isSave = false;
							// console.log('Location Updated', res);
							this.notificationService.openNotification(
								$localize`:@@edit_fundraiser_location_locationUpdated_notification:Fundraiser location is updated`,
								'',
								'success'
							);
							// console.log('EditFundraiserLocationComponent', res);
							this.dialogRef.close(res?.data?.location_local);
							if (this.isBrowser) window.location.reload();
						},
						(err: any) => {
							this.notificationService.openNotification(
								$localize`:@@edit_fundraiser_location_errorUpdating_notification:There was an error updating fundraiser location`,
								'close',
								'error'
							);
							this.isSave = false;
						}
					);
			}
		} catch (err: any) {
			this.notificationService.openNotification(
				$localize`:@@edit_fundraiser_location_error_notification:There was an error`,
				'close',
				'error'
			);
			this.isSave = false;
		}
	}
	onCloseClick() {
		this.dialogRef.close();
	}
}
