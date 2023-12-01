import {
	Component,
	EventEmitter,
	Output,
	Inject,
	Renderer2,
	PLATFORM_ID,
} from '@angular/core';
import {
	MatDialogRef,
	MAT_DIALOG_DATA,
	MatDialog,
} from '@angular/material/dialog';
import { AddVideoBackgroundDialogComponent } from '../add-video-background-dialog/add-video-background-dialog.component';
import { AddBackgroundDialogComponent } from '../add-background-dialog/add-background-dialog.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { base64ToFile } from 'ngx-image-cropper';
import { isPlatformBrowser } from '@angular/common';
// Subscribe to viewport changes and detect mobile view

@Component({
	selector: 'app-upload-image-video-pop-up',
	templateUrl: './upload-image-video-pop-up.component.html',
	styleUrls: ['./upload-image-video-pop-up.component.scss'],
})
export class UploadImageVideoPopUpComponent {
	@Output() valueSelected = new EventEmitter<any>();
	imagePath: any;
	videoPath: any;
	isMobileView: boolean = false;
	isBrowser: boolean = false;

	constructor(
		public dialogRef: MatDialogRef<UploadImageVideoPopUpComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialog: MatDialog,
		private breakpointObserver: BreakpointObserver,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		// console.log(data.videoPath, data.imagePath); // Access the passed value here
		this.videoPath = data.videoPath;
		this.imagePath = data.imagePath;
	}
	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
			.subscribe((result) => {
				this.isMobileView = result.matches;
			});
	}

	openImageCropperDialog() {
		console.log('Initial');
		let fileInput: any;
		if (this.isBrowser)
			fileInput = document.getElementById(
				'change_upload_image_input'
			) as HTMLInputElement;

		// Add event listener to handle file selection
		fileInput.addEventListener('change', (event: any) => {
			const inputElement = event.target as HTMLInputElement;
			if (inputElement.files && inputElement.files.length > 0) {
				const selectedFile = inputElement.files[0];
				const selectedFilePath = URL.createObjectURL(selectedFile);

				const dialogRef = this.dialog.open(AddBackgroundDialogComponent, {
					data: {
						imagePath: selectedFilePath,
						autoFocus: false,
					},
					disableClose: true, // Disable closing the dialog by clicking outside or pressing the escape key
				});

				dialogRef.componentInstance.fileUploaded = false; // Set the initial fileUploaded flag to false

				dialogRef.componentInstance.dialogRef.beforeClosed().subscribe(() => {
					dialogRef.componentInstance.fileUploaded = true; // Set the fileUploaded flag to true to show the dialog content
					dialogRef.componentInstance.dialogRef.updateSize('auto', 'auto'); // Update the dialog size to fit the content
				});

				dialogRef.componentInstance.valueSelected.subscribe(
					(selectedValue: any) => {
						if (selectedValue) {
							this.imagePath = selectedValue;
							this.valueSelected.emit(selectedValue); // Emit the value to the main component
							this.dialogRef.close();
						}
					}
				);
				// dialogRef.afterClosed().subscribe((update: any) => {
				//   console.log("update",update)
				//   // if (update) {
				//   //   this.imagePath = update;
				//   //   this.valueSelected.emit(update); // Emit the value to the main component
				//   //   this.dialogRef.close();
				//   // }
				// });
			}
		});

		// Trigger the file input dialog
		fileInput.click();
	}

	openVideoDialog() {
		const dialogRef = this.dialog.open(AddVideoBackgroundDialogComponent, {
			data: {
				videoPath: this.videoPath,
				autoFocus: false,
			},
			width: '500px',
		});

		dialogRef.afterClosed().subscribe((update: any) => {
			if (update) {
				this.videoPath = update; // Update the video path
				this.valueSelected.emit(update); // Emit the value to the main component
				this.dialogRef.close();
			}
		});
	}
}
