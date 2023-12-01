/**This component is invoked when Email is selected in Custom Branding by a registered user */

import {
	AfterViewChecked,
	AfterViewInit,
	Component,
	EventEmitter,
	Host,
	Inject,
	Input,
	OnChanges,
	OnInit,
	Output,
	PLATFORM_ID,
	Self,
	SimpleChange,
	SkipSelf,
} from '@angular/core';
import {
	ContentChange,
	SelectionChange,
	QuillEditorComponent as OriginalQuillEditorComponent,
} from 'ngx-quill';
import { Quill } from 'quill';
import {
	FormBuilder,
	UntypedFormControl,
	UntypedFormGroup,
	Validators,
} from '@angular/forms';
import {
	CustomBrandingService,
	CustomEmail,
	ThankYou,
	Register,
	DonationReceived,
	FundraiserCreated,
	FundraiserPublished,
	FundraiserClosed,
} from '../../../services/custom-branding.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MediaObserver } from '@angular/flex-layout';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { HttpClient } from '@angular/common/http';
import { NavigationExtras, Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatLegacyCheckboxChange } from '@angular/material/legacy-checkbox';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-email',
	templateUrl: './email.component.html',
})
/** *Email Component */
export class EmailComponent implements OnInit, AfterViewInit, OnChanges {
	@Input() customSetting!: CustomEmail; //customEmailSetting from @input
	customEmailSetting!: CustomEmail; //customEmailSetting from service
	isLoading: boolean = false;
	profileId: string = '';
	state: boolean = false;
	userEmail: string = '';
	passData: boolean = false;
	Email: string = '';
	@Output() tabValue: any = new EventEmitter<any>();

	isCustomBrandingChecked: boolean;
	defaultState: boolean = true;
	isBrowser: boolean = false;

	quillForm0 = new UntypedFormGroup({
		quillCtrl0: new UntypedFormControl('', [
			Validators.required,
			Validators.minLength(0),
			Validators.maxLength(120),
			Validators.pattern(
				/^[a-zA-Z0-9_\s\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FAC0}-\u{1FAFF}\u{1FB00}-\u{1FBFF}\u{1FC00}-\u{1FCFF}\u{1FD00}-\u{1FDFF}\u{1FE00}-\u{1FEFF}\u{1FF00}-\u{1FFFF}\u{2B05}\u{1F004}a-zA-Z0-9\s!@$%^&(),.?"';:{}|<>_+=\-\[\]\\\/]+$/u
			),
		]),
		flagCtrl: new UntypedFormControl(),
	});

	quillForm1 = new UntypedFormGroup({
		quillCtrl1: new UntypedFormControl('', [
			Validators.required,
			Validators.minLength(0),
			Validators.maxLength(120),
			Validators.pattern(
				/^[a-zA-Z0-9_\s\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FAC0}-\u{1FAFF}\u{1FB00}-\u{1FBFF}\u{1FC00}-\u{1FCFF}\u{1FD00}-\u{1FDFF}\u{1FE00}-\u{1FEFF}\u{1FF00}-\u{1FFFF}\u{2B05}\u{1F004}a-zA-Z0-9\s!@$%^&(),.?"';:{}|<>_+=\-\[\]\\\/]+$/u
			),
		]),
		flagCtrl: new UntypedFormControl(),
	});
	quillForm2 = new UntypedFormGroup({
		quillCtrl2: new UntypedFormControl('', [
			Validators.required,
			Validators.minLength(0),
			Validators.maxLength(120),
			Validators.pattern(
				/^[a-zA-Z0-9_\s\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FAC0}-\u{1FAFF}\u{1FB00}-\u{1FBFF}\u{1FC00}-\u{1FCFF}\u{1FD00}-\u{1FDFF}\u{1FE00}-\u{1FEFF}\u{1FF00}-\u{1FFFF}\u{2B05}\u{1F004}a-zA-Z0-9\s!@$%^&(),.?"';:{}|<>_+=\-\[\]\\\/]+$/u
			),
		]),
		flagCtrl: new UntypedFormControl(),
	});
	quillForm3 = new UntypedFormGroup({
		quillCtrl3: new UntypedFormControl('', [
			Validators.required,
			Validators.minLength(0),
			Validators.maxLength(120),
			Validators.pattern(
				/^[a-zA-Z0-9_\s\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FAC0}-\u{1FAFF}\u{1FB00}-\u{1FBFF}\u{1FC00}-\u{1FCFF}\u{1FD00}-\u{1FDFF}\u{1FE00}-\u{1FEFF}\u{1FF00}-\u{1FFFF}\u{2B05}\u{1F004}a-zA-Z0-9\s!@$%^&(),.?"';:{}|<>_+=\-\[\]\\\/]+$/u
			),
		]),
		flagCtrl: new UntypedFormControl(),
	});
	quillForm4 = new UntypedFormGroup({
		quillCtrl4: new UntypedFormControl('', [
			Validators.required,
			Validators.minLength(0),
			Validators.maxLength(120),
			Validators.pattern(
				/^[a-zA-Z0-9_\s\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FAC0}-\u{1FAFF}\u{1FB00}-\u{1FBFF}\u{1FC00}-\u{1FCFF}\u{1FD00}-\u{1FDFF}\u{1FE00}-\u{1FEFF}\u{1FF00}-\u{1FFFF}\u{2B05}\u{1F004}a-zA-Z0-9\s!@$%^&(),.?"';:{}|<>_+=\-\[\]\\\/]+$/u
			),
		]),
		flagCtrl: new UntypedFormControl(),
	});
	quillForm5 = new UntypedFormGroup({
		quillCtrl5: new UntypedFormControl('', [
			Validators.required,
			Validators.minLength(0),
			Validators.maxLength(120),
			Validators.pattern(
				/^[a-zA-Z0-9_\s\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FAC0}-\u{1FAFF}\u{1FB00}-\u{1FBFF}\u{1FC00}-\u{1FCFF}\u{1FD00}-\u{1FDFF}\u{1FE00}-\u{1FEFF}\u{1FF00}-\u{1FFFF}\u{2B05}\u{1F004}a-zA-Z0-9\s!@$%^&(),.?"';:{}|<>_+=\-\[\]\\\/]+$/u
			),
		]),
		flagCtrl: new UntypedFormControl(),
	});

