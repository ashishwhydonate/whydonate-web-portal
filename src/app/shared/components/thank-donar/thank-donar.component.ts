import {
	ChangeDetectorRef,
	Component,
	Inject,
	OnInit,
	PLATFORM_ID,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FundraiserService } from 'src/app/pages/fundraiser/services/fundraiser.service';
import { NotificationService } from '../../services/notification.service';
import {
	UntypedFormControl,
	Validators,
	ReactiveFormsModule,
} from '@angular/forms';
import { timer } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-thank-donar',
	templateUrl: './thank-donar.component.html',
	styleUrls: ['./thank-donar.component.scss'],
})
/** *Thank Donar Component */
export class ThankDonarComponent implements OnInit {
	donationItem: any;
	updateButtonCheck: boolean = false;
	replyForm = new UntypedFormControl('', [
		Validators.required,
		Validators.pattern(
			/^[a-zA-Z0-9_,.\s\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FAC0}-\u{1FAFF}\u{1FB00}-\u{1FBFF}\u{1FC00}-\u{1FCFF}\u{1FD00}-\u{1FDFF}\u{1FE00}-\u{1FEFF}\u{1FF00}-\u{1FFFF}\u{2B05}\u{1F004},;:!&"']*$/u
		),
	]);
	replyMessage: any;
	isBrowser: boolean = false;

	constructor(
		private fundRaiserService: FundraiserService,
		public _notificationService: NotificationService,
		private readonly cd: ChangeDetectorRef,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<ThankDonarComponent>,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	ngOnInit(): void {
		console.log('DATA', this.data);
		this.replyMessage = this.data?.count.reply_message;
		console.log('reply message', this.replyMessage);
		if (!this.replyMessage || this.replyMessage.trim() === '') {
			this.replyMessage = $localize`:@@thank_donar_sendMessage_placeholder:Send message to donor`;
			this.updateButtonCheck = true;
			// this.replyMessage=true;
		} else {
			console.log('else');
			this.replyForm.setValue(this.replyMessage);
			// this.replyMessage = ;
			this.updateButtonCheck = false;
			// this.replyMessage=false;
		}
	}

	/** *Post Reply Message */
	postReply(input: any) {
		let obj = {
			donation_order_id: this.data?.count?.id,
			thanks_message: input,
		};
		console.log('obj', obj);
		this.fundRaiserService.updateDonorReply(obj).subscribe((data) => {
			this._notificationService.openNotification(
				$localize`:@@thank_donar_messageSuccessfullt_notification:The message is successfully sent`,
				'',
				'success'
			);

			console.log(data);
		});
		this.dialogRef.close();
		const source$ = timer(2000);
		source$.subscribe((d) => {
			console.log(d);
			if (this.isBrowser) window.location.reload();
		});
	}
	onCloseClick() {
		this.dialogRef.close();
	}
}
