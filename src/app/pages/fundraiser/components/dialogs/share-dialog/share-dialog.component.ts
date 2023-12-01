import { TabChangeRequestService } from './../../../services/tab-switch.service';
import { ComponentPortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
	Component,
	Inject,
	OnChanges,
	OnInit,
	PLATFORM_ID,
	SimpleChanges,
} from '@angular/core';
import {
	MatDialog,
	MatDialogRef,
	MAT_DIALOG_DATA,
} from '@angular/material/dialog';

/** *import { EmbedComponent } from './components/embed/embed.component'; */
/** *import { PreviewComponent } from './components/preview/preview.component'; */

@Component({
	selector: 'app-share-dialog',
	templateUrl: './share-dialog.component.html',
	styleUrls: ['./share-dialog.component.scss'],
})
export class ShareDialogComponent implements OnInit {
	/** *embedPortal: ComponentPortal<EmbedComponent>; */
	/** *embedPreview: ComponentPortal<PreviewComponent>; */

	tabIndex: number | any;

	embedOption!: number;
	isBrowser: boolean = false;

	fundraiserLabel = $localize`:@@share_dialog_fundraiserPage_label:Fundraiser Page`;
	donationLabel = $localize`:@@share_dialog_donationPage_label:Donation Page`;
	paymentRequestLabel = $localize`:@@share_dialog_paymentRequestPage_label:Payment Request`;
	ownWebsiteLabel = $localize`:@@share_dialog_ownWebsite_label:On own website`;
	constructor(
		public dialogRef: MatDialogRef<ShareDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { fundraiser: any },
		public changerequest: TabChangeRequestService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		/** *this.embedPortal = new ComponentPortal(EmbedComponent); */
		/** *this.embedPreview = new ComponentPortal(PreviewComponent); */
	}

	ngOnInit(): void {
		this.changerequest.currentCustomText.subscribe((data) => {
			console.log(data);
			this.tabIndex = data;
			this.moveToSelectedTab('On own website');
		});
	}

	tabChange(event: any) {
		console.log(event);
	}

	moveToSelectedTab(tabName: string) {
		if (this.isBrowser)
			for (
				let i = 0;
				i < document.querySelectorAll('.mat-tab-label-content').length;
				i++
			) {
				if (
					(<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i])
						.innerText == tabName
				) {
					(<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
				}
			}
	}
	onCloseClick() {
		this.dialogRef.close();
	}
}
