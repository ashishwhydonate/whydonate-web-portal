import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
	UntypedFormControl,
	UntypedFormGroup,
	Validators,
} from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CategoryService } from '../../../services/category.service';
import { FundraiserService } from '../../../services/fundraiser.service';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-edit-fundraiser-category',
	templateUrl: './edit-fundraiser-category.component.html',
	styleUrls: ['./edit-fundraiser-category.component.scss'],
})
export class EditFundraiserCategoryComponent implements OnInit {
	categoryForm!: UntypedFormGroup;
	debounceDelay: number = 500; //debounce delay for category input
	categoryBody: any = {};
	isLoading: boolean = false;
	categories: any;
	isSave: boolean = false;
	isBrowser: boolean = false;
	constructor(
		public fundraiserService: FundraiserService,
		public _accountService: AccountService,
		public categoryService: CategoryService,
		public notificationService: NotificationService,
		@Inject(MAT_DIALOG_DATA) public data: { currentFundraiser: any },
		public dialogRef: MatDialogRef<EditFundraiserCategoryComponent>,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		this.categoryForm = new UntypedFormGroup({
			categoryControl: new UntypedFormControl('', {
				validators: [Validators.required],
			}),
		});

		this.categoryForm?.controls['categoryControl'].setValue(
			data?.currentFundraiser?.category?.name
		);
	}

	ngOnInit(): void {
		this.getCategoryList();
	}
	setCategory() {
		const newItem = this.categories.filter((i: any) => {
			return i.name === this.categoryForm?.controls['categoryControl'].value;
		});
		if (newItem && newItem.length > 0 && newItem[0].id !== undefined) {
			this.categoryBody['category_id'] = newItem[0].id;
			//console.log(this.categoryBody['category_id']);
		}
	}
	dialogClose() {
		this.isSave = true;
		try {
			this.categoryBody['language_code'] = this._accountService.getLocaleId();
			this.categoryBody['id'] = this.data?.currentFundraiser?.id;
			console.log(this.categoryBody);
			if (
				this.data?.currentFundraiser?.parent != null &&
				Object.keys(this.data?.currentFundraiser?.parent).length > 0
			) {
				this.categoryBody['slug'] = this.data?.currentFundraiser?.slug;
				this.fundraiserService
					.updateConnectedFundraiserCategory(this.categoryBody)
					.subscribe(
						(res: any) => {
							this.isSave = false;
							// console.log('category Updated', res);
							this.notificationService.openNotification(
								$localize`:@@edit_fundraiser_category_categoryUpdated_notification:Fundraiser category is updated`,
								'',
								'success'
							);
							// console.log('EditFundraisercategoryComponent', res);
							this.dialogRef.close(res?.data?.category);
							if (this.isBrowser) window.location.reload();
						},
						(err: any) => {
							this.notificationService.openNotification(
								$localize`:@@edit_fundraiser_category_errorUpdating_notification:There was an error updating fundraiser category`,
								'close',
								'error'
							);
							this.isSave = false;
						}
					);
			} else {
				this.fundraiserService
					.updateFundraiserTitleDescription(this.categoryBody)
					.subscribe(
						(res: any) => {
							this.isSave = false;
							// console.log('category Updated', res);
							this.notificationService.openNotification(
								$localize`:@@edit_fundraiser_category_categoryUpdated_notification:Fundraiser category is updated`,
								'',
								'success'
							);
							// console.log('EditFundraisercategoryComponent', res);
							this.dialogRef.close(res?.data?.category);
							if (this.isBrowser) window.location.reload();
						},
						(err: any) => {
							this.notificationService.openNotification(
								$localize`:@@edit_fundraiser_category_errorUpdating_notification:There was an error updating fundraiser category`,
								'close',
								'error'
							);
							this.isSave = false;
						}
					);
			}
		} catch (err: any) {
			this.notificationService.openNotification(
				$localize`:@@edit_fundraiser_category_error_notification:There was an error`,
				'close',
				'error'
			);
			this.isSave = false;
		}
	}
	getCategoryList() {
		this.categoryService.getCategorylist().subscribe((response) => {
			this.categories = JSON.parse(JSON.stringify(response))['data'];
		});
	}
	onCloseClick() {
		this.dialogRef.close();
	}
}
