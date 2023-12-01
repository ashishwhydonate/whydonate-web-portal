import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
	FormControl,
	FormGroup,
	UntypedFormControl,
	UntypedFormGroup,
	Validators,
} from '@angular/forms';
import { APIService } from 'src/app/global/services/api.service';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CustomBrandingService } from '../../../services/custom-branding.service';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/pages/user/profile/services/profile.service';
import { isPlatformBrowser } from '@angular/common';
@Component({
	selector: 'app-receipt',
	templateUrl: './receipt.component.html',
	styleUrls: ['./receipt.component.scss'],
})
export class ReceiptComponent implements OnInit {
	isLoading: boolean = false;
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	newInfo: string = '';
	newInfoHex!: FormControl;
	isBrowser: boolean = false;

	profile: string = '';
	constructor(
		private customBranding: CustomBrandingService,
		public accountService: AccountService,
		public _notificationService: NotificationService,
		private _profileService: ProfileService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		this.newInfoHex = new FormControl('');
	}

	ngOnInit(): void {
		this.getdata();
		this.isLoading = true;
	}
	getdata() {
		if (this.accountService.checkHeaders()) {
			this._profileService
				.getProfile()
				.pipe(takeUntil(this._unsubscribeAll))
				.subscribe((res: any) => {
					if (res?.data?.profile) {
						this.newInfoHex?.patchValue(res?.data?.profile?.receipt_message);
						this.newInfo = res?.data?.profile?.receipt_message;
						this.profile = res?.data?.profile?.receipt_message;
					}
				});
		}
	}
	discardChanges() {
		this.newInfoHex?.patchValue(this?.profile || '');
		this.newInfoHex.markAsPristine();
	}

	saveForm(message: string) {
		let body = { receipt_message: message };

		return this.customBranding.receipt_message(body).subscribe((res) => {
			this._notificationService.openNotification(
				$localize`:@@receipt_messageSuccessfull_notification:The receipt message is successfully saved`,
				'',
				'success'
			);
			if (this.isBrowser) window.location.reload();
		});
	}

	get isButtonDisabled(): boolean {
		const valueLength = this.newInfoHex?.value?.length;
		return !valueLength || valueLength < 0 || valueLength > 120;
	}

	// hasEmojiError(value: string): boolean {
	// 	return /[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(value);
	// }

	onNewInfoChange(hex: string): void {
		this.newInfoHex.patchValue(hex);
	}
	ngOnDestroy(): void {
		/** *Unsubscribe from all subscriptions */
		this._unsubscribeAll.complete();
	}
}
