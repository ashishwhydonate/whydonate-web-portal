import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import {
	AbstractControl,
	AsyncValidatorFn,
	UntypedFormBuilder,
	UntypedFormControl,
	UntypedFormGroup,
	ValidationErrors,
	Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MediaService } from '../../../services/media.service';
import { timer } from 'rxjs';

@Component({
	selector: 'app-fundraiser-media-edit',
	templateUrl: './fundraiser-media-edit.component.html',
})
//** *Fundraiser Media Edit Component */
export class FundraiserMediaEditComponent implements OnInit, OnChanges {
	@ViewChild('imageAddbtn') imageAddbtnRef!: ElementRef;
	@ViewChild('videoUrlInput') videoUrlInputRef!: ElementRef;
	@ViewChild('Imagefile') imageFileUploaderRef!: ElementRef;
	@Input() fundraiserMediaList: any = [];
	@Input() resetControl: UntypedFormControl = new UntypedFormControl(false);
	@Output() onMediaChange: any = new EventEmitter<string>();
	@Output() onMediaDelete: any = new EventEmitter<string>();
	@Output() onMediaAdd: any = new EventEmitter<string>();
	mediaPreviewObject: any = [];
	mediaFinalObject: any = [];
	mediaLimit: number = 10;
	fileSizeLimit: number = 5242880;
	isVideo: boolean = false;
	videoUrlInputForm!: UntypedFormGroup;
	disableVideoSaveButton: boolean = true;
	constructor(
		public focusMonitor: FocusMonitor,
		public formBuilder: UntypedFormBuilder,
		public notificationService: NotificationService,
		public sanitizer: DomSanitizer,
		public mediaService: MediaService
	) {}

	async ngOnChanges(changes: SimpleChanges): Promise<void> {
		// console.log('FundraiserMediaEditComponent ngOnChanges', changes);
		if (
			this.fundraiserMediaList &&
			this.fundraiserMediaList != undefined &&
			this.fundraiserMediaList?.length > 0
		) {
			this.mediaPreviewObject = [...this.fundraiserMediaList];
			for await (const media of this.mediaPreviewObject) {
				let fileName = this.getFileNameFromUrl(media?.image);
				if (media?.image) {
					let file = this.mediaService.imageUrlToFileAsync(
						media?.image,
						fileName
					);
					this.addImageToMediaObject(await file);
				}
				if (media?.video_url) {
					this.addVideoToMediaObject(media?.video_url);
				}
			}

			this.resetControl.valueChanges.subscribe(async (isRest) => {
				console.log('resetControl', isRest);
				if (isRest) {
					this.mediaPreviewObject = [...this.fundraiserMediaList];
					this.mediaFinalObject = [];
					for await (const media of this.mediaPreviewObject) {
						let fileName = this.getFileNameFromUrl(media?.image);
						if (media?.image) {
							let file = this.mediaService.imageUrlToFileAsync(
								media?.image,
								fileName
							);
							this.addImageToMediaObject(await file);
						}
						if (media?.video_url) {
							this.addVideoToMediaObject(media?.video_url);
						}
					}
				}
			});
		}
	}

	getFileNameFromUrl(url: string) {
		if (url) {
			return url.split('/').filter((x, i) => i == url.split('/').length - 1)[0];
		} else {
			return 'image';
		}
	}

	ngOnInit(): void {
		this.videoUrlInputForm = this.formBuilder.group({
			youtube_link: [
				'',
				Validators.compose([]),
				Validators.composeAsync([this.isYouTubeUrl()]),
			],
		});
	}

	openFileUploader(fileEvent: any) {
		fileEvent.click();
	}
	/*
	 * Function to switch boolean value of video to show video link input field----------------
	 */
	switchIsVideo(videoUrlInputRef: any) {
		this.isVideo = !this.isVideo;
		if (this.isVideo) {
			this.focusVideoUrlInput();
		}
	}
	/*
	 * Function to check if given link is valid youtube url--------------------------------------
	 * @returns
	 */
	isYouTubeUrl(): AsyncValidatorFn {
		return (control: AbstractControl) => {
			const validationPromise: Promise<ValidationErrors | null> = new Promise(
				(resolve, reject) => {
					let url = control.value;
					if (url === '') {
						this.disableVideoSaveButton = true;
						resolve(null);
					}
					var regExp = '^(https?://)?((www.)?youtube.com|youtu.be)/.+$';
					var match = url.match(regExp);
					if (match) {
						this.disableVideoSaveButton = false;
						resolve(null);
					} else {
						this.disableVideoSaveButton = true;
						resolve({ invalid: 'true' });
					}
				}
			);
			return validationPromise;
		};
	}
	closeVideoUrlInput() {
		this.isVideo = false;
	}

