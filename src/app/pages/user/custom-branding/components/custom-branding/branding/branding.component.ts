/**This component is invoked if Branding in Custom Branding is selected by a registered user*/

import {
	Component,
	ElementRef,
	Inject,
	Input,
	OnChanges,
	OnInit,
	PLATFORM_ID,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { ThemeService } from 'src/app/global/services/theme.service';
import {
	CustomBrandingService,
	CustomBranding,
} from '../../../services/custom-branding.service';
import {
	AbstractControl,
	UntypedFormControl,
	ValidatorFn,
	Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FundraiserPreviewComponent } from 'src/app/pages/user/custom-branding/components/custom-branding/branding/template/fundraiser-preview.component';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MediaObserver } from '@angular/flex-layout';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { isPlatformBrowser } from '@angular/common';

type colorValidationError = {
	[key: string]: boolean;
};

@Component({
	selector: 'app-branding',
	templateUrl: './branding.component.html',
})
/** *Branding Component */
export class BrandingComponent implements OnInit, OnChanges {
	isLoading: boolean = false;
	ACCOUNT_API_V2: string = environment.ACCOUNT_API_V2;
	customBrandingAPI = 'account/custom_branding/update';

	@Input() customSetting!: any;

	@ViewChild('customLogoUploader', { static: false })
	customLogoUploader!: ElementRef;