	quillModuleConfig = {};

	panelOpenState0 = false;
	panelOpenState1 = false;
	panelOpenState2 = false;
	panelOpenState3 = false;
	panelOpenState4 = false;
	panelOpenState5 = false;

	_quillContent0: string;
	_quillContent1: string;
	_quillContent2: string;
	_quillContent3: string;
	_quillContent4: string;
	_quillContent5: string;
	_quillContentFlag0: boolean;
	_quillContentFlag1: boolean;
	_quillContentFlag2: boolean;
	_quillContentFlag3: boolean;
	_quillContentFlag4: boolean;
	_quillContentFlag5: boolean;

	isSave: boolean;
	userProfile: any;

	constructor(
		private _customBrandingService: CustomBrandingService,
		public media: MediaObserver,
		private _notificationService: NotificationService,
		private _http: HttpClient,
		public _router: Router,
		public iconRegistry: MatIconRegistry,
		public sanitizer: DomSanitizer,
		public accountService: AccountService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		iconRegistry.addSvgIconSet(
			sanitizer.bypassSecurityTrustResourceUrl(
				'assets/icons/fundraiser-defs.svg'
			)
		);
		this.isCustomBrandingChecked = false;

		this._quillContentFlag0 = false;
		this._quillContent0 = ``;

		this._quillContentFlag1 = false;
		this._quillContent1 = ``;

		this._quillContentFlag2 = false;
		this._quillContent2 = ``;

		this._quillContentFlag3 = false;
		this._quillContent3 = ``;

		this._quillContentFlag4 = false;
		this._quillContent4 = ``;

		this._quillContentFlag5 = false;
		this._quillContent5 = ``;

		this.isSave = false;
	}
	ngAfterViewInit(): void {}

