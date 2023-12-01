import { Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges, } from '@angular/core';
  import { MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { FundraiserService } from '../../../services/fundraiser.service';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-opp-owner',
  templateUrl: './opp-owner.component.html',

})
export class OppOwnerComponent implements OnInit {
  @Input()  bankAccount: any;
	constructor(
		public _media: MediaObserver
		) {}
		ngOnChanges(changes: SimpleChanges): void {
		console.log('bankAccount', this.bankAccount);
	}
	ngOnInit(): void {
	}
  



}
