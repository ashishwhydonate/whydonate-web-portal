import {
	AfterViewInit,
	Component,
	Inject,
	OnInit,
	PLATFORM_ID,
	inject,
} from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ProfileService } from '../../../services/profile.service';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { isPlatformBrowser } from '@angular/common';
@Component({
	selector: 'app-api-key',
	templateUrl: './api-key.component.html',
})
/** *Api Key Component */
export class ApiKeyComponent implements OnInit, AfterViewInit {
	apiKeyForm: UntypedFormGroup;
	isLoading: boolean;
	isNewApiKeyLoading!: boolean;
	apiKey: any;
	showGenerateApiKeyButton!: boolean;
	currentRoute = 'api';
	isBrowser: boolean = false;

	/**
	 * Constructor
	 */
	constructor(
		private _profileService: ProfileService,
		public notificationService: NotificationService,
		public accountService: AccountService,
		public _media: MediaObserver,
		_formBuilder: UntypedFormBuilder,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		this.isLoading = false;
		this.apiKeyForm = _formBuilder.group({
			apikeyCtrl: [{ value: '', disabled: true }],
			isActive: [true],
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
			// Disable loader
			this.isLoading = true;
			this._profileService.getApiKey().subscribe(
				(res: any) => {
					if (res?.data?.response == 'ApiKeyNotAvailable') {
						// Disable loader
						this.isLoading = false;
						this.showGenerateApiKeyButton = true;
						return;
					}
					this.apiKey = res?.data?.data?.api_key;
					this.showGenerateApiKeyButton = false;

					this.apiKeyForm.patchValue(
						{
							apikeyCtrl: res?.data?.data?.api_key,
							isActive: res?.data?.data?.is_active,
						},
						{ emitEvent: false }
					);
					this._profileService.setApiKeyObj = {
						api_key: res?.data?.data?.api_key,
						is_active: res?.data?.data?.is_active,
					};
					// Disable loader
					this.isLoading = false;
				},
				(error) => {
					// Disable loader
					this.isLoading = false;
					this.notificationService.openNotification(
						$localize`:@@api_key_unable_notification:Unable to updating your details`,
						'OK',
						'error'
					);
				}
			);
		}
	}
	/**
	 * After ViewInit
	 */
	ngAfterViewInit(): void {
		if (this.accountService.checkHeaders()) {
			this.apiKeyForm.get('isActive')?.valueChanges.subscribe((status) => {
				let body = { is_active: status };
				this.isLoading = true;
				this._profileService.updateApiKeyStatus(body).subscribe(
					(res: any) => {
						this.isLoading = false;
						if (res?.data?.is_active === true) {
							this.notificationService.openNotification(
								$localize`:@@api_key_activated_notification:Api Key is activated`,
								'',
								'success'
							);
						}
						if (res?.data?.is_active === false) {
							this.notificationService.openNotification(
								$localize`:@@api_key_deactivated_notification:Api Key is deactivated`,
								'',
								'success'
							);
						}
						this.apiKeyForm.patchValue(
							{
								isActive: res?.data?.is_active,
							},
							{ emitEvent: false }
						);
						// this._profileService.setApiKeyObj = {
						// 	api_key: this.apiKey,
						// 	is_active: res?.data?.is_active,
						// };
					},
					(error) => {
						this.notificationService.openNotification(
							$localize`:@@api_key_unableToUpdate_notification:Unable to updating your details`,
							'OK',
							'error'
						);
					}
				);
			});
		}
	}

	/** *----------------------------------------------------------------------------------------------------- */
	/** *@ Public methods */
	/** *----------------------------------------------------------------------------------------------------- */

	/**
	 * Copy api code to clipboard
	 */
	copyApiCode() {
		this.isLoading = false;
		this.notificationService.openNotification(
			$localize`:@@api_key_codeCopied_notification:Code Copied`,
			'OK',
			'success'
		);
	}
	/**
	 * Generate new api key
	 */
	generateNewApiKey() {
		if (this.accountService.checkHeaders()) {
			this.isNewApiKeyLoading = true;
			let profileName = this._profileService?.getProfileObj?.name;
			let body = { name: profileName };
			this._profileService.createApiKey(body).subscribe(
				(res: any) => {
					console.log(res);
					if (this.isBrowser) window.location.reload();
					if (res?.data?.api_key) {
						this.apiKey = res?.data?.api_key;
						this.apiKeyForm.patchValue({
							apikeyCtrl: res?.data.api_key,
						});
						this.isNewApiKeyLoading = false;
						this.showGenerateApiKeyButton = false;
					}
				},
				(error) => {
					this.isNewApiKeyLoading = false;
					this.notificationService.openNotification(
						$localize`:@@api_key_errorWhileGenerating_notification:Error while generating API Key`,
						'',
						'error'
					);
				}
			);
		}
	}
}
