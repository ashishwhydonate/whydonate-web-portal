import { Injectable } from '@angular/core';
import { data } from 'cypress/types/jquery';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SidenavService {
	public isShowText: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(
		false
	);

	public isShowIcon: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(
		false
	);

	constructor() {}

	toggleSidenav(isShowText: Boolean, isShowIcon: Boolean) {
		this.isShowText.next(isShowText);
		this.isShowIcon.next(isShowIcon);
	}

	getIsShowTextValue() {
		return this.isShowText.getValue();
	}

	getIsShowIconValue() {
		return this.isShowIcon.getValue();
	}
}
