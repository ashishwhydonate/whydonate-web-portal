import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
/** *Tab Change Request Service */
export class TabChangeRequestService {
	private customText = new BehaviorSubject<number>(0);
	currentCustomText = this.customText.asObservable();

	constructor() {}

	/** *Tab Change */
	changeTab() {
		console.log('switching');
		this.customText.next(3);
	}
	/** *Get Custom Text Value */
	getCustomTextValue() {
		return this.customText.value;
	}
}
