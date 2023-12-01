import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-promote-cause-button',
	templateUrl: './promote-cause-button.component.html',
	styleUrls: ['./promote-cause-button.component.scss'],
})
/** *Promote Cause */
export class PromoteCauseButtonComponent implements OnInit {
	constructor(private route: Router) {}

	ngOnInit(): void {}

	routeToSearchFromPromote() {
		this.route.navigate(['search']);
	}
}
