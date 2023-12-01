import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StepsToDO } from '../../interfaces/steps-to-do-interface';
import { PopupStartFundraiserComponent } from '../popup-start-fundraiser/popup-start-fundraiser.component';

@Component({
	selector: 'app-steps-to-do',
	templateUrl: './steps-to-do.component.html',
})
//** *Steps To do Component */
export class StepsToDoComponent implements OnInit {
	@Input() stepsToDo!: StepsToDO[];
	@Input() collapsable!: boolean;
	todoCheckList: any;
	constructor(public router: Router, public _dialog: MatDialog) {}

	ngOnInit(): void {}

	/*
	 * Routes
	 */
	routeToBank() {
		this.router.navigate(['profile', 'bank']);
	}
	routeToCustomBranding() {
		this.router.navigate(['custom-branding']);
	}
	// routeToPersonal() {
	// 	this.router.navigate(['profile', 'personal-verification']);
	// }
	routeToNewFundraiser() {
		const dialogRef = this._dialog.open(PopupStartFundraiserComponent, {
			width: 'fit-content',
			height: 'fit-content',
			panelClass: 'max-w-100--panelClass',
			autoFocus: false,
		});
	}
	routeToSearch() {
		this.router.navigate(['search']);
	}
}
