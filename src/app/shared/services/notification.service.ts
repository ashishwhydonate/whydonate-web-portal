import { Injectable } from '@angular/core';
import {
	MatLegacySnackBar as MatSnackBar,
	MatLegacySnackBarConfig as MatSnackBarConfig,
	MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition,
	MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition,
} from '@angular/material/legacy-snack-bar';

@Injectable({
	providedIn: 'root',
})
//** *Notification Service */
export class NotificationService {
	snackBarRef: any;
	horizontalPosition: MatSnackBarHorizontalPosition = 'center';
	verticalPosition: MatSnackBarVerticalPosition = 'bottom';

	constructor(private _snackBar: MatSnackBar) {}

	//** *Notification status */

	openNotification(message: string, action: string, style: string) {
		if (style == 'success') {
			this.snackBarRef = this._snackBar.open(message, action, {
				horizontalPosition: this.horizontalPosition,
				verticalPosition: this.verticalPosition,
				duration: 5000,
				panelClass: ['style-success'],
			});
		} else {
			this.snackBarRef = this._snackBar.open(message, action, {
				horizontalPosition: this.horizontalPosition,
				verticalPosition: this.verticalPosition,
				duration: 5000,
				panelClass: ['style-error'],
			});
		}
	}

	openNotificationIndefinite(message: string, action: string, style: string) {
		if (style == 'success') {
			this.snackBarRef = this._snackBar.open(message, action, {
				horizontalPosition: this.horizontalPosition,
				verticalPosition: this.verticalPosition,

				panelClass: ['style-success'],
			});
		} else {
			this.snackBarRef = this._snackBar.open(message, action, {
				horizontalPosition: this.horizontalPosition,
				verticalPosition: this.verticalPosition,

				panelClass: ['style-error'],
			});
		}
	}

	afterNotificationDismiss() {
		return this.snackBarRef.afterDismissed();
	}

	onAction() {
		return this.snackBarRef.onAction();
	}

	dismiss() {
		this.snackBarRef.dismiss();
	}
}
