/**This component provides all the useful information regarding donation summary
 * i.e. given, recieved and recurring donations made by the registered user */

import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-donation-summary',
	templateUrl: './donation-summary.component.html',
	styleUrls: ['./donation-summary.component.scss'],
})
/** *Donation Summary Component */
export class DonationSummaryComponent implements OnInit {
	@Input() donationReceived!: any;
	@Input() donationGiven!: any;
	@Input() donationRecurringReceived!: any;
	@Input() donationRecurringGiven!: any;

	constructor() {}

	ngOnInit(): void {}
}
