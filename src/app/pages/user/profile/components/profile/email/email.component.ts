import {
	AfterViewInit,
	Component,
	Inject,
	OnInit,
	PLATFORM_ID,
} from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ProfileService } from '../../../services/profile.service';
import { Tools } from 'src/utilities/tools';
import { MatLegacyCheckbox as MatCheckbox } from '@angular/material/legacy-checkbox';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-email',
	templateUrl: './email.component.html',
	styleUrls: ['./email.component.scss'],
})
/** *Email Component */
export class EmailComponent implements OnInit, AfterViewInit {
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	emailForm: UntypedFormGroup;
	isLoading: boolean;
	hideLanguage: boolean = false;
	languageIcon: string =
		'https://res.cloudinary.com/whydonate/image/upload/v1689152641/whydonate-production/platform/svg-icons/' +
		'nl' +
		'.png';
	isSave: boolean;
	acountDetails: any = {};
	currentRoute = 'email';
	language_code: string = '';
	languageCode: string = '';
	locale: string = 'nl';
	isBrowser: boolean = false;

	/**
	 * Constructor
	 */
	constructor(
		private _profileService: ProfileService,
		public notificationService: NotificationService,
		public _media: MediaObserver,
		_formBuilder: UntypedFormBuilder,
		public accountService: AccountService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		this.isLoading = false;
		this.isSave = false;
		this.emailForm = _formBuilder.group({
			new_fundraiser_emails: [],
			transactional_emails: [],
			message_received: [],
			connect_fundraiser_emails: [],
			payout: [],
			recurring_donation_stopped: [],
			fundraiser_idea: [],
			products_update: [],
			unsubscribe_all: [],
		});
		this.getUserProfile();
	}
	ngAfterViewInit(): void {
		this.emailForm.get('unsubscribe_all')?.valueChanges.subscribe((val) => {
			if (this.emailForm.disabled) return;
			if (val === true) {
				let emailObj = {
					new_fundraiser_emails: false,
					transactional_emails: false,
					message_received: false,
					connect_fundraiser_emails: false,
					payout: false,
					recurring_donation_stopped: false,
					fundraiser_idea: false,
					products_update: false,
				};
				this.emailForm.patchValue(emailObj);
			}
			if (val === false) {
				let emailObj = this._profileService.getEmailObj;
				this.emailForm.patchValue(emailObj);
			}
		});

		this.emailForm.valueChanges.subscribe((obj) => {
			let emailObj = {
				new_fundraiser_emails: obj.new_fundraiser_emails,
				transactional_emails: obj.transactional_emails,
				message_received: obj.message_received,
				connect_fundraiser_emails: obj.connect_fundraiser_emails,
				payout: obj.payout,
				recurring_donation_stopped: obj.recurring_donation_stopped,
				fundraiser_idea: obj.fundraiser_idea,
				products_update: obj.products_update,
			};
			// Set unsubscribe_all false if no checked setting found
			this.emailForm.patchValue(
				{ unsubscribe_all: !Object.values(emailObj).find((x) => x === true) },
				{ emitEvent: false }
			);
		});
	}

	/** *----------------------------------------------------------------------------------------------------- */
	/** *@ Lifecycle hooks */
	/** *----------------------------------------------------------------------------------------------------- */

