import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { User } from '@sentry/angular';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
	selector: 'app-verify-email',
	templateUrl: './verify-email.component.html',
	styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
	emailValue: any;
	isBrowser: boolean = false;
	constructor(
		public notificationService: NotificationService,
		public dialogRef: MatDialogRef<VerifyEmailComponent>,
		@Inject(PLATFORM_ID) platformI: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	ngOnInit(): void {
		let user: any = '{}';
		if (this.isBrowser) user = JSON.parse(localStorage.getItem('user') || '{}');
		this.emailValue = user.email;
		console.log('Email Value', this.emailValue);
	}

	close() {
		this.dialogRef.close(true);
		this.notificationService.openNotification(
			`Verify your Email. We have sent an email to ${this.emailValue}. You need to verify your email to receive payouts`,
			'',
			'error'
		);
	}
	onCloseClick() {
		this.dialogRef.close();
	}
}
