import { MediaObserver } from '@angular/flex-layout';
import {
	ChangeDetectorRef,
	Component,
	Inject,
	Input,
	OnInit,
} from '@angular/core';
import {
	MatDialog,
	MatDialogRef,
	MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ReplyChangeService } from '../../../services/reply-change.service';
import { UntypedFormControl, Validators } from '@angular/forms';
import { FundraiserService } from '../../../services/fundraiser.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-donor-list-full',
	templateUrl: './donor-list-full.component.html',
	styleUrls: ['./donor-list-full.component.scss'],
})
/** *Donor List Full Component */
export class DonorListFullComponent implements OnInit {
	donorData: any;
	replyButton: boolean = false;
	replyIndex: number = -1;
	replyForm = new UntypedFormControl('', [Validators.required]);
	isLoggedInUserAdmin: boolean = false;
	@Input() currentFundraiserID: string | any;
	donarDataSlice: any;
	count: number = 0;
	dataSize: number = 20;
	loadDataCheck: boolean = false;
	donorPlaceholder = $localize`:@@donor_list_full_sendMessageToDonor_placeholder:Send Message to donor`;
	isDonorListLoading: boolean = true;
	page: number = 1;
	totalPages: number = 1;
	isLoading: boolean = false;
	donationCount: number = 0;
	slug: any;
	lang: any;
	removeTextArea: boolean = false;
	donor = {};
	constructor(
		public dialog: MatDialog,
		public dialogRef: MatDialogRef<DonorListFullComponent>,
		public media: MediaObserver,
		public replyService: ReplyChangeService,
		private fundRaiserService: FundraiserService,
		public _notificationService: NotificationService,
		public fundraiserService: FundraiserService,
		public _accountService: AccountService,
		public router: Router,
		@Inject(MAT_DIALOG_DATA) public data: any,
		ref: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.slug = this.router.url.split('?')[0].substring(13);
		this.lang = this._accountService.getLocaleId();

		this.fundraiserService
			.getDonorList(this.slug, this.page, this.lang)
			.subscribe((res: any) => {
				this.donorData = res.data?.result?.result;
				this.donationCount = res.data?.result?.count;

				if (this.donationCount <= 20) {
					this.loadDataCheck = true;
				} else {
					this.loadDataCheck = false;
				}
				this.totalPages = this.getPageNumbers();
			});

		this.replyService.currentUserValue.subscribe((data) => {
			this.isLoggedInUserAdmin = data;
		});
	}
	/** *Reply Message Button Functionality */
	replyMessage(index: any) {
		this.replyButton = true;
		this.replyIndex = index;
	}

	/** *Posting the Reply */
	postReply(input: any, replyIndex: any, i: any) {
		const y: any = replyIndex;

		let obj = {
			donation_order_id: replyIndex,
			thanks_message: input,
		};
		this.fundRaiserService.updateDonorReply(obj).subscribe((data) => {
			this.donorData[i].reply_message = input;
			this._notificationService.openNotification(
				$localize`:@@donor_list_full_messageSent:The message is successfully sent`,
				'',
				'success'
			);
			this.replyButton = false;
		});
	}

	//** *Load More Data Logic */
	showMoreData() {
		this.isLoading = true;
		this.page = this.page + 1;
		if (this.page <= this.totalPages) {
			if (this.donorData.length <= this.donorData.length) {
				this.fundraiserService
					.getDonorList(this.slug, this.page, this.lang)
					.subscribe((data: any) => {
						this.isDonorListLoading = false;
						this.donorData = [...this.donorData, ...data?.data?.result?.result];
						this.isLoading = false;
						if (this.donorData.length % this.donationCount == 0) {
							this.loadDataCheck = true;
						}
					});
			} else {
				this.loadDataCheck = false;
			}
		} else {
			this.loadDataCheck = false;
		}
	}

	/** *get Page Number For showing more card logic  */
	getPageNumbers(): number {
		this.totalPages = Math.floor(this.donationCount / 20);
		if (this.donationCount % 20 !== 0) {
			this.totalPages++;
			return this.totalPages;
		} else {
			return this.totalPages;
		}
	}
	onCloseClick() {
		this.dialogRef.close();
	}
}
