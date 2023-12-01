import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FundraiserService } from '../../../../services/fundraiser.service';
import { MediaService } from '../../../../services/media.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { forkJoin } from 'rxjs';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { platform } from 'os';
import { isPlatformBrowser } from '@angular/common';
type LOCALE = 'nl' | 'en' | 'es' | 'de' | 'fr';

@Component({
	selector: 'app-edit-update',
	templateUrl: './edit-update.component.html',
})
export class EditUpdateComponent implements OnInit {
	newUpdate: any = {};
	isLoading: boolean = false;
	allTextCheck: boolean = false;
	originalLocale: LOCALE = 'nl';
	languageIconPath: string =
		'https://res.cloudinary.com/whydonate/image/upload/v1689152641/whydonate-production/platform/svg-icons/';
	allLanguages = {
		nl: 'Nederlands',
		en: 'English',
		es: 'Español',
		de: 'Deutsch',
		fr: 'Français',
	};
	isBrowser: boolean = false;
	constructor(
		private _fundraiserService: FundraiserService,
		public _mediaService: MediaService,
		private notificationService: NotificationService,
		private accountService: AccountService,
		@Inject(MAT_DIALOG_DATA)
		public data: {
			update: any;
			fundraiserLocalId: number;
			slug: string;
			currentFundraiser: any;
		},
		public dialogRef: MatDialogRef<EditUpdateComponent>,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}
	ngOnInit(): void {
		this.originalLocale = this.data?.update?.userLocale;
	}

	changeUpdateContent(event: any) {
		this.newUpdate['content'] = event;
	}

	changeUpdateMedia(event: any) {
		this.newUpdate['imageList'] = event;
	}

	allCheck(event: boolean) {
		this.allTextCheck = event;
		// console.log("YAYYY", event)
	}

	async saveUpdateContentAndMedia() {
		if (this.accountService.checkHeaders()) {
			this.isLoading = true;
			let observableSourceList = [];
			if (this.newUpdate?.imageList !== undefined) {
				let mediaBody = this.getMediaBodyObject();
				observableSourceList.push(
					this._mediaService.saveUpdateMedia(mediaBody)
				);
			}
			if (this.newUpdate?.content) {
				let contentBody = this.getContentBodyObject();
				observableSourceList.push(
					this._fundraiserService.saveEditedUpdates(contentBody)
				);
			}
			forkJoin(observableSourceList).subscribe(
				(results) => {
					this.isLoading = false;
					this.notificationService.openNotification(
						$localize`:@@fundraiser_update_edit_notification:Fundraiser Update is updated`,
						'',
						'success'
					);
					if (this.isBrowser) window.location.reload();
				},
				(err: any) => {
					this.notificationService.openNotification(
						$localize`:@@edit_update_errorUpdating_notification:There was an error updating Fundraiser Update`,
						'close',
						'error'
					);
					this.isLoading = false;
				}
			);
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
			language: this.data?.update?.userLocale,
			id: this.data?.update?.id,
			slug: this.data?.slug,
		};
	}
	onCloseClick() {
		this.dialogRef.close();
	}
}
