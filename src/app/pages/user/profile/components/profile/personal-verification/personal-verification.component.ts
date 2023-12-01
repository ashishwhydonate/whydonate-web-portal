import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { BankService } from '../../../services/bank.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-personal-verification',
	templateUrl: './personal-verification.component.html',
	styleUrls: ['./personal-verification.component.scss'],
})
export class PersonalVerificationComponent implements OnInit {
	currentRoute = 'personal-verification';
	verificationStatus: boolean = false;
	pendingStatus: boolean = false;
	disapprovedStatus: boolean = false;
	initialStatus: boolean = false;
	bankObject: any;
	isBrowser: boolean = false;
	//contact status
	pendingContactStatus: boolean = false;
	unverifiedContactStatus: boolean = false;
	verifiedContactStatus: boolean = false;
	initialContactStatus: boolean = false;
	personalVerificationObj: any;
	isLoading: boolean = false;
	addButtonCheck: boolean = false;
	pageLoading: boolean = false;
	businessTypeCheck: boolean = false;
	// compliance status
	initialComplianceStatus: boolean = false;
	pendingComplianceStatus: boolean = false;
	unverifiedComplianceStatus: boolean = false;
	verifiedComplianceStatus: boolean = false;
	//ubo status
	initialUboStatus: boolean = false;
	pendingUboStatus: boolean = false;
	unverifiedUboStatus: boolean = false;
	verifiedUboStatus: boolean = false;
	constructor(
		private _bankService: BankService,
		private accountService: AccountService,
		private notificationService: NotificationService,
		iconRegistry: MatIconRegistry,
		sanitizer: DomSanitizer,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		// SVG Operations
		iconRegistry.addSvgIconSet(
			sanitizer.bypassSecurityTrustResourceUrl(
				'assets/icons/fundraiser-defs.svg'
			)
		);
	}

	ngOnInit(): void {
		this.pageLoading = true;
		this._bankService.getPersonalVerification().subscribe((res: any) => {
			console.log('res', res.data);
			this.pageLoading = false;
			this.bankObject = res.data;
			if (this.bankObject.type == 'business') {
				this.businessTypeCheck = true;
			} else {
				this.businessTypeCheck = false;
			}
			switch (this.bankObject.contact_verification) {
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
			switch (this.bankObject.contact_phonenumber) {
				case 'pending':
					this.pendingContactStatus = true;
					this.verifiedContactStatus = false;
					this.unverifiedContactStatus = false;
					this.initialContactStatus = false;
					break;
				case 'unverified':
					this.pendingContactStatus = false;
					this.verifiedContactStatus = false;
					this.unverifiedContactStatus = true;
					this.initialContactStatus = false;
					break;
				case 'verified':
					this.pendingContactStatus = false;
					this.verifiedContactStatus = true;
					this.unverifiedContactStatus = false;
					this.initialContactStatus = false;
					break;
				default:
					this.pendingContactStatus = false;
					this.verifiedContactStatus = false;
					this.unverifiedContactStatus = false;
					this.initialContactStatus = true;
					break;
			}
			switch (this.bankObject.status) {
				case 'pending':
					this.pendingComplianceStatus = true;
					this.verifiedComplianceStatus = false;
					this.unverifiedComplianceStatus = false;
					this.initialComplianceStatus = false;
					break;
				case 'unverified':
					this.pendingComplianceStatus = false;
					this.verifiedComplianceStatus = false;
					this.unverifiedComplianceStatus = true;
					this.initialComplianceStatus = false;
					break;
				case 'verified':
					this.pendingComplianceStatus = false;
					this.verifiedComplianceStatus = true;
					this.unverifiedComplianceStatus = false;
					this.initialComplianceStatus = false;
					break;
				default:
					this.pendingComplianceStatus = false;
					this.verifiedComplianceStatus = false;
					this.unverifiedComplianceStatus = false;
					this.initialComplianceStatus = true;
					break;
			}
			switch (this.bankObject.ubo_status) {
				case 'pending':
					this.pendingUboStatus = true;
					this.verifiedUboStatus = false;
					this.unverifiedUboStatus = false;
					this.initialUboStatus = false;
					break;
				case 'verified':
					this.pendingUboStatus = false;
					this.verifiedUboStatus = true;
					this.unverifiedUboStatus = false;
					this.initialUboStatus = false;
					break;
				case 'unverified':
					this.pendingUboStatus = false;
					this.verifiedUboStatus = false;
					this.unverifiedUboStatus = true;
					this.initialUboStatus = false;
					break;
				default:
					this.pendingUboStatus = false;
					this.verifiedUboStatus = false;
					this.unverifiedUboStatus = false;
					this.initialUboStatus = true;
					break;
			}
		});
	}

	addPersonalVerification() {
		if (this.accountService.checkHeaders()) {
			this.isLoading = true;
			let obj: any = [{}];
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
}
