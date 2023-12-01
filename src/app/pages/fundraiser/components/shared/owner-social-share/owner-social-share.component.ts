import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
@Component({
	selector: 'app-owner-social-share',
	templateUrl: './owner-social-share.component.html',
})
/** *Owner Social Share Component */
export class OwnerSocialShareComponent implements OnInit, OnChanges {
	@Input() socialMedia: any = '';
	@Input() isLoggedIn: any = '';
	constructor(public _media: MediaObserver) {}
	ngOnChanges(changes: SimpleChanges): void {
		console.log('socialMedia', this.isLoggedIn);
	}
	ngOnInit(): void {
		// console.log('the social media in social share button are',this.socialMedia);
	}
	attachHttps(url: string): string {
		if (!/^https?:\/\//i.test(url)) {
			url = 'https://' + url;
		}
		return url;
	}
}
