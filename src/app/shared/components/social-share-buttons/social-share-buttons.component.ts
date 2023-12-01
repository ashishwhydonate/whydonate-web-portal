/** This component is recalled in share-contribution component */
import { QrCodeComponent } from './../qr-code/qr-code.component';
import { Component, Input, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { TabChangeRequestService } from 'src/app/pages/fundraiser/services/tab-switch.service';
/**
 * DESCRIPTION: Share buttons component for fundraisers
 * EXAMPLE: facebook, twitter, linkedin, whatsapp, email, copy url
 * TODO: Use API from ngx-sharebutton to add functionality for meta tag like title, descritption. This is helpfull when this component want to override the metatag of page.
 */
@Component({
	selector: 'app-social-share-buttons',
	templateUrl: './social-share-buttons.component.html',
	styleUrls: ['./social-share-buttons.component.scss'],
})
export class SocialShareButtonsComponent implements OnInit {
	@Input() sharedLink: string = '';
	@Input() disableSocialShare: boolean = false;
	@Input() tabRoute: boolean = false;
	@Input() isDonationModule: boolean = false;
	@Input() customURL: string = '';
	@Input() currentFundraiserData: any;
	constructor(
		public media: MediaObserver,
		public dialog: MatDialog,
		public tabchangerequest: TabChangeRequestService
	) {}
	ngOnInit(): void {}

	openDialog(): void {
		const dialogRef = this.dialog.open(QrCodeComponent, {
			width: '450px',
			height: '400px',
			data: { link: this.sharedLink },
		});
	}

	onTabChange() {
		this.tabchangerequest.changeTab();
	}
}
