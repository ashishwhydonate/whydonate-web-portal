import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
	AbstractControl,
	AsyncValidatorFn,
	FormBuilder,
	UntypedFormControl,
	UntypedFormGroup,
	ValidationErrors,
	Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FundraiserService } from 'src/app/pages/fundraiser/services/fundraiser.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
	selector: 'app-add-video-background-dialog',
	templateUrl: './add-video-background-dialog.component.html',
	styleUrls: ['./add-video-background-dialog.component.scss'],
})
export class AddVideoBackgroundDialogComponent implements OnInit {
	accountForm: UntypedFormGroup;
	isBrowser: boolean = false;
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: { videoPath: any; slug: string },
		public notificationService: NotificationService,
		private formBuilder: FormBuilder,
		public _fundraiserService: FundraiserService,
		private dialogRef: MatDialogRef<AddVideoBackgroundDialogComponent>,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		this.accountForm = new UntypedFormGroup({
			profileType: new UntypedFormControl('', []),
			VideoName: new UntypedFormControl('', [
				Validators.required,
				Validators.minLength(1),
				Validators.maxLength(100),
				Validators.pattern('^[a-zA-Z ]*$'),
			]),
		});
	}

	ngOnInit() {
		this.accountForm.controls.VideoName.setValue(this.data.videoPath);
		this.accountForm = this.formBuilder.group({
			VideoName: new UntypedFormControl('', {
				validators: [],
				asyncValidators: [this.isValidWebsiteURL()],
			}),
		});
	}

	isValidWebsiteURL(): AsyncValidatorFn {
		return (control: AbstractControl) => {
			const validationPromise: Promise<ValidationErrors | null> = new Promise(
				(resolve, reject) => {
					let url = control.value;
					if (url.length <= 0) {
						resolve(null);
					} else {
						let youtube_pattern =
							/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|watch\?v=|v\/)|youtu\.be\/)([\w\-]+)(?:\S*)?$/;

						const VimeoUrlRegexPattern = /^(https?:\/\/)?(www\.)?vimeo\.com\//;
						const VimeoVideoUrlRegexPattern =
							/^(http\:\/\/|https\:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+)$/;

						var match_yt = url.match(youtube_pattern);
						var match_vm = url.match(VimeoUrlRegexPattern);

						if (match_yt) {
							resolve(null);
						} else if (match_vm) {
							if (VimeoUrlRegexPattern.test(url)) {
								if (VimeoVideoUrlRegexPattern.test(url)) {
									resolve(null);
								} else {
									resolve({ vimeoInvalidId: true });
								}
							}
						} else {
							resolve({ invalid: true });
						}
					}
				}
			);
			console.log('validationPromise', validationPromise);
			return validationPromise;
		};
	}

	onChange(link: string) {}

	onSubmit() {
		const videoNameControl = this.accountForm.get('VideoName');
		const videoName = videoNameControl?.value;
		if (this.accountForm.valid) {
			if (videoNameControl) {
				this.dialogRef.close(videoName);
				if (this.data.slug) {
					let uploadVideoBackgroundPayload = {
						slug: this.data.slug,
						video: videoName || '',
					};
					this._fundraiserService
						.addVideoBackground(uploadVideoBackgroundPayload)
						.then((videoAdded) => {
							this.notificationService.openNotification(
								$localize`:@@background_video_fundraiserBackground_notification:Fundraiser background video is saved`,
								'',
								'success'
							);
							if (this.isBrowser) window.location.reload();
						});
				}
			}
		}
	}
	onCloseClick() {
		this.dialogRef.close();
	}
}
