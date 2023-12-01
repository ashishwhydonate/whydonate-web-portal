import {
	ChangeDetectionStrategy,
	Component,
	Input,
	Output,
	OnChanges,
	OnInit,
	EventEmitter,
	SimpleChanges,
} from '@angular/core';
import { FundraiserCardData } from 'src/app/shared/interfaces/fundraiser-card-interface';

@Component({
	selector: 'app-days-left-view',
	templateUrl: './days-left-view.component.html',
	changeDetection: ChangeDetectionStrategy.Default,
})
export class DaysLeftViewComponent implements OnInit, OnChanges {
	@Input() fundraiserCardData!: FundraiserCardData;
	@Output() closedStatus = new EventEmitter<boolean>();

	daysLeft = -1;
	constructor() {}
	ngOnChanges(changes: SimpleChanges): void {
		if (Object.keys(changes.fundraiserCardData?.currentValue || {}).length) {
			this.setDaysLeft();
		}
	}

	ngOnInit(): void {
		console.log('DONATION DAYS', this.fundraiserCardData);
	}

	setDaysLeft(): void {
		this.daysLeft = this.fundraiserCardData?.donationDaysLeft || 0;
	}
}
