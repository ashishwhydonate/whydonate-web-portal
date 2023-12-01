/**This component comes into action upon clicking edit button on Donate section of registered user */

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import {
	UntypedFormGroup,
	Validators,
	UntypedFormBuilder,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { combineLatest, forkJoin, Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { FundraiserService } from '../../../services/fundraiser.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { FundraiserCardData } from 'src/app/shared/interfaces/fundraiser-card-interface';
import { FundraiserCardService } from 'src/app/shared/services/fundraiser-card.service';
import { environment } from 'src/environments/environment';
import { FundraiserCardDataCustomDonation } from 'src/app/shared/interfaces/fundraiser-card-interface-custom-donation';

export type DonationField =
	| 'onetime'
	| 'monthly'
	| 'yearly'
	| 'otherAmount'
	| 'tipBox';

export type DonationConfigField =
	| 'onetime_select'
	| 'onetime_first'
	| 'onetime_second'
	| 'onetime_third'
	| 'onetime_forth'
	| 'onetime_style'
	| 'monthly_select'
	| 'monthly_first'
	| 'monthly_second'
	| 'monthly_third'
	| 'monthly_forth'
	| 'monthly_style'
	| 'yearly_select'
	| 'yearly_first'
	| 'yearly_second'
	| 'yearly_third'
	| 'yearly_forth'
	| 'yearly_style'
	| 'other_amount';
export type DonationConfig = {
	[key in DonationConfigField | tipEnabled]?: boolean | string;
};
export type tipEnabled = 'tip_enabled';
export type fundraisingLocalId = 'fundraising_local_id';
export type CustomDonationBody = {
	[key in DonationConfigField | tipEnabled | fundraisingLocalId]?:
		| boolean
		| string
		| number;
};

@Component({
	selector: 'fundraiser-not-found-handler',
	templateUrl: './fundraiser-not-found-handler.html',
})
/** *Custom Donation Form Component */
export class fundraiserNotfoundhandlerComponent implements OnInit, AfterViewInit {
	
	ngAfterViewInit(): void {}

	ngOnInit(): void {}
}
