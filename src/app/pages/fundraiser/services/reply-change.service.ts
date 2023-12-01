import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
/** *Reply Change Service */
export class ReplyChangeService {
	private userValue = new BehaviorSubject<boolean>(false);
	currentUserValue = this.userValue.asObservable();

	constructor() {}

	/** *Change User Value Using Behaviour Subject */
	changeUserValue(value: boolean) {
		console.log('switching');
		this.userValue.next(value);
	}
	/** *Get User Value Using Behaviour Subject */
	getUserValue() {
		return this.userValue.value;
	}
}
