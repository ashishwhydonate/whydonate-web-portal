import { Component, OnInit, PLATFORM_ID } from '@angular/core';
import {
	MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
	MatLegacyDialogRef as MatDialogRef,
	MatLegacyDialog as MatDialog,
} from '@angular/material/legacy-dialog';
import { ChangeDetectorRef, Inject } from '@angular/core';
import { MatLegacyButton as MatButton } from '@angular/material/legacy-button';
import { UsermessageStopComponent } from '../../usermessage-stop/usermessage-stop.component';
import { any } from 'cypress/types/bluebird';
import { UsermessageCancelComponent } from '../../usermessage-cancel/usermessage-cancel.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-stop-recurring-donation',
	templateUrl: './stop-recurring-donation.component.html',
	styleUrls: ['./stop-recurring-donation.component.scss'],
})
export class StopRecurringDonationComponent implements OnInit {
	toggleOn: boolean = true;
	showLoader: boolean = false;
	isBrowser: boolean = false;
	constructor(
		public dialogRef: MatDialogRef<StopRecurringDonationComponent>,
		public dialog: MatDialog,
		@Inject(MAT_DIALOG_DATA) public data: any,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}
	onCancelClick(): void {
		// this.openCancelDialog()
		if (this.isBrowser) window.location.reload();
		this.dialogRef.close('Cancel');
		console.log('cancel clicked');
	}
	onYesClick(): void {
		this.toggleOn = false;

		this.dialogRef.close('Yes');
		this.openstopDialog();
		this.showLoader = true;
		setTimeout(() => {
			this.showLoader = false;
		}, 3000);
		console.log('yes clicked');
		console.log(this.openstopDialog);
	}

	ngOnInit(): void {}

	openstopDialog() {
		const dialogRef = this.dialog.open(UsermessageStopComponent);
		dialogRef.afterClosed().subscribe((result) => {
			console.log(result);
		});
	}

	openCancelDialog() {
		const dialogRef = this.dialog.open(UsermessageCancelComponent);
		dialogRef.afterClosed().subscribe((result) => {
			console.log(result);
		});
	}
	onCloseClick() {
		this.dialogRef.close();
	}
}
