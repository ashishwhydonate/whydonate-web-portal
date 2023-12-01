import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
/** *Tab Change Request Service */
export class PaymentRequestService {
	private customText = new BehaviorSubject<string>('');
	currentCustomText = this.customText.asObservable();

	constructor() {}

	changeText(text: string) {
		console.log(text);
		this.customText.next(text);
	}

	getCustomTextValue() {
		return this.customText.value;
	}
}
