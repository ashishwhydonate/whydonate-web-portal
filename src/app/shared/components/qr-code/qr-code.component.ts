import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/pages/user/custom-branding/components/custom-branding/branding/template/fundraiser-preview.component';

@Component({
	selector: 'app-qr-code',
	templateUrl: './qr-code.component.html',
	styleUrls: ['./qr-code.component.scss'],
})
/** *Qr Code Component */
export class QrCodeComponent implements OnInit {
	qrdata = 'Initial QR code data string';
	newUrl: any;
	isHided: boolean = false;
	isBrowser: boolean = false;
	constructor(
		public dialogRef: MatDialogRef<QrCodeComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		this.newUrl = this.data;
		console.log('new url', this.newUrl.link);
	}

	ngOnInit(): void {
		console.log('this.qrcodeComponent', this.data);
	}

	saveAsImage(parent: any) {
		console.log(parent);
		/** *fetches base 64 date from image3 */
		const parentElement =
			parent.qrcElement.nativeElement.querySelector('img').src;
		console.log('parent', parentElement);
		/** *converts base 64 encoded image to blobData */
		let blobData = this.convertBase64ToBlob(parentElement);

		/** *saves as image */
		if (this.isBrowser)
			if (
				(window.navigator as any) &&
				(window.navigator as any).msSaveOrOpenBlob
			) {
				/** *IE */
				(window.navigator as any).msSaveOrOpenBlob(blobData, 'Qrcode');
			} else {
				/** *chrome */
				const blob = new Blob([blobData], { type: 'image/png' });
				const url = window.URL.createObjectURL(blob);
				/** *window.open(url); */
				let link: any;
				if (this.isBrowser) link = document.createElement('a');
				link.href = url;
				link.download = 'Qrcode';
				link.click();
			}
	}
	private convertBase64ToBlob(Base64Image: any) {
		/** *SPLIT INTO TWO PARTS */
		const parts = Base64Image.split(';base64,');
		/** *HOLD THE CONTENT TYPE */
		const imageType = parts[0].split(':')[1];
		/** *DECODE BASE64 STRING */
		let decodedData: any;
		if (this.isBrowser) decodedData = window.atob(parts[1]);
		/** *CREATE UNIT8ARRAY OF SIZE SAME AS ROW DATA LENGTH */
		const uInt8Array = new Uint8Array(decodedData.length);
		/** *INSERT ALL CHARACTER CODE INTO UINT8ARRAY */
		for (let i = 0; i < decodedData.length; ++i) {
			uInt8Array[i] = decodedData.charCodeAt(i);
		}
		/** *RETURN BLOB IMAGE AFTER CONVERSION */
		return new Blob([uInt8Array], { type: imageType });
	}
	onCloseClick() {
		this.dialogRef.close();
	}
}
