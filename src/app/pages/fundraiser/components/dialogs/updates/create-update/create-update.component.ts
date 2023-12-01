/**This component comes into action when registered user wants to create and add updates in the fundraiser */

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FundraiserService } from '../../../../services/fundraiser.service';
import { MediaService } from '../../../../services/media.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { forkJoin } from 'rxjs';
import { AccountService } from 'src/app/pages/account/services/account.service';

type LOCALE = 'nl' | 'en' | 'es' | 'de' | 'fr';
@Component({
	selector: 'app-create-update',
	templateUrl: './create-update.component.html',
})
export class CreateUpdateComponent implements OnInit {
	allLanguages = {
		nl: 'Nederlands',
		en: 'English',
		es: 'Español',
		de: 'Deutsch',
		fr: 'Français',
	};
	originalLocale: LOCALE = 'nl';
	languageIconPath: string =
		'https://res.cloudinary.com/whydonate/image/upload/v1689152641/whydonate-production/platform/svg-icons/';
	newUpdate: any = {};
	isLoading: boolean = false;
	isContentValidFlag: boolean = true;
	allTextCheck: boolean = false;
	constructor(
		private _fundraiserService: FundraiserService,
		public _mediaService: MediaService,
		private notificationService: NotificationService,
		public accountService: AccountService,
		@Inject(MAT_DIALOG_DATA)
		public data: {
			update: any;
			fundraiserLocalId: number;
			slug: string;
			originalLocale: LOCALE;
		},
		public dialogRef: MatDialogRef<CreateUpdateComponent>
	) {}
	ngOnInit(): void {
		this.originalLocale = this.data?.originalLocale;
		console.log('this.datassssssssssssssssss', this.data);
	}

	changeUpdateContent(event: any) {
		// console.log('changeUpdateContent', event);
		this.newUpdate['content'] = event;
		this.isContentValid();
	}

	changeUpdateMedia(event: any) {
		// console.log('changeUpdateMedia', event);
		this.newUpdate['imageList'] = event;
	}
	isContentValid() {
		// console.log('isContentValid', this.newUpdate?.content?.length);
		if (this.newUpdate?.content?.length > 0) {
			this.isContentValidFlag = true;
		} else {
			this.isContentValidFlag = false;
		}
	}
	allCheck(event: boolean) {
		this.allTextCheck = event;
		// console.log("YAYYY", event)
	}

	async createUpdateContentAndMedia() {
		if (this.accountService.checkHeaders()) {
			this.isLoading = true;
			if (this.newUpdate?.content) {
				let contentBody = this.newUpdate?.content;
				this._fundraiserService
					.createUpdates(this.data?.slug, contentBody)
					.subscribe(
						(updateRes: any) => {
							// update the id of a created update
							this.data.update.id = updateRes?.data?.update_id;
							if (this.newUpdate?.imageList !== undefined) {
								let mediaBody = this.getMediaBodyObject();
								this._mediaService.saveAboutMedia(mediaBody).subscribe(
									(res) => {
										this.isLoading = false;
										this.dialogRef.close(true);
									},
									(err: any) => {
										this.notificationService.openNotification(
											$localize`:@@create_update_errorUploading_notification:There was an error uploading media`,
											'close',
											'error'
										);
										this.isLoading = false;
									}
								);
							} else {
								this.isLoading = false;
								this.dialogRef.close(true);
							}
						},
						(err: any) => {
							this.notificationService.openNotification(
								$localize`:@@create_update_errorCreating_notification:There was an error creating Fundraiser Update`,
								'close',
								'error'
							);
							this.isLoading = false;
						}
					);
			}
		}
	}

	getMediaBodyObject() {
		let mediaBody = new FormData();
		this.newUpdate?.imageList.forEach((file: any, index: number) => {
			if (file.image) {
				mediaBody.append(
					'image' + index,
					this.newUpdate?.imageList[index]?.image
				);
			}
			if (file.videoUrl) {
				mediaBody.append(
					'video_url' + index,
					this.newUpdate?.imageList[index]?.videoUrl
				);
			}
		});
		mediaBody.append('text', 'update_' + this.data?.update?.id?.toString());
		mediaBody.append('slug', this.data?.slug);
		return mediaBody;
	}

	getContentBodyObject() {
		return {
			content: this.newUpdate?.content,
			language_code: this.data?.update?.userLocale,
			update_id: this.data?.update?.id,
		};
	}
	onCloseClick() {
		this.dialogRef.close();
	}
}