	whydonateLogo: string =
		'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxODYiIGhlaWdodD0iNDAiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0iTTAgMGgxODZ2NDBIMHoiLz48cGF0aCBmaWxsPSIjMzJCRjU1IiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik01NS4wNSAxMy4wMzNoMi42NDhhLjYxLjYxIDAgMCAxIC41NzcuODE3bC00Ljg5IDEzLjU0MWEuNjEuNjEgMCAwIDEtLjU3Ny40MDZoLTIuMjM1YS42MTUuNjE1IDAgMCAxLS41ODMtLjQxMmwtMy4zMTctOS42NjctMy4xNTggOS42NmEuNjEyLjYxMiAwIDAgMS0uNTg0LjQyNWgtMi4yMDRhLjYxNi42MTYgMCAwIDEtLjU3Ny0uNGwtNS4wMzYtMTMuNTQxYS42MTIuNjEyIDAgMCAxIC41NzctLjgyM2gyLjY0MmMuMjY4IDAgLjQ5OC4xNy41ODQuNDE3bDMgOS4wOTIgMy4xNC05LjUxNWgzLjI2OGwzLjE0IDkuNTE1IDMuMDAxLTkuMDkyYS42MTUuNjE1IDAgMCAxIC41ODMtLjQxN3YtLjAwNlptMTkuMzIgNi40ODN2Ny42N2EuNjEuNjEgMCAwIDEtLjYxMy42MWgtMi40NTRhLjYxLjYxIDAgMCAxLS42MTMtLjYxVjE5Ljc3YzAtMi4zNzMtMS40MjctMy42MzgtMy4wNzQtMy42MzgtMS42NDYgMC0zLjc3Mi45OC0zLjc3MiAzLjg1NnY3LjE5N2EuNjEuNjEgMCAwIDEtLjYxMy42MTJoLTIuNDU0YS42MS42MSAwIDAgMS0uNjEzLS42MTJWNS42MTdhLjYxLjYxIDAgMCAxIC42MTMtLjYxaDIuNDU0YS42MS42MSAwIDAgMSAuNjEzLjYxdjkuNjYxYy43My0xLjgwMyAzLjExLTIuNjIgNC41OTktMi42MiAzLjgwOCAwIDUuOTI4IDIuNTYgNS45MjggNi44NThabTEyLjU2OC02LjQ4M2gyLjYzYS42MS42MSAwIDAgMSAuNTY1Ljg0N2wtOC42ODYgMjAuNzQ1YS42MDguNjA4IDAgMCAxLS41NjUuMzc1aC0yLjU1YS42MTQuNjE0IDAgMCAxLS41NzItLjg0MWwyLjk5NS03LjQxTDc1LjIyIDEzLjg4YS42MS42MSAwIDAgMSAuNTY1LS44NTNoMi42ODVjLjI0OSAwIC40NzQuMTUxLjU3LjM4MWwzLjY4MiA4Ljk3NyAzLjY1LTguOTc3YS42MS42MSAwIDAgMSAuNTcxLS4zODFsLS4wMDYuMDA2Wm0xNi43NDYtNy43NzNoMi40NTRhLjYxLjYxIDAgMCAxIC42MTQuNjEydjIxLjU2N2EuNjEuNjEgMCAwIDEtLjYxNC42MTJoLTIuNDU0YS42MS42MSAwIDAgMS0uNjEzLS42MTJ2LTEuMzVjLTEuMDE1IDEuNTUtMy4xMSAyLjMzNy00LjkxNCAyLjMzNy0zLjkgMC03LjI5NS0zLjA2OS03LjI5NS03Ljc3OCAwLTQuNzQgMy4zNTktNy43NDIgNy4yNjUtNy43NDIgMS44NyAwIDMuOTMuNzU2IDQuOTUgMi4zMDZWNS44NjZhLjYxLjYxIDAgMCAxIC42MTMtLjYxMmwtLjAwNi4wMDZabS0uNjc0IDE1LjM2M2MwLTIuNTktMi4xNTYtNC4yOTctNC4yODItNC4yOTctMi4yODQgMC00LjE1NSAxLjgzNC00LjE1NSA0LjI5NyAwIDIuNDY0IDEuODcxIDQuMzk1IDQuMTU1IDQuMzk1IDIuMjg0IDAgNC4yODItMS44MDQgNC4yODItNC4zOTVabTUuNjQ5LS4yMjNjMC00LjY4IDMuNjUtNy43NDMgNy44NjYtNy43NDMgNC4yMTUgMCA3Ljg5NiAzLjA2MyA3Ljg5NiA3Ljc0MyAwIDQuNjc5LTMuNjggNy43NzgtNy44OTYgNy43NzgtNC4yMjIgMC03Ljg2Ni0zLjEtNy44NjYtNy43NzhabTEyLjA1IDBjMC0yLjUzLTEuOS00LjMyOS00LjE4NC00LjMyOS0yLjI4NCAwLTQuMTU1IDEuODA0LTQuMTU1IDQuMzI5IDAgMi41OSAxLjg3MSA0LjM2NCA0LjE1NSA0LjM2NCAyLjI4NCAwIDQuMTg1LTEuNzY4IDQuMTg1LTQuMzY0Wm0xOS43NzItLjg4NHY3LjY3YS42MS42MSAwIDAgMS0uNjE0LjYxaC0yLjQ1M2EuNjEuNjEgMCAwIDEtLjYxNC0uNjFWMTkuNzdjMC0yLjM3My0xLjQyNy0zLjYzOC0zLjA3My0zLjYzOHMtMy43NzIuOTgtMy43NzIgMy44MjZ2Ny4yMjdhLjYxLjYxIDAgMCAxLS42MTQuNjEyaC0yLjQ1NGEuNjEuNjEgMCAwIDEtLjYxMy0uNjEydi0xMy41NGEuNjEuNjEgMCAwIDEgLjYxMy0uNjEyaDIuNDU0YS42MS42MSAwIDAgMSAuNjE0LjYxMXYxLjcyNWMuNzU5LTEuODY0IDMuMDgtMi43MTggNC41OTgtMi43MTggMy44MDggMCA1LjkyOCAyLjU2IDUuOTI4IDYuODU5di4wMDZabTE1LjA4OC02LjQ4M2gyLjQ1NGEuNjEuNjEgMCAwIDEgLjYxMy42MTF2MTMuNTQxYS42MS42MSAwIDAgMS0uNjEzLjYxMmgtMi40NTRhLjYxLjYxIDAgMCAxLS42MTQtLjYxMlYyNS40OWMtLjk4NCAxLjYxLTIuOTUyIDIuNjg4LTUuMDc3IDIuNjg4LTMuOTY3IDAtNy4xMzctMy4xOS03LjEzNy03Ljc3OCAwLTQuNDU2IDMuMDQzLTcuNzQzIDcuMjM0LTcuNzQzIDIuMDI4IDAgMy45OTYuODg0IDQuOTggMi40MzR2LTEuNDRhLjYxLjYxIDAgMCAxIC42MTQtLjYxMnYtLjAwNlptLS42NzQgNy4zNjdjMC0yLjUzLTIuMDk2LTQuMzI5LTQuMjgyLTQuMzI5LTIuMzgyIDAtNC4xODYgMS45NjItNC4xODYgNC4zMjkgMCAyLjM3MiAxLjgxIDQuMzY0IDQuMjIyIDQuMzY0IDIuMjg0IDAgNC4yNTItMS44OTUgNC4yNTItNC4zNjRoLS4wMDZabTE1LjI2NC05Ljg3M3YxLjY4MmEuNjEuNjEgMCAwIDEtLjYxNC42MTJoLTIuNTI2VjI3LjczYS42MS42MSAwIDAgMS0uNjE0LjYxMWgtMi40NTRhLjYxLjYxIDAgMCAxLS42MTMtLjYxMVYxMi44MmgtMi4wNTNhLjYxLjYxIDAgMCAxLS42MTQtLjYxdi0xLjY4M2EuNjEuNjEgMCAwIDEgLjYxNC0uNjEyaDIuMDUzVjUuNjExQS42MS42MSAwIDAgMSAxNjMuOTUgNWgyLjQ1NGEuNjEuNjEgMCAwIDEgLjYxNC42MTF2NC4zMDRoMi41MjZhLjYxLjYxIDAgMCAxIC42MTQuNjEyWm0xNS4yMDMgMTAuODk2SDE3NC40NmMuNDEzIDIuMDUyIDEuOTk5IDMuMTYgNC4yMTYgMy4xNiAxLjM5IDAgMi43NTctLjUzMyAzLjY1LTEuNDc4YS42MDkuNjA5IDAgMCAxIC44MTQtLjA2NmwxLjUzIDEuMTU2Yy4yNzQuMjA2LjMyMy42LjExLjg3Mi0xLjQzMyAxLjgyOC0zLjg1NyAyLjgzMy02LjMzIDIuODMzLTQuNDA5IDAtNy43NjgtMy4xNi03Ljc2OC03Ljc3OSAwLTQuNzEgMy41MjMtNy43NDIgNy43NjktNy43NDJTMTg2IDE1LjM4IDE4NiAxOS45OTRjMCAuMjU0LS4wMTIuNTM5LS4wMy44NDFhLjYxMy42MTMgMCAwIDEtLjYxNC41ODFsLjAwNi4wMDdabS0zLjAwNi0yLjU2MWMtLjIyLTIuMDIyLTEuODEtMy4yMjYtMy44Ny0zLjIyNi0xLjk2OCAwLTMuNTgzLjk4LTQuMDI3IDMuMjI2aDcuODk3Wk0yNC45MDQgNS4wMDZINS41MzRDMi40NzcgNS4wMDYgMCA3LjM5NyAwIDEwLjM0NXYxOC42OGMwIDIuNjUyIDIuMDA0IDQuODU1IDQuNjQgNS4yNjdsOS4xMjQuMDY2aDExLjE1MmMzLjA1NSAwIDUuNTMzLTIuMzkgNS41MzMtNS4zMzlWMTAuMzRDMzAuNDUgNy4zOTEgMjcuOTcxIDUgMjQuOTE2IDVsLS4wMTIuMDA2Wm0tOS42ODggMjQuNjk3Yy01LjcwNCAwLTEwLjMyLTQuMzk0LTEwLjMyNi05LjgxOGgyMC42NDVjMCA1LjQyNC00LjYyMiA5LjgxOC0xMC4zMiA5LjgxOFoiLz48L2c+PC9zdmc+';
	brandingLogoPreviewUrl: string;
	brandingLogo: string;

