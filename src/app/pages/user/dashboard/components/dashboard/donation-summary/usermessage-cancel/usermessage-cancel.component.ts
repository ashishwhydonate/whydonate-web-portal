import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { platform } from 'os';

@Component({
	selector: 'app-usermessage-cancel',
	templateUrl: './usermessage-cancel.component.html',
	styleUrls: ['./usermessage-cancel.component.scss'],
})
export class UsermessageCancelComponent implements OnInit {
	isBrowser: boolean = false;
	constructor(@Inject(PLATFORM_ID) platformId: string) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}
	onclickOkay(): void {
		if (this.isBrowser)
			setTimeout(() => {
				window.location.reload();
			}, 1000);
	}

	ngOnInit(): void {}
}