	/**
	 * On init
	 */
	ngOnInit(): void {
		if (this.accountService.checkHeaders()) {
			// Get account deatils
			this.getUserProfile();

			if (!this._profileService.getEmailObj) {
				this.isLoading = true;
				this._profileService
					.getEmail()
					.pipe(takeUntil(this._unsubscribeAll))
					.subscribe((res: any) => {
						let emailObj = {
							new_fundraiser_emails: res?.data?.profile?.new_fundraiser_emails,
							transactional_emails: res?.data?.profile?.transactional_emails,
							message_received: res?.data?.profile?.message_received,
							connect_fundraiser_emails:
								res?.data?.profile?.connect_fundraiser_emails,
							payout: res?.data?.profile.payouts_emails,
							recurring_donation_stopped:
								res?.data?.profile.recurring_donation_stopped,
							fundraiser_idea: res?.data?.profile.fundraiser_idea,
							products_update: res?.data?.profile.products_update,
						};
						this.emailForm.patchValue(emailObj);
						// Set unsubscribe_all false if no checked setting found
						this.emailForm
							.get('unsubscribe_all')
							?.setValue(!Object.values(emailObj).find((x) => x === true));

						this._profileService.setEmailObj = emailObj;
						this.isLoading = false;
					});
			} else {
				let emailObj = this._profileService.getEmailObj;
				this.emailForm.patchValue(emailObj);
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

	/**
	 *  Get user profile
	 */
	getUserProfile() {
		this.hideLanguage = false;
		this._profileService
			.getProfile()
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((res: any) => {
				// Get profile details
				this.acountDetails = res;
				this.language_code = res?.data?.profile?.language_code;
				this.hideLanguage = true;
				this.setLanguage();
			});
	}

	/**
	 * Save email setting
	 */
	onSaveEmailSetting() {
		// Return if the form is invalid
		if (this.emailForm.invalid) {
			return;
		}

		// Disable the form
		this.emailForm.disable({ emitEvent: false });

		// Construct email settings payload

		if (
			this.acountDetails &&
			this.acountDetails.data &&
			this.acountDetails.data.profile
		) {
			const payload = {
				id: this.acountDetails.data.profile?.id,
				new_fundraiser_emails:
					this.emailForm?.controls.new_fundraiser_emails.value,
				message_received: this.emailForm?.controls.message_received.value,
				connect_fundraiser_emails:
					this.emailForm?.controls.connect_fundraiser_emails.value,
				transactional_emails:
					this.emailForm?.controls.transactional_emails.value,
				payout: this.emailForm?.controls.payout.value,
				recurring_donation_stopped:
					this.emailForm?.controls.recurring_donation_stopped.value,
				fundraiser_idea: this.emailForm?.controls.fundraiser_idea.value,
				products_update: this.emailForm?.controls.products_update.value,
				language_code: this.locale,
			};
			this._profileService
				.updateEmailSetting(payload)
				.pipe(takeUntil(this._unsubscribeAll))
				.subscribe(
					(res: any) => {
						this.notificationService.openNotification(
							$localize`:@@email_emailSettings_notification:Email settings updated`,
							'Close',
							'success'
						);

						// Re-enable the form
						this._profileService.setEmailObj = payload;
						this.emailForm.enable({ emitEvent: false });
					},
					(error) => {
						this.notificationService.openNotification(
							$localize`:@@email_unableToUpdating_notification:Unable to updating email settings`,
							'Close',
							'error'
						);

						// Re-enable the form
						this.emailForm.enable();
					}
				);
		}
	}

	changeLanguage(language: string) {
		if (this.isBrowser) Tools.setUserlanguage(language);
		/** *get current route */
		switch (true) {
			case language.includes('nl'):
				this.languageCode = language;
				break;
			case language.includes('en'):
				this.languageCode = language;

				break;
			case language.includes('es'):
				this.languageCode = language;

				break;
			case language.includes('de'):
				this.languageCode = language;

				break;
			case language.includes('fr'):
				this.languageCode = language;

				break;
			default:
				this.languageCode = this.language_code;
		}
		this.setLanguage();
	}

	/** *set current route */
	setLanguage() {
		switch (true) {
			case this.languageCode.includes('nl'):
				this.locale = 'nl';
				break;
			case this.languageCode.includes('es'):
				this.locale = 'es';
				break;
			case this.languageCode.includes('de'):
				this.locale = 'de';
				break;
			case this.languageCode.includes('fr'):
				this.locale = 'fr';
				break;
			case this.languageCode.includes('en'):
				this.locale = 'en';
				break;
			default:
				this.locale = this.language_code;
				break;
		}

		this.languageIcon =
			'https://res.cloudinary.com/whydonate/image/upload/v1689152641/whydonate-production/platform/svg-icons/' +
			this.locale?.substring(0, 2).toLowerCase() +
			'.png';
	}
}
