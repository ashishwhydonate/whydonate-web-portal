import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { FundraiserService } from '../../../services/fundraiser.service';

@Component({
	selector: 'app-created-by',
	templateUrl: './created-by.component.html',
})
/** *Created By Component */
export class CreatedByComponent implements OnInit, OnChanges {
	@Input() currentFundraiser: any;
	// private _currentFundraiser!: any;
	// @Input() set currentFundraiser(value: any) {
	// 	this._currentFundraiser = value;
	// }
	// get currentFundraiser(): any {
	// 	return this._currentFundraiser;
	// }
	profileImage!: string;
	profileName!: string;
	social: string = '';
	// slug: string = '';
	// isLoggedInUserAdmin = false;
	// showEdits = false;
	defaultProfileImage =
		'https://res.cloudinary.com/whydonate/image/upload/v1678288363/whydonate-production/platform/svg-icons/createdBy.svg';

	constructor(
		public router: Router,
		public _media: MediaObserver,
		public fundraiserService: FundraiserService
	) {}
	ngOnChanges(changes: SimpleChanges): void {
		// console.log('CreatedByComponent:ngOnChanges', changes);
		if (this.currentFundraiser?.slug) {
			this.profileImage =
				this.currentFundraiser?.profile?.image || this.defaultProfileImage;
			this.profileName = this.currentFundraiser?.profile?.name;
			this.social = this.currentFundraiser?.socialmedia;
		}
	}

	ngOnInit(): void {}

	fallbackToDefaultImage() {
		this.profileImage = this.defaultProfileImage;
	}
}
