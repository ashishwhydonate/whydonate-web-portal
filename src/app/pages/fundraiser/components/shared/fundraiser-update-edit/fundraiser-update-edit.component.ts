/**This component is visible on the Updates section of the registered user fundraiser page */

import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { FundraiserService } from '../../../services/fundraiser.service';
import { MediaService } from '../../../services/media.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TranslateUpdatesComponent } from '../../dialogs/updates/translate-updates/translate-updates.component';
import { EditUpdateComponent } from '../../dialogs/updates/edit-update/edit-update.component';
import { CreateUpdateComponent } from '../../dialogs/updates/create-update/create-update.component';
import { AccountService } from 'src/app/pages/account/services/account.service';

@Component({
	selector: 'app-fundraiser-update-edit',
	templateUrl: './fundraiser-update-edit.component.html',
})
export class FundraiserUpdateEditComponent implements OnInit, OnChanges {
	updatesList: any;
	@Input() fundraiserUpdates!: any;
	@Input() slug!: string;
	@Input() currentFundraiser!: any;
	@Input() fundraiserLocalId!: number;
	@Input() count: any;
	@Input() totalPages: any;

	page: number = 1;
	loading: boolean = false;

	constructor(
		private notificationService: NotificationService,
		private _mediaService: MediaService,
		private _fundraiserService: FundraiserService,
		public accountService: AccountService,
		private _domSanitizer: DomSanitizer,
		public dialog: MatDialog,
		public _accountService: AccountService
	) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (this.fundraiserUpdates) {
			let locale = this.accountService.getLocaleId();
			this.updatesList = this._fundraiserService.getUpdatesEditObj(
				this.fundraiserUpdates,
				locale
			);
			console.log('FundraiserUpdateEditComponent', this.updatesList);
		}
	}

	ngOnInit(): void {
		console.log(
			'this.currentFundraiserupdates',
			this.currentFundraiser,
			this.fundraiserUpdates
		);
	}

	santizeURL(url: any) {
		return this._domSanitizer.bypassSecurityTrustResourceUrl(url);
	}

	getVideoEmbeddedHTML(url: any) {
		return this._mediaService.createVideoEmbeddedHTML(url);
	}

	viewMore() {
		this.loading = true;
		this._fundraiserService
			.getUpdates(this.slug, this._accountService.getLocaleId(), this.page + 1)
			.subscribe((updatesData: any) => {
				const newUpdates = this._fundraiserService.getUpdatesViewObj(
					updatesData['data'],
					this._accountService.getLocaleId()
				);

				// Append the newUpdates to the existing updatesList
				this.updatesList = this.updatesList.concat(newUpdates);

				// Increment the page number for the next load
				this.page += 1;
				this.loading = false;
			});
	}

	editUpdate(index: number) {
		const dialogRef = this.dialog.open(EditUpdateComponent, {
			maxHeight: '98vh',
			data: {
				update: this.updatesList[index],
				fundraiserLocalId: this.fundraiserLocalId,
				slug: this.slug,
			},
		});
	}

	translateUpdate(index: number) {
		console.log('SLUGGGGGGGGGG', this.currentFundraiser.slug);
		console.log('UPPPPPP', index);
		console.log('LAAAAAA', this.updatesList[0]);

		const dialogRef = this.dialog.open(TranslateUpdatesComponent, {
			maxHeight: '98vh',
			data: {
				update: this.updatesList[index],
				slug: this.currentFundraiser?.slug,
				locale: this.currentFundraiser?.language_code,
			},
		});

		// dialogRef.afterClosed().subscribe((newContent) => {
		// 	if (newContent) {
		// 		// Below code will start loader
		// 		this.updatesList = undefined;
		// 		// Get updates of fundraising
		// 		this._fundraiserService
		// 			.getUpdates(this.slug)
		// 			.subscribe((updatesData: any) => {
		// 				let locale = this.accountService.getLocaleId();
		// 				// || this.currentFundraiser?.language_code;
		// 				this.updatesList = this._fundraiserService.getUpdatesEditObj(
		// 					updatesData['data'],
		// 					locale
		// 				);
		// 			});
		// 		this.notificationService.openNotification(
		// 			$localize`:@@fundraiser_update_edit_updateRequired_notification:Fundraiser Update is translated`,
		// 			'',
		// 			'success'
		// 		);
		// 	}
		// });
	}
	createUpdate() {
		const dialogRef = this.dialog.open(CreateUpdateComponent, {
			maxHeight: '98vh',
			data: {
				update: {
					id: null,
					date: null,
					content: ' ',
					mediaList: [],
				},
				fundraiserLocalId: this.fundraiserLocalId,
				slug: this.slug,
				originalLocale: this.currentFundraiser?.language_code,
			},
		});

		dialogRef.afterClosed().subscribe((isUpdateCreated) => {
			if (isUpdateCreated) {
				// Below code will start loader
				this.updatesList = undefined;
				// Get updates of fundraising
				let locale = this.accountService.getLocaleId();
				this._fundraiserService
					.getUpdates(this.slug, locale, 1)
					.subscribe((updatesData: any) => {
						this.updatesList = this._fundraiserService.getUpdatesEditObj(
							updatesData['data'],
							locale
						);
					});
			}
		});
	}

	deleteUpdate(index: number) {
		let update = this.updatesList[index];
		this._fundraiserService.deleteUpdates(update.id).subscribe(
			(res: any) => {
				this.updatesList.splice(index, 1);
				this.notificationService.openNotification(
					$localize`:@@fundraiser_update_edit_fundraiserUpdateDeleted_notification:Fundraiser Update is deleted`,
					'',
					'success'
				);
			},
			(err: any) => {
				this.notificationService.openNotification(
					$localize`:@@fundraiser_update_edit_error_notification:There was an error while deleting Fundraiser Update`,
					'close',
					'error'
				);
				// this.isLoading = false;
			}
		);
	}
}
