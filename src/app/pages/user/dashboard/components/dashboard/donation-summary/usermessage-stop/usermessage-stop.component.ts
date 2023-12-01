import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
	MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
	MatLegacyDialogRef as MatDialogRef,
	MatLegacyDialog as MatDialog,
} from '@angular/material/legacy-dialog';
@Component({
	selector: 'app-usermessage-stop',
	templateUrl: './usermessage-stop.component.html',
	styleUrls: ['./usermessage-stop.component.scss'],
})
export class UsermessageStopComponent implements OnInit {
	isBrowser: boolean = false;
	constructor(
		public dialog: MatDialog,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}
	ongotitclick(): void {
		if (this.isBrowser)
			setTimeout(() => {
				window.location.reload();
			}, 3000);
	}

	ngOnInit(): void {}
}
