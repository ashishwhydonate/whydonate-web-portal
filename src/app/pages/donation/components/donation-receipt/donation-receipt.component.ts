import {
	ChangeDetectorRef,
	Component,
	ElementRef,
	Inject,
	OnInit,
	PLATFORM_ID,
	QueryList,
	ViewChild,
	ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Subject } from 'rxjs';
import { DonationService } from '../../services/donation.service';
import { error } from 'console';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-donation-receipt',
	templateUrl: './donation-receipt.component.html',
	styleUrls: ['./donation-receipt.component.scss'],
})
export class DonationReceiptComponent implements OnInit {
	isLoading: boolean = true;
	transactionId: any;
	paymentDetails: any = '';
	accountDetails: any = '';

	total_donated_amount: number = 0.0;

	slug: string = '';

	isBrowser: boolean = false;
	@ViewChild('receipt', { static: false }) receipt!: ElementRef;

	constructor(
		public _donationService: DonationService,
		private route: ActivatedRoute,
		public elementRef: ElementRef,
		private changeDetector: ChangeDetectorRef,
		public router: Router,
		public activatedRoute: ActivatedRoute,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	ngOnInit(): void {
		// GET RECEIPT DETAILS
		this.route.queryParams.subscribe(
			(params) => {
				if (params && params != undefined && Object.keys(params).length != 0) {
					this.transactionId = params.id;
					this._donationService
						.getReceipt(this.transactionId)
						.subscribe((response: any) => {
							this.paymentDetails = response?.data?.detailsRow?.donation;
							this.accountDetails = response?.data?.detailsRow?.receiver;
							this.isLoading = false;

							//extract slug from return url
							this.slug = this.paymentDetails?.return_url.split('/').pop();

							//CALCULATE TOTAL DONATION
							this.total_donated_amount =
								parseFloat(this.paymentDetails?.amount) +
								parseFloat(this.paymentDetails?.tip_amount);
							this.changeDetector.detectChanges();
							this.generateReceiptPDF();
						});
				} else {
					this.router.navigate(['/']);
				}
			},
			(error: any) => {
				console.log('Invalid Params: ', error);
				if (this.slug != '') {
					this.redirectToFundraiser();
				} else {
					this.router.navigate(['/']);
				}
			}
		);
	}

	generateReceiptPDF() {
		setTimeout(() => {
			html2canvas(this.receipt?.nativeElement, {
				useCORS: true,
				scale: 5,
			}).then((canvas) => {
				var img = canvas.toDataURL('image/jpeg', 100);
				var doc = new jsPDF('p', 'pt', 'a4');
				let img_width: number = canvas.width * 0.0264583333;
				let img_height: number = canvas.height * 0.0264583333;
				let width: any;
				if (this.isBrowser) width = window.innerWidth;

				if (width <= 600) {
					doc.addImage(img, 'jpeg', 0, 0, img_width * 10, img_height * 6);
				} else {
					doc.addImage(img, 'jpeg', 0, 0, 590, 450);
				}

				doc.save('whydonate-receipt.pdf');
			});
		}, 2000);
	}

	/** *Redirect To Donated Fundraiser  */
	redirectToFundraiser() {
		this.router.navigate(['fundraising/' + this.slug]);
	}
}
