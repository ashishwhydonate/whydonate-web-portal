import {
	Component,
	Inject,
	OnInit,
	EventEmitter,
	Output,
	Renderer2,
} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { event } from 'cypress/types/jquery';
import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
	selector: 'app-add-background-dialog',
	templateUrl: './add-background-dialog.component.html',
	styleUrls: ['./add-background-dialog.component.scss'],
})
export class AddBackgroundDialogComponent implements OnInit {
	@Output() valueSelected = new EventEmitter<any>();
	imageChangedEvent: any = '';
	croppedImage: any = '';
	fileUploaded = false;
	imagePath: any;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: { imagePath: any },
		public dialogRef: MatDialogRef<AddBackgroundDialogComponent>,
		public notificationService: NotificationService
	) {}

	ngOnInit(): void {
		this.imagePath = this.data?.imagePath;
	}

	fileChangeEvent(event: any): void {
		if (event?.target?.files && event.target.files.length > 0) {
			const file = event.target.files[0];
			const allowedTypes = [
				'image/jpg',
				'image/jpeg',
				'image/png',
				'image/webp',
			];

			if (file.size < 5242880 && allowedTypes.includes(file.type)) {
				this.imageChangedEvent = event;
				this.fileUploaded = true;
			} else {
				this.notificationService.openNotification(
					$localize`:@@add_background_fileError_notification:The file you have selected is not jpg or png. Please choose a different file.`,
					'OK',
					'error'
				);
			}
		}
	}

	imageCropped(event: ImageCroppedEvent) {
		this.croppedImage = event.base64;
	}

	imageLoaded() {
		// Show cropper if needed
	}

	cropperReady() {
		// Cropper ready if needed
	}

	loadImageFailed() {}

	onCancelClick(): void {
		this.dialogRef.close();
	}

	dialogClose() {
		this.valueSelected.emit(this.croppedImage);
		this.dialogRef.close();
	}
}
