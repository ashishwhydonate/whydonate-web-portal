import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnInit,
	Output,
	PLATFORM_ID,
} from '@angular/core';
import {
	MatDialog,
	MatDialogRef,
	MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FundraiserService } from 'src/app/pages/fundraiser/services/fundraiser.service';
import { MediaService } from 'src/app/pages/fundraiser/services/media.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { BackgroundImageEditDialogComponent } from './dialog/background-image-edit-dialog/background-image-edit-dialog/background-image-edit-dialog.component';
import { AddVideoBackgroundDialogComponent } from '../../../../pages/create-fundraiser/add-video-background-dialog/add-video-background-dialog.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-background-media',
	templateUrl: './background-media.component.html',
	styleUrls: ['./background-media.component.scss'],
})
export class BackgroundMediaComponent implements OnInit {
	@Output() valueSelected = new EventEmitter<any>();
	defaultBackgroundImage =
		'https://res.cloudinary.com/whydonate/image/upload/dpr_auto,f_auto,q_auto/whydonate-staging/platform/visuals/fundraiser_default_bg.jpg';
	isMobileView: boolean = false;
	isBrowser: boolean = false;

	constructor(
		public dialogRef: MatDialogRef<BackgroundMediaComponent>,
		public _fundraiserService: FundraiserService,
		public dialog: MatDialog,
		@Inject(MAT_DIALOG_DATA)
		public data: {
			imagePath: any;
			videoPath: any;
			backgroundImageId: any;
			fundraiserId: any;
			slug: any;
		},
		public notificationService: NotificationService,
		public mediaService: MediaService,
		private sanitizer: DomSanitizer,
		private breakpointObserver: BreakpointObserver,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	/**Detault background image when no image is uploaded */
	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
			.subscribe((result) => {
				this.isMobileView = result.matches;
			});
	}

	/**To open image cropping dialog */

	openVideoCropperDialog() {
		const dialogRef = this.dialog.open(AddVideoBackgroundDialogComponent, {
			data: {
				videoPath: this.data.videoPath,
				slug: this.data.slug,
				autoFocus: false,
			},
			width: '500px',
		});

		dialogRef.afterClosed().subscribe((update: any) => {
			if (update) {
				this.data.videoPath = update; // Update the video path
				this.valueSelected.emit(update); // Emit the value to the main component
				this.dialogRef.close();
			}
		});
	}

	openFileUploader() {
		let fileInput: any;
		if (this.isBrowser)
			fileInput = document.getElementById(
				'upload_image_input'
			) as HTMLInputElement;

		if (fileInput) {
			// Add event listener to handle file selection
			fileInput.addEventListener('change', (event: any) => {
				const inputElement = event.target as HTMLInputElement;
				if (inputElement.files && inputElement.files.length > 0) {
					const selectedFile = inputElement.files[0];
					const selectedFilePath = URL.createObjectURL(selectedFile);
					this.dialog.open(BackgroundImageEditDialogComponent, {
						maxHeight: '98vh',
						data: {
							imagePath: selectedFilePath,
							backgroundImageId: this.data.backgroundImageId,
							fundraiserId: this.data.fundraiserId,
							slug: this.data.slug,
							videoPath: this.data.videoPath,
						},
					});
				}
			});

			// Trigger the file input dialog
			fileInput.click();
		}
	}

	///Old
	openImageCropperDialog() {
		this.dialog.open(BackgroundImageEditDialogComponent, {
			maxHeight: '98vh',
			data: {
				imagePath: this.data.imagePath,
				backgroundImageId: this.data.backgroundImageId,
				fundraiserId: this.data.fundraiserId,
				slug: this.data.slug,
				videoPath: this.data.videoPath,
			},
		});
	}
	onCloseClick() {
		this.dialogRef.close();
	}
}