	customShadow = new UntypedFormControl('1');
	isBrowser: boolean = false;

	primaryColor = '#32bf55';
	primaryColorHex = new UntypedFormControl(
		this.primaryColor,
		Validators.pattern(/^#[0-9a-zA-Z]{6}$/)
	);

	secondaryColor = '#363396';
	secondaryColorHex = new UntypedFormControl(
		this.secondaryColor,
		Validators.compose([
			Validators.pattern(/^#[0-9a-zA-Z]{6}$/),
			this.colorValidator(),
		])
	);

	fontFamily = new UntypedFormControl('Roboto');
	customPrimaryColor: string;
	customSecondaryColor: string;

	/** *Read user profile data */
	selectedBrandingLogo!: File;
	closeCropper = false;
	imageChangedEvent: any = '';
	isSaving!: boolean;
	isSaveDisabled: boolean = true;

	constructor(
		private accountService: AccountService,
		private _themeService: ThemeService,
		private _customBrandingService: CustomBrandingService,
		private _http: HttpClient,
		public media: MediaObserver,
		public dialog: MatDialog,
		public notificationService: NotificationService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		this.customPrimaryColor = this.primaryColor;
		this.customSecondaryColor = this.secondaryColor;
		this.brandingLogoPreviewUrl = this.whydonateLogo;
		this.brandingLogo = this.whydonateLogo;
	}

	/** *----------------------------------------------------------------------------------------------------- */
	/** *@ Lifecycle hooks */
	/** *----------------------------------------------------------------------------------------------------- */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.isLoading = true;
	}

	/**
	 * On Change
	 */
	ngOnChanges(changes: SimpleChanges): void {
		if (changes.customSetting.currentValue) {
			!changes.customSetting.currentValue?.isDefault
				? this.setBrandingView(changes.customSetting.currentValue)
				: null;
			this.isLoading = false;

			this.fontFamily.valueChanges.subscribe((event) => {
				this.isSaveDisabled = false;
			});
			this.customShadow.valueChanges.subscribe((event) => {
				this.isSaveDisabled = false;
			});
		}
	}

	/** *----------------------------------------------------------------------------------------------------- */
	/** *@ Public methods */
	/** *----------------------------------------------------------------------------------------------------- */

	fileChangeEvent(event: any): void {
		this.imageChangedEvent = event;
		this.closeCropper = true;
	}

	/** *Hide the image cropper */
	cropImage() {
		this.closeCropper = false;
	}

	/** *Convert datauri to blob */
	dataURItoBlob(dataURI: any) {
		var byteString = atob(dataURI.toString().split(',')[1]);
		var ab = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(ab);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		var blob = new Blob([ab], { type: 'image/png' });
		return new File([blob], 'image.png');
	}

	imageCropped(event: ImageCroppedEvent) {
		this.brandingLogo = event.base64 || '';
		this.selectedBrandingLogo = this.dataURItoBlob(this.brandingLogo);
		this.brandingLogoPreviewUrl = event.base64 || '';

		this.isSaveDisabled = false;
	}

	imageLoaded() {
		/**
		 * show cropper */
	}
	cropperReady() {
		/** *cropper ready */
	}
	loadImageFailed() {
		/** *show message */
	}

	setBrandingView(customBrandingSetting: CustomBranding) {
		this.brandingLogoPreviewUrl = customBrandingSetting.customLogo;
		this.brandingLogo = customBrandingSetting.customLogo;
		this.customShadow.patchValue(
			this._customBrandingService.calculateCardShadow(
				customBrandingSetting.cardShadow
			)
		);
		this.primaryColorHex.patchValue(customBrandingSetting.primaryColor);
		this.secondaryColorHex.patchValue(customBrandingSetting.secondaryColor);
		this.fontFamily.patchValue(customBrandingSetting.customFont);

		this._themeService.setTheme(
			this.primaryColorHex.value,
			this.secondaryColorHex.value,
			this.fontFamily.value
		);
	}

	onPrimaryColorChange(hex: string): void {
		this.primaryColorHex.patchValue(hex);
		this.isSaveDisabled = false;
	}
	onSecondaryColorChange(hex: string) {
		this.secondaryColorHex.patchValue(hex);
		this.isSaveDisabled = false;
	}

	previewCustomisedBranding() {
		this.dialog.open(FundraiserPreviewComponent, {
			data: {
				primaryColor: this.primaryColorHex.value,
				secondaryColor: this.secondaryColorHex.value,
				customShadow: this.customShadow.value,
				customLogo: this.brandingLogoPreviewUrl,
			},
			panelClass: 'branding-preview',
		});
	}

	discardChanges() {
		this.cropImage();
		this.customLogoUploader.nativeElement.value = '';
		this.setBrandingView(this.customSetting);
		this.isSaveDisabled = true;
	}
	setDefaultBranding() {
		/** *Reset logo uploader set whydonate logo */
		this.cropImage();
		this.customLogoUploader.nativeElement.value = '';
		this.brandingLogo = this.whydonateLogo;
		this.brandingLogoPreviewUrl = this.whydonateLogo;

		if (this.customSetting?.isDefault === false) {
			this.selectedBrandingLogo = this.dataURItoBlob(this.whydonateLogo);
		}

		this.customShadow.patchValue('1');
		this.primaryColorHex.patchValue(this.primaryColor);
		this.secondaryColorHex.patchValue(this.secondaryColor);
		this.fontFamily.patchValue('Roboto');

		this.notificationService.openNotification(
			$localize`:@@branding_default_notification:Default Whydonate branding set successfull`,
			'Close',
			'success'
		);
	}

	applyCustomBranding() {
		let profileData = this._customBrandingService.getProfileObj;

		/** *Saving data status */
		this.isSaving = true;

		/** *Hide cropper */
		this.cropImage();

		let formData = new FormData();

		if (this.selectedBrandingLogo) {
			formData.append('custom_logo', this.selectedBrandingLogo);
		}

		formData.append('id', profileData?.id);
		formData.append('card_shadow', this.customShadow.value);
		formData.append('fonts', this.fontFamily.value);
		formData.append('primary_color', this.primaryColorHex.value);
		formData.append('secondary_color', this.secondaryColorHex.value);
		formData.append('is_default', '0');

		/** *Get user auth token  */
		let headers = this.accountService.getHeaders();
		const httpOptions = {
			headers: new HttpHeaders({
				Authorization: headers?.get('Authorization') as string,
			}),
		};

		this._http
			.put(
				`${this.ACCOUNT_API_V2}${this.customBrandingAPI}`,
				formData,
				httpOptions
			)
			.subscribe(
				(response: any) => {
					this.notificationService.openNotification(
						$localize`:@@branding_customizeBranding_notification:Customise branding saved successfull`,
						'Close',
						'success'
					);

					if (this.isBrowser) window.location.reload();
				},
				(error) => {
					this.isSaving = false;
					this.notificationService.openNotification(
						$localize`:@@branding_failedToSave_notification:Failed to save Customise branding`,
						'',
						'error'
					);
				}
			);

		this._themeService.setTheme(
			this.primaryColorHex.value,
			this.secondaryColorHex.value,
			this.fontFamily.value
		);
	}

	setCustomLogoBlob(file: File) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	}

	isColorInvalid(colorHex: string): boolean {
		return !this._themeService.isColorAccessible(colorHex);
	}

	colorValidator(): ValidatorFn {
		return (control: AbstractControl): colorValidationError | null => {
			if (this.isColorInvalid(control.value)) {
				return { colorIsLight: true };
			} else {
				return null;
			}
		};
	}
}

@Component({
	selector: 'dialog-elements-example-dialog',
	template: `fundraiser svg`,
})
export class DialogElementsExampleDialog {}
