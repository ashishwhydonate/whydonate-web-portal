import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { MediaService } from '../../../services/media.service';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { FundraiserService } from '../../../services/fundraiser.service';

@Component({
	selector: 'app-fundraiser-about',
	templateUrl: './fundraiser-about.component.html',
})
export class FundraiserAboutComponent implements OnInit, OnChanges {
	@Input() currentFundraiser!: any;
	@Input() isChildFundraiser!: boolean;
	@Input() fundraiserDescriptionData!: any;
	@Input() isLoading!: boolean;
	parentFundraiserAboutcontent: string = '';
	fundraiserMediaList: {}[] = [];
	mediaLength: number = 0;
	getParentFundraiserDescription: any;
	getChildFundraiserDescription: any;
	locale: string = '';
	localeSuffix: string | any = '';
	constructor(
		public _mediaService: MediaService,
		public _accountService: AccountService,
		public _fundraiserService: FundraiserService
	) {
		this.locale = this._accountService.getLocaleId();
		this.localeSuffix = this._fundraiserService.getLocaleSuffix(this.locale);
	}
	ngOnChanges(changes: SimpleChanges): void {
		console.log('ISLOAD111', this.isLoading);

		if (this.currentFundraiser && this.currentFundraiser?.image_list) {
			this.fundraiserMediaList = this._mediaService.getSliderMediaList(
				this.currentFundraiser?.image_list
			);
			if (
				this.fundraiserMediaList &&
				this.fundraiserMediaList != undefined &&
				this.fundraiserMediaList != null
			) {
				this.mediaLength = this.fundraiserMediaList?.length;
			}
		}

		if (this.isChildFundraiser === true) {
			let translationContent =
				this.fundraiserDescriptionData?.parent?.translations?.[
					'content_' + this.locale
				];
				// console.log("parent1",translationContent);
			this.parentFundraiserAboutcontent =
				translationContent || this.fundraiserDescriptionData?.parent?.content;
			this.parentFundraiserAboutcontent =
				this.parentFundraiserAboutcontent?.trim();
		}
	}
	ngOnInit(): void {
		// console.log("fundr1", this.fundraiserDescriptionData)
	}
}
