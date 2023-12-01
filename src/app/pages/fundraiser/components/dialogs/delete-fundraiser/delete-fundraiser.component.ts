import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FundraiserService } from '../../../services/fundraiser.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-delete-fundraiser',
	templateUrl: './delete-fundraiser.component.html',
})
/** *Delete Fundraiser Component */
export class DeleteFundraiserComponent implements OnInit {
	isLoading: boolean = false;
	constructor(
		public fundraiserService: FundraiserService,
		private _router: Router,
		public dialogRef: MatDialogRef<DeleteFundraiserComponent>,
		public notificationService: NotificationService,
		@Inject(MAT_DIALOG_DATA)
		public data: {
			slug: string;
		}
	) {}

	ngOnInit(): void {
		console.log('HEHEHHE', this.data);
	}

	deleteFundraiser() {
		this.isLoading = true;
		this.fundraiserService.deleteFundraiser(this.data['slug']).subscribe(
			(result: any) => {
				this.isLoading = false;
				if (result) {
					if (result?.status === 200) {
						if (result?.data && result?.data?.deleted) {
							this.notificationService.openNotification(
								$localize`:@@delete_fundraiser_fundraiserDeleted_notification:Fundraiser deleted successful`,
								'',
								'success'
							);
							this.dialogRef.close(true);
							this._router.navigate(['/dashboard']);
						} else {
							if (
								result?.data?.message ===
								'Fundraiser already has connected fundraisers and donations are live'
							) {
								this.notificationService.openNotification(
									$localize`:@@delete_fundraiser_connectedOrLive_notification:Fundraiser already has connected fundraisers and donations are live`,
									'',
									'error'
								);
								this.dialogRef.close(false);
							} else {
								this.notificationService.openNotification(
									$localize`:@@delete_fundraiser_couldnotDelete_notification:Couldn't delete the fundraiser`,
									'',
									'error'
								);
							}
						}
					}
				}
			},
			(errorResponse) => {
				this.isLoading = false;
				if (
					errorResponse?.error?.errors?.code &&
					errorResponse?.error?.errors?.message ===
						'no fundraiser found to delete'
				) {
					this.notificationService.openNotification(
						`Error-${errorResponse?.error.errors?.code}: Fundraiser not found`,
						'',
						'error'
					);
				} else {
					console.log('Error: ', errorResponse);
					this.notificationService.openNotification(
						'Error Occurred',
						'',
						'error'
					);
				}
			}
		);
	}
	onNoClick() {
		this.dialogRef.close();
	}
}
