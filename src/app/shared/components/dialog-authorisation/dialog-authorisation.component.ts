import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
	selector: 'app-dialog-authorisation',
	templateUrl: './dialog-authorisation.component.html',
	styleUrls: ['./dialog-authorisation.component.scss'],
})
/** *Dialog Authorisation Component */
export class DialogAuthorisationComponent implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<DialogAuthorisationComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}
	
	ngOnInit(): void {}

	onSecondaryAction(): void {
		this.dialogRef.close('rejected');
	}
	onPrimaryAction(): void {
		this.dialogRef.close('accepted');
	}
	onCloseClick(){
		this.dialogRef.close();
	}
}
