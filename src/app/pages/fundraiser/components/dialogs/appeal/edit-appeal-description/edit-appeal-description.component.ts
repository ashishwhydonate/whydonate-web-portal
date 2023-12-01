import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { forkJoin } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { FundraiserService } from '../../../../services/fundraiser.service';
import { MediaService } from '../../../../services/media.service';
import {
	UntypedFormBuilder,
	UntypedFormControl,
	UntypedFormGroup,
} from '@angular/forms';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { isPlatformBrowser } from '@angular/common';

type LOCALE = 'nl' | 'en' | 'es' | 'de' | 'fr';
@Component({
	selector: 'app-edit-appeal-description',
	templateUrl: './edit-appeal-description.component.html',
})
export class EditAppealDescriptionComponent implements OnInit {
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
	isSave = false;
	newAppeal: any = {};
	titleFormGroup!: UntypedFormGroup;
	quillContentCtrl: UntypedFormControl = new UntypedFormControl();
	mediaList: any;
	mediaResetControl: UntypedFormControl = new UntypedFormControl(false);
	isBrowser: boolean = false;
	allTextCheck: boolean = false;
	constructor(
		private _formBuilder: UntypedFormBuilder,
		public _mediaService: MediaService,
		public fundraiserService: FundraiserService,
		public notificationService: NotificationService,
		public accountService: AccountService,
		@Inject(MAT_DIALOG_DATA)
		public data: { currentFundraiser: any; currentFundraiserImage: any },
		public dialogRef: MatDialogRef<EditAppealDescriptionComponent>,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	ngOnInit(): void {
		this.originalLocale = this.data?.currentFundraiserImage?.language_code;
		this.titleFormGroup = this._formBuilder.group({
			translationTitle: [this.data?.currentFundraiserImage?.title],
		});
		this.mediaList = this._mediaService.getMediaList(
			this.data?.currentFundraiserImage?.appeal_image_list
		);
		console.log('EditAppealComponent', this.data?.currentFundraiser);
	}

	changeAboutContent(event: any) {
		console.log('Update content is changed', event);
		this.newAppeal['content'] = event;
	}
	changeUpdateMedia(event: any) {
		console.log('changeUpdateMedia', event);
		this.newAppeal['imageList'] = event;
	}
	allCheck(event: boolean) {
		this.allTextCheck = event;
		// console.log("YAYYY", event)
	}
	discardChanges() {
		// this.titleFormGroup
		// 	.get('translationTitle')
		// 	?.reset(this.data?.currentFundraiser?.title);
		this.mediaResetControl.setValue(true);
		this.mediaList = this._mediaService.getMediaList(
			this.data?.currentFundraiserImage?.appeal_image_list
		);
		this.quillContentCtrl.setValue(this.data?.currentFundraiser?.appeal);
		this.newAppeal = {};
	}

	dialogClose() {
		if (this.accountService.checkHeaders()) {
			try {
				this.isSave = true;
				let observableSourceList = [];
				if (this.newAppeal?.imageList !== undefined) {
					let mediaBody = this.getMediaBodyObject();
					observableSourceList.push(
						this._mediaService.saveAppealMedia(mediaBody)
					);
				}
				if (this.newAppeal?.content) {
					let contentBody = this.getContentBodyObject();
					contentBody['to_update'] = 'title_appeal';
					contentBody['slug'] = this.data?.currentFundraiserImage?.slug;
					observableSourceList.push(
						this.fundraiserService.updateFundraiserAppealDescription(
							contentBody
						)
					);
				}
				forkJoin(observableSourceList).subscribe(
					(results) => {
						this.isSave = false;
						this.notificationService.openNotification(
							$localize`:@@edit_appeal_fundraiserAppeal_notification:Fundraiser Appeal is updated`,
							'',
							'success'
						);
						this.dialogRef.close(true);
						if (this.isBrowser) window.location.reload();
					},
					(err: any) => {
						this.notificationService.openNotification(
							$localize`:@@edit_appeal_errorUpdatingFundraiser_notification:There was an error updating Fundraiser Appeal`,
							'close',
							'error'
						);
						this.isSave = false;
					}
				);
			} catch (err: any) {
				this.notificationService.openNotification(
					$localize`:@@edit_appeal_errorUpdatingFundraiser_notification:There was an error updating Fundraiser Appeal`,
					'close',
					'error'
				);
				this.isSave = false;
			}
		}
	}
	getMediaBodyObject() {
		let mediaBody = new FormData();
		this.newAppeal?.imageList.forEach((file: any, index: number) => {
			if (file.image) {
				mediaBody.append(
					'image' + index,
					this.newAppeal?.imageList[index]?.image
				);
			}
			if (file.videoUrl) {
				mediaBody.append(
					'video_url' + index,
					this.newAppeal?.imageList[index]?.videoUrl
				);
			}
		});
		mediaBody.append('text', 'appeal');
		mediaBody.append('slug', this.data?.currentFundraiserImage?.slug);
		return mediaBody;
	}

	getContentBodyObject() {
		let body: any = {};
		body['title'] = this.titleFormGroup.get('translationTitle')?.value;
		body['appeal'] = this.escapeHtml(this.newAppeal['content']);
		body['description'] = '';
		body['content'] = this.newAppeal['content'];
		body['slug'] = this.data?.currentFundraiserImage?.slug;
		return body;
	}
	escapeHtml(string_with_html: any) {
		/** *.(remove any tags).(remove double space) */
		return string_with_html
			?.replace(/<[^>]*>/g, ' ')
			?.replace(/\s\s+/g, ' ')
			?.trim();
	}
	onCloseClick() {
		this.dialogRef.close();
	}
}
