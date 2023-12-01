import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ConfirmationDialogData } from '../../interfaces/confirmation-dialog-data';

@Component({
	selector: 'app-dialog-confirmation',
	templateUrl: './dialog-confirmation.component.html',
	styleUrls: ['./dialog-confirmation.component.scss'],
})
/** *Dialog Confirmation Component */
export class DialogConfirmationComponent implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<DialogConfirmationComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
	) {}
	
	ngOnInit(): void {}

	onAccepted(): void {
		this.dialogRef.close('accepted');
	}

	onRejected(): void {
		this.dialogRef.close('rejected');
	}
	onCloseClick(){
		this.dialogRef.close();
	}
}
