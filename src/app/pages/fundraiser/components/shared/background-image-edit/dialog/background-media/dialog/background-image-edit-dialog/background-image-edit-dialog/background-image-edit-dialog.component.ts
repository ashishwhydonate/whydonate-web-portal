import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FundraiserService } from 'src/app/pages/fundraiser/services/fundraiser.service';
import { MediaService } from 'src/app/pages/fundraiser/services/media.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
	selector: 'app-background-image-edit-dialog',
	templateUrl: './background-image-edit-dialog.component.html',
	styleUrls: ['./background-image-edit-dialog.component.scss'],
})
export class BackgroundImageEditDialogComponent implements OnInit {
	imageChangedEvent: any = '';
	croppedImage: any = '';
	isEdit: boolean = false;
	isCropperReady: boolean = false;
	fileName!: string;
	isLoading: boolean = false;
	isBrowser: boolean = false;

	constructor(
		public _fundraiserService: FundraiserService,
		public notificationService: NotificationService,
		public mediaService: MediaService,
		@Inject(MAT_DIALOG_DATA)
		public data: {
			imagePath: any;
			backgroundImageId: any;
			fundraiserId: any;
			slug: any;
		},
		public dialogRef: MatDialogRef<BackgroundImageEditDialogComponent>,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}
	ngOnInit(): void {}
	fileChangeEvent(event: Event): void {
		this.imageChangedEvent = event;
		this.isEdit = true;
		this.fileName =
			(event?.target as HTMLInputElement).files?.item(0)?.name || '';
	}

	imageCropped(event: ImageCroppedEvent) {
		this.isEdit = true;
		this.croppedImage = event.base64;
	}
	cropperReady() {
		// cropper ready
		this.isCropperReady = true;
	}
	loadImageFailed() {}

	openFile(fileEvent: any) {
		fileEvent.click();
	}

	dialogClose() {
		this.isLoading = true;
		try {
			// this.imagePath = update;
			console.log('image after close', this.croppedImage);
			let backgroundPayload = {
				image: this.mediaService.base64toBlob(this.croppedImage),
				// id: this.data.backgroundImageId,
				slug: this.data?.slug,
			};
			let backgroundVideoPayload = {
				video: '',
				slug: this.data?.slug,
			};
			//Update Background----------------------------------------------------------
			this._fundraiserService
				.updateFundraiserBackground(backgroundPayload)
				.subscribe(
					(res) => {
						this._fundraiserService
							.addVideoBackground(backgroundVideoPayload)
							.then((res) => {
								this.isLoading = false;
								console.log('Background Updated', res);
								this.notificationService.openNotification(
									$localize`:@@background_image_fundraiserBackground_notification:Fundraiser background image is saved`,
									'',
									'success'
								);

								if (this.isBrowser) window.location.reload();
							});

						// this.dialogRef.close(this.croppedImage);
					},
					(err: any) => {
						this.notificationService.openNotification(
							$localize`:@@edit_created_errorUpdatingBackground_notification:There was an error updating background`,
							'close',
							'error'
						);
						this.isLoading = false;
					}
				);
		} catch (err: any) {
			this.notificationService.openNotification(
				$localize`:@@edit_created_errorUpdatingBackground_notification:There was an error updating background`,
				'close',
				'error'
			);
			this.isLoading = false;
		}
	}

	onNoClick() {
		this.dialogRef.close();
	}
}
