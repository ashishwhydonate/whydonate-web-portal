import { Component, OnInit } from '@angular/core';
import { Sanitizer } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Tools } from 'src/utilities/tools';
import { AccountService } from '../../../services/account.service';
@Component({
	selector: 'app-registration-complete',
	templateUrl: './registration-complete.component.html',
	styleUrls: ['./registration-complete.component.scss'],
})
export class RegistrationCompleteComponent implements OnInit {
	isLoading: boolean = false;
	userEmail: string = '';
	constructor(
		public accountService: AccountService,
		public router: Router,
		public activatedRoute: ActivatedRoute,
		public notificationService: NotificationService
	) {}

	ngOnInit(): void {
		this.userEmail = this.activatedRoute.snapshot.paramMap.get('email') || '';
	}

	resendVerificationEmail() {
		this.isLoading = true;
		this.accountService
			.resendVerificationEmail(this.userEmail)
			.subscribe((response: any) => {
				setTimeout(() => {
					this.isLoading = false;
					this.notificationService.openNotification(
						'Verification email sent successfully.',
						'OK',
						'success'
					);
				}, 2000);
			});
	}
}
