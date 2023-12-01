import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from 'src/app/global/services/theme.service';
import { CustomBrandingService } from 'src/app/pages/user/custom-branding/services/custom-branding.service';
import { DashboardService } from 'src/app/pages/user/dashboard/services/dashboard.service';
import { FundraiserCardData } from 'src/app/shared/interfaces/fundraiser-card-interface';
import { FundraiserCardService } from 'src/app/shared/services/fundraiser-card.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DonationService } from '../../../services/donation.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-stripe',
	templateUrl: './stripe.component.html',
	styleUrls: ['./stripe.component.scss'],
})
export class StripeComponent implements OnInit {
	fundraiserGetFundraiser: any;
	data: any;
	fundraiserGetFundraiser2: any;
	_fundraiserCardService: FundraiserCardService;
	_fundraiserCardData: FundraiserCardData;
	donationReceipt: any;
	profileResponse: any;
	transactionCost: any;
	slug: string = '';
	donorId: string = '';
	orderId: string = '';
	isBrowser: boolean = false;

	constructor(
		public router: Router,
		public activatedRoute: ActivatedRoute,
		public _customBrandingService: CustomBrandingService,
		public _themeService: ThemeService,
		public donationService: DonationService,
		public notificationService: NotificationService,
		public _dashboardService: DashboardService,
		_fundraiserCardService: FundraiserCardService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		this._fundraiserCardService = _fundraiserCardService;
		this._fundraiserCardData = this._fundraiserCardService.getObjWithData();
	}
	ngOnInit(): void {
		this.fundraiserGetFundraiser = this.donationService.getDonationDone();

		this.transactionCost =
			(this.fundraiserGetFundraiser?.tip_amount * 1.9) / 100 + 0.25;
	}

	ngAfterViewInit(): void {
		setTimeout(() => {
			this.slug = this.router.url.split('?')[0].substring(29);

			this.activatedRoute.queryParams.subscribe((params) => {
				this.slug = params['slug'];
				this.donorId = params['donorId'];
				this.orderId = params['orderId'];
			});

			this.donationService.getOrderStatus(this.orderId).subscribe(
				(response: any) => {
					let status: string = response['data']['status'];
					if (this.isBrowser)
						localStorage.setItem(
							'transactionId',
							response['data']['payment_transaction_id'] //Need to refactor later, discussion required!
						);
					switch (status?.toLowerCase()) {
						case 'paid':
							this.router.navigate([
								'donate/successful/' + this.slug,
								{
									donorId: this.donorId,
									orderId: this.orderId,

									slug: this.slug,
								},
							]);
							break;

						case 'created':
							this.notificationService.openNotification(
								$localize`:@@check_payment_status_donationPending_notification:The donation is pending. Please contact support.`,
								'OK',
								'success'
							);
							this.router.navigate([
								'donate/successful/' + this.slug,
								{
									donorId: this.donorId,
									orderId: this.orderId,

									slug: this.slug,
								},
							]);
							break;

						case 'pending':
							this.notificationService.openNotification(
								$localize`:@@check_payment_status_donationPending_notification:The donation is pending. Please contact support.`,
								'OK',
								'success'
							);
							this.router.navigate([
								'donate/successful/' + this.slug,
								{
									donorId: this.donorId,
									orderId: this.orderId,

									slug: this.slug,
								},
							]);

							break;

						case 'planned':
							this.notificationService.openNotification(
								$localize`:@@check_payment_status_donationPending_notification:The donation is pending. Please contact support.`,
								'OK',
								'success'
							);
							this.router.navigate([
								'donate/successful/' + this.slug,
								{
									donorId: this.donorId,
									orderId: this.orderId,

									slug: this.slug,
								},
							]);
							break;

						case 'reserved':
							this.notificationService.openNotification(
								$localize`:@@check_payment_status_donationPending_notification:The donation is pending. Please contact support.`,
								'OK',
								'success'
							);
							this.router.navigate([
								'donate/successful/' + this.slug,
								{
									donorId: this.donorId,
									orderId: this.orderId,

									slug: this.slug,
								},
							]);
							break;

						case 'canceled':
							this.notificationService.openNotification(
								`The donation has been cancelled. Please contact support.`,
								'OK',
								'error'
							);
							this.router.navigate(['donate/' + this.slug]);
							break;

						default:
							this.notificationService.openNotification(
								$localize`:@@check_payment_status_donationFailed_notification:The donation has failed. Please try again.`,
								'OK',
								'error'
							);
							this.router.navigate(['donate/' + this.slug]);
					}
				},
				(err) => {
					this.notificationService.openNotification(
						$localize`:@@check_payment_status_donationFailed_notification:The donation has failed. Please try again.`,
						'OK',
						'error'
					);
				}
			);
		}, 5000);
	}
}
