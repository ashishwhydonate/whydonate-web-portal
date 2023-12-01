import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { MediaService } from '../../../services/media.service';

@Component({
	selector: 'app-fundraiser-media-view',
	templateUrl: './fundraiser-media-view.component.html',
})
/** *Fundraiser Media View Component */
export class FundraiserMediaViewComponent implements OnInit, OnChanges {
	@Input() currentFundraiser: any;
	fundraiserMediaList: {}[] = [];
	mediaLength: number = 0;

	constructor(public _mediaService: MediaService) {}
	ngOnChanges(changes: SimpleChanges): void {
		if (this.currentFundraiser?.image_list) {
			this.fundraiserMediaList = this._mediaService.getSliderMediaList(
				this.currentFundraiser?.image_list || []
			);
			this.mediaLength = this.getLength(this.fundraiserMediaList);
		}
	}

	ngOnInit(): void {}

	getLength(mediaList: any) {
		return mediaList?.length;
	}
}