	ngOnInit(): void {
		this.isLoading = true;
		if (this.accountService.checkHeaders()) {
			this._customBrandingService.getProfile().subscribe((userProfile) => {
				this.userProfile = userProfile;
				this.profileId = this.userProfile?.data?.profile?.id;
				console.log('the user profile is', this.userProfile);
				this.isLoading = false;
				if (
					this.userProfile?.data?.profile?.custom_logo ==
						'https://res.cloudinary.com/whydonate/image/upload/dpr_auto,f_auto,q_auto/v1/whydonate-staging/user/profile/custom/logo/image_rryz9c' ||
					this.userProfile?.data?.profile?.primary_color == '#32bf55' ||
					this.userProfile?.data?.profile?.secondary_color == '#363396'
				) {
					this.defaultState = true;
				} else {
					this.defaultState = false;
				}
			});
		} else {
			this.defaultState = false;
		}
	}

	ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
		if (changes.customSetting.currentValue) {
			this.setCustomEmailView(changes.customSetting.currentValue);
			this.isLoading = false;
		}
	}

	setCustomEmailView(customEmailSetting: CustomEmail) {
		this.isCustomBrandingChecked = customEmailSetting.customBranding;

		this._quillContentFlag0 = customEmailSetting.thankYouFlag;
		this.quillForm0?.controls.flagCtrl.patchValue(this._quillContentFlag0);
		this._quillContent0 = customEmailSetting.thankYouMessage;
		this.quillForm0?.controls.quillCtrl0.patchValue(this._quillContent0);

		this._quillContentFlag1 = customEmailSetting.registerFlag;
		this.quillForm1?.controls.flagCtrl.patchValue(this._quillContentFlag1);
		this._quillContent1 = customEmailSetting.registerMessage;
		this.quillForm1?.controls.quillCtrl1.patchValue(this._quillContent1);

		this._quillContentFlag2 = customEmailSetting.donationReceivedFlag;
		this.quillForm2?.controls.flagCtrl.patchValue(this._quillContentFlag2);
		this._quillContent2 = customEmailSetting.donationReceivedMessage;
		this.quillForm2?.controls.quillCtrl2.patchValue(this._quillContent2);

		this._quillContentFlag3 = customEmailSetting.fundraiserCreatedFlag;
		this.quillForm3?.controls.flagCtrl.patchValue(this._quillContentFlag3);
		this._quillContent3 = customEmailSetting.fundraiserCreatedMessage;
		this.quillForm3?.controls.quillCtrl3.patchValue(this._quillContent3);

		this._quillContentFlag4 = customEmailSetting.fundraiserPublishedFlag;
		this.quillForm4?.controls.flagCtrl.patchValue(this._quillContentFlag4);
		this._quillContent4 = customEmailSetting.fundraiserPublishedMessage;
		this.quillForm4?.controls.quillCtrl4.patchValue(this._quillContent4);

		this._quillContentFlag5 = customEmailSetting.fundraiserClosedFlag;
		this.quillForm5?.controls.flagCtrl.patchValue(this._quillContentFlag5);
		this._quillContent5 = customEmailSetting.fundraiserClosedMessage;
		this.quillForm5?.controls.quillCtrl5.patchValue(this._quillContent5);
	}
	showPreview() {
		return (
			this.panelOpenState0 ||
			this.panelOpenState1 ||
			this.panelOpenState2 ||
			this.panelOpenState3 ||
			this.panelOpenState4 ||
			this.panelOpenState5
		);
	}

	isEditMode(newVal: string, orignalVal: any) {
		newVal = newVal || '';
		orignalVal = orignalVal || '';
		return newVal != orignalVal;
	}

	created(event: Quill) {
		/** *INFO: Reactive Form's valueChanges event */
		this.quillForm0?.controls.quillCtrl0.valueChanges
			.pipe(debounceTime(400), distinctUntilChanged())
			.subscribe((data) => {});
	}
	routeToBranding() {
		this.tabValue.emit(0);
	}
	toggleCustomBranding(event: MatLegacyCheckboxChange) {
		this.isSave = true;
		this._customBrandingService
			.applyCustomBrandingToEmail(event.checked)
			.subscribe((res: any) => {
				if (event.checked) {
					this.passData = true;
					this._notificationService.openNotification(
						$localize`:@@email_customise_branding_notification:Customise branding is applied`,
						'Close',
						'success'
					);

					this.ngOnInit();
				} else {
					this.passData = false;
					this._notificationService.openNotification(
						$localize`:@@email_customiseBranding_notification_error:Customise branding is set to default`,
						'Close',
						'success'
					);
				}
				this.isSave = false;
			});
	}

	saveForm(index: number) {
		this.isSave = true;
		let customEmailValue = this.getCustomEmailValue(index);
		if (customEmailValue) {
			this._customBrandingService
				.saveCustomEmail(customEmailValue)
				.subscribe((res) => {
					this.isSave = false;
					this.setQuillContent(index);
				});
		}
	}
	/** *Discard Changes */
	discardChanges(index: number) {
		if (index === 0) {
			this.quillForm0?.controls.quillCtrl0?.patchValue(this._quillContent0);
			this.quillForm0?.controls.flagCtrl?.patchValue(this._quillContentFlag0);
			this.quillForm0.markAsPristine();
		}
		if (index === 1) {
			this.quillForm1?.controls.quillCtrl1?.patchValue(this._quillContent1);
			this.quillForm1?.controls.flagCtrl?.patchValue(this._quillContentFlag1);
			this.quillForm1.markAsPristine();
		}
		if (index === 2) {
			this.quillForm2?.controls.quillCtrl2?.patchValue(this._quillContent2);
			this.quillForm2?.controls.flagCtrl?.patchValue(this._quillContentFlag2);
			this.quillForm2.markAsPristine();
		}
		if (index === 3) {
			this.quillForm3?.controls.quillCtrl3?.patchValue(this._quillContent3);
			this.quillForm3?.controls.flagCtrl?.patchValue(this._quillContentFlag3);
			this.quillForm3.markAsPristine();
		}
		if (index === 4) {
			this.quillForm4?.controls.quillCtrl4?.patchValue(this._quillContent4);
			this.quillForm4?.controls.flagCtrl?.patchValue(this._quillContentFlag4);
			this.quillForm4.markAsPristine();
		}
		if (index === 5) {
			this.quillForm5?.controls.quillCtrl5?.patchValue(this._quillContent5);
			this.quillForm5?.controls.flagCtrl?.patchValue(this._quillContentFlag5);
			this.quillForm5.markAsPristine();
		}
	}
	/** *Get Custom Email Value */
	getCustomEmailValue(
		index: number
	):
		| ThankYou
		| Register
		| DonationReceived
		| FundraiserCreated
		| FundraiserPublished
		| FundraiserClosed
		| undefined {
		if (index === 0)
			return {
				thank_you_donor: this.quillForm0.get('flagCtrl')?.value || false,
				thank_you_donor_message: this.quillForm0.get('quillCtrl0')?.value || '',
			};

		if (index === 1)
			return {
				thank_you_register: this.quillForm1.get('flagCtrl')?.value || false,
				thank_you_register_message:
					this.quillForm1.get('quillCtrl1')?.value || '',
			};

		if (index === 2)
			return {
				donation_received: this.quillForm2.get('flagCtrl')?.value || false,
				donation_received_message:
					this.quillForm2.get('quillCtrl2')?.value || '',
			};

		if (index === 3)
			return {
				connected_fundraisers: this.quillForm3.get('flagCtrl')?.value || false,
				connected_fundraisers_message:
					this.quillForm3.get('quillCtrl3')?.value || '',
			};

		if (index === 4)
			return {
				fundraiser_published: this.quillForm4.get('flagCtrl')?.value || false,
				fundraiser_published_message:
					this.quillForm4.get('quillCtrl4')?.value || '',
			};

		if (index === 5)
			return {
				fundraiser_closed: this.quillForm5.get('flagCtrl')?.value || false,
				fundraiser_closed_message:
					this.quillForm5.get('quillCtrl5')?.value || '',
			};

		return undefined;
	}
	/** *Set Quill Content */
	setQuillContent(index: number) {
		if (index === 0) {
			this._quillContent0 = this.quillForm0?.controls.quillCtrl0?.value;
			this._quillContentFlag0 = this.quillForm0?.controls.flagCtrl?.value;
			this.quillForm0.markAsPristine();
		}
		if (index === 1) {
			this._quillContent1 = this.quillForm1?.controls.quillCtrl1?.value;
			this._quillContentFlag1 = this.quillForm1?.controls.flagCtrl?.value;
			this.quillForm1.markAsPristine();
		}
		if (index === 2) {
			this._quillContent2 = this.quillForm2?.controls.quillCtrl2?.value;
			this._quillContentFlag2 = this.quillForm2?.controls.flagCtrl?.value;
			this.quillForm2.markAsPristine();
		}
		if (index === 3) {
			this._quillContent3 = this.quillForm3?.controls.quillCtrl3?.value;
			this._quillContentFlag3 = this.quillForm3?.controls.flagCtrl?.value;
			this.quillForm3.markAsPristine();
		}
		if (index === 4) {
			this._quillContent4 = this.quillForm4?.controls.quillCtrl4?.value;
			this._quillContentFlag4 = this.quillForm4?.controls.flagCtrl?.value;
			this.quillForm4.markAsPristine();
		}
		if (index === 5) {
			this._quillContent5 = this.quillForm5?.controls.quillCtrl5?.value;
			this._quillContentFlag5 = this.quillForm5?.controls.flagCtrl?.value;
			this.quillForm5.markAsPristine();
		}
	}
	/** *Send Test Mail */
	sendTestMail() {
		let index = 0;
		let message = '';
		let customBrandingFlag = this.isCustomBrandingChecked;
		if (this.panelOpenState0) {
			index = 0;
			message = this.quillForm0.get('quillCtrl0')?.value || '';
		}
		if (this.panelOpenState1) {
			index = 1;
			message = this.quillForm1.get('quillCtrl1')?.value || '';
		}
		if (this.panelOpenState2) {
			index = 2;
			message = this.quillForm2.get('quillCtrl2')?.value || '';
		}
		if (this.panelOpenState3) {
			index = 3;
			message = this.quillForm3.get('quillCtrl3')?.value || '';
		}
		if (this.panelOpenState4) {
			index = 4;
			message = this.quillForm4.get('quillCtrl4')?.value || '';
		}
		if (this.panelOpenState5) {
			index = 5;
			message = this.quillForm5.get('quillCtrl5')?.value || '';
		}
		this._customBrandingService
			.sendTestEmail(index, message, customBrandingFlag)
			.subscribe((res) => {
				let sessionJWT: any;
				if (this.isBrowser)
					sessionJWT = JSON.parse(localStorage.getItem('user') || '{}');
				const Email = sessionJWT['email'];
				this._notificationService.openNotification(
					$localize`:@@email_testEmail_notification: Mail Sent on registered email id ${Email}`,
					'',
					'success'
				);
			});
	}
}
