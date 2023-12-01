import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
	UntypedFormBuilder,
	UntypedFormControl,
	UntypedFormGroup,
	Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FundraiserService } from 'src/app/pages/fundraiser/services/fundraiser.service';
import { MediaService } from 'src/app/pages/fundraiser/services/media.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { forkJoin } from 'rxjs';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { isPlatformBrowser } from '@angular/common';
type LOCALE = 'nl' | 'en' | 'es' | 'de' | 'fr';

@Component({
	selector: 'app-edit-about-description',
	templateUrl: './edit-about-description.component.html',
})
export class EditAboutDescriptionComponent implements OnInit {
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
	newAbout: any = { title: '', content: '', imageListOperation: [] };
	titleFormGroup!: UntypedFormGroup;
	quillContentCtrl: UntypedFormControl = new UntypedFormControl();
	mediaList: any;
	mediaResetControl: UntypedFormControl = new UntypedFormControl(false);
	getTitle: any;
	allTextCheck: boolean = false;
	isBrowser: boolean = false;
	constructor(
		private _formBuilder: UntypedFormBuilder,
		public _mediaService: MediaService,
		public _fundraiserService: FundraiserService,
		public notificationService: NotificationService,
		public accountService: AccountService,
		@Inject(MAT_DIALOG_DATA)
		public data: { currentFundraiser: any; currentFundraiserImage: any },
		public dialogRef: MatDialogRef<EditAboutDescriptionComponent>,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	ngOnInit(): void {
		console.log('DES1', this.data.currentFundraiser);
		console.log('DES2', this.data.currentFundraiserImage);
		this.originalLocale = this.data?.currentFundraiserImage?.language_code;
		this.titleFormGroup = this._formBuilder.group({
			translationTitle: new UntypedFormControl(
				this.data?.currentFundraiserImage?.title,
				[
					Validators.minLength(15),
					Validators.maxLength(70),
					Validators.pattern(/^(?:(?!\p{Emoji}).|\d)*$/u),
				]
			),
		});
		this.mediaList = this._mediaService.getMediaList(
			this.data?.currentFundraiserImage?.image_list
		);
	}
	onTitleChange(event: any) {
		// this.newAbout['title'] = event;
		this.newAbout['content'] = this.data?.currentFundraiser?.content;
		this.newAbout['description'] = this.data?.currentFundraiser?.description;
	}
	changeAboutContent(event: any) {
		this.newAbout['content'] = event;
	}
	changeAboutMedia(event: any) {
		console.log('changeUpdateMedia', event);
		this.newAbout['imageList'] = event;
	}
	deleteAboutMedia(event: any) {
		// console.log('deleteAboutMedia', event);
		this.newAbout?.imageListOperation?.push({ delete: event });
		// this.newAbout['imageList'] = event;
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
			this.data?.currentFundraiserImage?.image_list
		);
		this.quillContentCtrl.setValue(this.data?.currentFundraiser?.content);
		this.newAbout = { content: '', imageListOperation: [] };
	}

	saveAboutContentAndMedia() {
		if (this.accountService.checkHeaders()) {
			this.isSave = true;
			let observableSourceList: any[] = [];
			if (this.newAbout?.imageList !== undefined) {
				let mediaBody = this.getMediaBodyObject();
				observableSourceList.push(this._mediaService.saveAboutMedia(mediaBody));
			}

			if (this.newAbout?.content) {
				let contentBody = this.getContentBodyObject();
				observableSourceList.push(
					this._fundraiserService.updateFundraiserDescription(contentBody)
				);
			}
			forkJoin(observableSourceList).subscribe(
				(results) => {
					this.isSave = false;
					this.dialogRef.close(true);
					this.notificationService.openNotification(
						$localize`:@@fundraiser_description_edit_notification:Fundraiser Description is updated`,
						'',
						'success'
					);
					if (this.isBrowser) window.location.reload();
				},
				(err: any) => {
					this.notificationService.openNotification(
						$localize`:@@edit_about_errorUpdatingFundraiser_notification:There was an error updating Fundraiser About`,
						'close',
						'error'
					);
					this.isSave = false;
				}
			);
		}
	}

	getMediaBodyObject() {
		let mediaBody = new FormData();
		mediaBody.append('slug', this.data?.currentFundraiserImage?.slug);
		mediaBody.append('text', 'carousel');

		this.newAbout?.imageList.forEach((file: any, index: number) => {
			if (file.image) {
				mediaBody.append(
					'image' + index,
					this.newAbout?.imageList[index]?.image
				);
			}
			if (file.videoUrl) {
				mediaBody.append(
					'video_url' + index,
					this.newAbout?.imageList[index]?.videoUrl
				);
			}
		});
		return mediaBody;
	}

	getContentBodyObject() {
		return {
			slug: this.data?.currentFundraiserImage?.slug,
			// title: this.titleFormGroup.get('translationTitle')?.value,
			content: this.newAbout?.content || '',
			appeal: '',
			description: this.escapeHtml(this.newAbout?.content),
			language_code: this.data?.currentFundraiserImage?.language_code,
		};
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
