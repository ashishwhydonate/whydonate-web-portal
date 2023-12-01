import {
	Component,
	Input,
	OnInit,
	EventEmitter,
	Output,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Router, NavigationEnd } from '@angular/router';
import { User } from 'src/app/global/models/user';
import { FundraiserService } from '../../../services/fundraiser.service';

@Component({
	selector: 'app-fundraiser-location',
	templateUrl: './fundraiser-location.component.html',
	styleUrls: ['./fundraiser-location.component.scss'],
})
/** *Fundraiser Location Component */
export class FundraiserLocationComponent implements OnInit, OnChanges {
	@Input() currentFundraiser!: any;
	location: string = '';
	country: string = '';
	isLoggedInUserAdmin = false;
	showEdits = false;
	slug: string = '';

	constructor(
		public router: Router,
		public _media: MediaObserver,
		public fundraiserService: FundraiserService
	) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (this.currentFundraiser?.slug) {
		}
	}

	ngOnInit(): void {
		console.log('LOCATION', this.currentFundraiser);
	}
}
