import { Component, Input, OnInit } from '@angular/core';
import {
	MatDialog,
	MatDialogRef,
	MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { PopupStartFundraiserComponent } from '../popup-start-fundraiser/popup-start-fundraiser.component';

@Component({
	selector: 'app-start-fundraiser-button',
	templateUrl: './start-fundraiser-button.component.html',
	styleUrls: ['./start-fundraiser-button.component.scss'],
})
//** *Start Fundraiser Button Component */
export class StartFundraiserButtonComponent implements OnInit {
	@Input() buttonType = 'flat';
	@Input() themeColor = 'accent';
	dialog: MatDialog;

	constructor(public _dialog: MatDialog) {
		this.dialog = _dialog;
	}

	ngOnInit(): void {}

	//** *Open Share Popup*/
	openPopup(): void {
		const dialogRef = this.dialog.open(PopupStartFundraiserComponent, {
			maxWidth: '100vw',
			maxHeight: '100vh',
			width: '100vw',
			height: 'fit-content',

			autoFocus: false,
		});
	}
}