	/* Add image file to preview and final media object after checks are passed */
	uploadImageFile(event: Event) {
		let files: FileList | null = (event.target as HTMLInputElement).files;
		if (files?.length) {
			let filesList: FileList = files;
			for (let index = 0; index < filesList.length; index++) {
				if (this.mediaPreviewObject.length >= this.mediaLimit) {
					this.notificationService.openNotification(
						$localize`:@@fundraiser_media_edit_youCantAddMore_notification:You can not add more than 10 media files.`,
						'OK',
						'error'
					);
					break;
				}
				let file = filesList.item(index);
				if (file && file?.size < this.fileSizeLimit) {
					let sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
						URL.createObjectURL(file)
					);
					this.addImagePreview(sanitizedUrl);
					this.addImageToMediaObject(file);
					this.onMediaAdd.emit({ image: file });
				} else {
					this.notificationService.openNotification(
						`File ${file?.name} is greater than 5mb`,
						'OK',
						'error'
					);
				}
			}
			console.log('mediaFinalObject', this.mediaFinalObject);
			this.onMediaChange.emit(this.mediaFinalObject);
		}
		/* reset file uploader so same image can be uploaded again incase it's removed */
		(event.target as HTMLInputElement).value = '';
		/* focus on the upload button after image added */
		this.focusAddImagebutton();
	}
	/* Add Video url to preview and final media objects */
	saveVideoUrl() {
		if (this.videoUrlInputForm.get('youtube_link')?.value) {
			/* Converting shorts to embed from youtube URL */
			console.log(
				'First Video Link',
				this.videoUrlInputForm.get('youtube_link')?.value
			);
			const re = /shorts/gi;
			var str = this.videoUrlInputForm.get('youtube_link')?.value;
			var newstr = str.replace(re, 'embed');
			console.log('Updated Video Link', newstr);
			// console.log('Updated Video Link',this.videoUrlInputForm.get('youtube_link')?.value);
			this.addVideoEmbed(this.videoUrlInputForm.get('youtube_link')?.value);
			this.videoUrlInputForm.get('youtube_link')?.setValue(newstr);
			this.addVideoToMediaObject(
				this.videoUrlInputForm.get('youtube_link')?.value
			);
			this.onMediaAdd.emit({
				videoUrl: this.videoUrlInputForm.get('youtube_link')?.value,
			});
			this.videoUrlInputForm.get('youtube_link')?.setValue('');
			this.onMediaChange.emit(this.mediaFinalObject);
			this.closeVideoUrlInput();
		}
	}

	/* Add image for preview */
	addImagePreview(sanitizedImageUrl: any) {
		this.mediaPreviewObject.push({
			image: sanitizedImageUrl,
		});
	}
	/* Add image to final media object */
	async addImageToMediaObject(imageFile: File) {
		this.mediaFinalObject.push({ image: imageFile });
		console.log('addImageToMediaObject', this.mediaFinalObject);
	}
	addVideoEmbed(videoUrl: string) {
		this.mediaPreviewObject.push({
			video_embed: this.mediaService.createVideoEmbeddedHTML(videoUrl),
		});
	}
	addVideoToMediaObject(videoUrl: string) {
		this.mediaFinalObject.push({ videoUrl: videoUrl });
	}

	/* Remove Media from preview and final media object, and emit the final media object */
	removeMedia(index: number) {
		if (this.mediaPreviewObject[index]?.id) {
			this.onMediaDelete.emit(this.mediaPreviewObject[index]);
		}
		this.mediaPreviewObject.splice(index, 1);
		this.mediaFinalObject.splice(index, 1);
		// console.log('removeMedia index', index, this.mediaFinalObject);
		console.log('removeMedia obj', index, this.mediaFinalObject);
		this.onMediaChange.emit(this.mediaFinalObject);
	}
	/* focus on the upload button after image added */
	focusAddImagebutton() {
		this.imageAddbtnRef?.nativeElement?.focus();
	}
	focusVideoUrlInput() {
		let subscribe = timer(100).subscribe((val) => {
			this.videoUrlInputRef?.nativeElement?.focus();
			subscribe.unsubscribe();
		});
	}
}
