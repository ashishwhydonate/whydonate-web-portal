import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { DeleteFundraiserComponent } from 'src/app/pages/fundraiser/components/dialogs/delete-fundraiser/delete-fundraiser.component';
import { BankService } from 'src/app/pages/user/profile/services/bank.service';

@Component({
	selector: 'app-fundraiser-notification',
	templateUrl: './fundraiser-notification.component.html',
	styleUrls: ['./fundraiser-notification.component.scss'],
})
export class FundraiserNotificationComponent implements OnInit {
	@Output() showPublicNotification = new EventEmitter<boolean>();
	@Output() publishNotification = new EventEmitter<boolean>();
	@Input() currentFundraiserID: string = '';
	@Input() showPublishBanner!: boolean;
	@Input() isDraft!: boolean;
	@Input() currentSlug: string = '';
	@Input() showStripePrompt: boolean = false;
	isLoading: boolean = false;
	matTooltipCannotPublish = $localize`:@@fundraiserNotification_cannotPublish:Verify with stripe first to publish a fundraiser`;
	/*
	 * Function to show public view
	 */
	constructor(
		public router: Router,
		public dialog: MatDialog,
		public _media: MediaObserver
	) {}
	ngOnInit(): void {
		console.log('isDraftCUR', this.isDraft);
	}

	//Transfering of data from Child to Parent Using Output
	//Preview button logic
	showPublicView(value: boolean) {
		this.showPublicNotification.emit(value);
	}

	//For Publishing a fundraiser, This method will be used
	emitPublishClick(value: boolean) {
		if (value) {
			this.publishNotification.emit(value);
			this.isLoading = true;
		}
	}
	//Delete Fundraiser Functionality
	openDeleteFundraiserDialog() {
		const dialogRef = this.dialog.open(DeleteFundraiserComponent, {
			data: { slug: this.currentSlug },
		});
		dialogRef.afterClosed().subscribe((result: any) => {
			if (result) {
				let subscribe = timer(1000).subscribe((val) => {
					this.router.navigate(['/dashboard']);
					subscribe.unsubscribe();
				});
			}
		});
	}
}
