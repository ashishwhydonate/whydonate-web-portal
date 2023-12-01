/**This component comes into action when registered user wants to create and add details in the about section of the fundraiser */

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Tools } from 'src/utilities/tools';
import { FundraiserService } from '../../../../services/fundraiser.service';
import { MediaService } from '../../../../services/media.service';

@Component({
	selector: 'app-create-about',
	templateUrl: './create-about.component.html',
})
export class CreateAboutComponent implements OnInit {
	isSave = false;
	newAbout: any = { content: '', imageListOperation: [] };
	mediaList: any;
	// maxLengthCheck: any;
	allTextCheck: boolean = false;

	constructor(
		public _mediaService: MediaService,
		public _fundraiserService: FundraiserService,
		public notificationService: NotificationService,
		public _accountService: AccountService,
		@Inject(MAT_DIALOG_DATA) public data: { currentFundraiser: any },
		public dialogRef: MatDialogRef<CreateAboutComponent>
	) {}

	ngOnInit(): void {
		// console.log('EditAboutComponent', this.data?.currentFundraiser);
		this.mediaList = this._mediaService.getMediaList(
			this.data?.currentFundraiser?.image_list
		);
		// console.log('mediaList', this.mediaList);
	}

	changeAboutContent(event: any) {
		// console.log('Update content is changed', event);
		this.newAbout['content'] = event;
	}
	addAboutMedia(event: any) {
		console.log('addAboutMedia', event);
		// this.newAbout['imageList'] = event;
		this.newAbout?.imageListOperation?.push({ add: event });
	}
	// checkBoolean(event: boolean) {
	// 	// console.log('Event in Check', event);
	// 	this.maxLengthCheck = event;
	// }
	allCheck(event: boolean) {
		this.allTextCheck = event;
		// console.log("YAYYY", event)
	}

	saveAboutContentAndMedia() {
		this.isSave = true;
		let observableSourceList: any[] = [];

		if (this.newAbout?.imageListOperation?.length) {
			// console.log('imageListOperation length true');

			let mediaObservableSourceList = this.getMediaSourceList();
			observableSourceList = observableSourceList.concat(
				mediaObservableSourceList
			);
			// console.log('mediaObservableSourceList', mediaObservableSourceList);
		}
		if (this.newAbout?.content) {
			let contentBody = this.getContentBodyObject();
			let contentTranslationBody = this.getContentTranslationBodyObject();
			observableSourceList.push(
				this._fundraiserService.updateFundraiserInformation(contentBody)
			);
			observableSourceList.push(
				this._fundraiserService.saveUpdatesTranslation(contentTranslationBody)
			);
		}

		if (!Object.keys(this.data?.currentFundraiser?.translations)?.length) {
			this._fundraiserService
				.createFundraiserInformationTranslation(
					this.getInitTranslationBodyObject()
				)
				.subscribe((res) => {
					forkJoin(observableSourceList).subscribe(
						(results) => {
							this.isSave = false;
							this.dialogRef.close(true);
						},
						(err: any) => {
							this.notificationService.openNotification(
								$localize`:@@create_about_errorAdding_notification:There was an error Adding Fundraiser About`,
								'close',
								'error'
							);
							this.isSave = false;
						}
					);
				});
		} else {
			forkJoin(observableSourceList).subscribe(
				(results) => {
					// console.log('results', results);
					this.isSave = false;
					this.dialogRef.close(true);
				},
				(err: any) => {
					this.notificationService.openNotification(
						$localize`:@@create_about_errorAdding_notification:There was an error Adding Fundraiser About`,
						'close',
						'error'
					);
					this.isSave = false;
				}
			);
		}
		// console.log('observableSourceList', observableSourceList);
	}
	getMediaSourceList() {
		let observableSourceList: any = [];
		this.newAbout?.imageListOperation.forEach(
			(operation: any, index: number) => {
				let mediaBody = new FormData();
				if (operation?.add) {
					mediaBody = this.getAddMediaBodyObject(operation?.add);
					observableSourceList.push(
						this._mediaService.saveAboutMedia(mediaBody)
					);
					// console.log('operation?.add true', operation?.add);
					// console.log('getDeleteMediaBodyObject', mediaBody);
					// console.log('observableSourceList', observableSourceList);
				}
			}
		);
		return observableSourceList;
	}
	getAddMediaBodyObject(media: any) {
		let mediaBody = new FormData();
		mediaBody.append(
			'fundraising_local',
			this.data?.currentFundraiser?.id.toString()
		);
		mediaBody.append('text', 'carousel');
		mediaBody.append('delete', 'false');
		mediaBody.append('id', 'null');
		if (media?.image) {
			mediaBody.append('image', media.image);
		}
		if (media?.videoUrl) {
			mediaBody.append('video_url', media.videoUrl);
		}
		return mediaBody;
	}

	getContentBodyObject() {
		return {
			id: this.data?.currentFundraiser?.id,
			content: this.newAbout?.content,
			description: this.escapeHtml(this.newAbout?.content),
			language_code: this.data?.currentFundraiser?.language_code,
		};
	}
	getInitTranslationBodyObject() {
		return {
			fundraising_local_id: this.data?.currentFundraiser?.id,
			title: this.data?.currentFundraiser?.title,
			is_auto: true,
			content: ' ',
			description: ' ',
			language_code: this._accountService.getLocaleId(),
			created_at: new Date().getTime(),
			updated_at: new Date().getTime(),
			currency_code: 'eur',
		};
	}
	getContentTranslationBodyObject() {
		return {
			fundraising_local_id: this.data?.currentFundraiser?.id,
			title: this.data?.currentFundraiser?.title,
			description: this.escapeHtml(this.newAbout?.content),
			content: this.newAbout?.content,
			updated_at: new Date().getTime(),
			is_auto: true,
			language_code: this.data?.currentFundraiser?.language_code,
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
