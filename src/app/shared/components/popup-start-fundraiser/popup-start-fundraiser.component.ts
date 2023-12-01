import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { Tools } from 'src/utilities/tools';

@Component({
	selector: 'app-popup-start-fundraiser',
	templateUrl: './popup-start-fundraiser.component.html',
	styleUrls: ['./popup-start-fundraiser.component.scss'],
})
//** *Popup Start*/
export class PopupStartFundraiserComponent implements OnInit {
	isBrowser: boolean = false;
	constructor(
		public dialogRef: MatDialogRef<PopupStartFundraiserComponent>,
		public router: Router,
		public _accountService: AccountService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}
	ngOnInit(): void {}

	routeToCreateFundraiser() {
		this.close();
		let createUrl = 'fundraising/create';
		Tools.setPreviousPath(createUrl);
		this.router.navigate([createUrl]);
	}

	connectFundraiser() {
		this.close();
		this.router.navigate(['search']);
	}

	contactUs() {
		this.close();
		let userLang = this._accountService.getLocaleId();
		if (this.isBrowser)
			switch (userLang) {
				case 'nl':
					window.location.href = 'https://whydonate.com/contact/';
					break;
				case 'en':
					window.location.href = 'https://whydonate.com/en/contact-us/';
					break;
				case 'es':
					window.location.href = 'https://whydonate.com/es/contactenos/';
					break;
				case 'fr':
					window.location.href = 'https://whydonate.com/fr/contact-nous/';
					break;
				case 'de':
					window.location.href = 'https://whydonate.com/de/kontaktiere-uns/';
					break;
				default:
					window.location.href = 'https://whydonate.com/contact/';
					break;
			}
	}

	close() {
		this.dialogRef.close();
	}
}
