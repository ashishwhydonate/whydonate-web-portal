import {
	Component,
	OnInit,
	Input,
	EventEmitter,
	Output,
	ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardService } from 'src/app/pages/user/dashboard/services/dashboard.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-summaries',
	templateUrl: './summaries.component.html',
	styleUrls: ['./summaries.component.scss'],
})
export class SummariesComponent implements OnInit {
	draftFundraiser!: number;
	publishedFundraiser!: number;
	ownedFundraiser!: number;
	connectedFundraiser!: number;
	fundraisersCount!: number;
	@Input() count!: number;
	fundraiserError: boolean = false;
	@Output() redirect: EventEmitter<boolean> = new EventEmitter<boolean>();
	selectedFilter: any;

	constructor(
		private http: HttpClient,
		private dashboardService: DashboardService,
		public router: Router,
	) {}

	ngOnInit(): void {
			this.dashboardService
				.getFundraiserSummary()
				.subscribe((response: any) => {
					this.draftFundraiser = response?.data?.draft;
					this.publishedFundraiser = response?.data?.published;
					this.ownedFundraiser = response?.data?.owned;
					this.connectedFundraiser = response?.data?.connected;
					if (
						(response?.errors && response?.errors?.code == '4001') ||
						(this.draftFundraiser == 0 &&
							this.publishedFundraiser == 0 &&
							this.ownedFundraiser == 0 &&
							this.connectedFundraiser == 0)
					) {
						this.fundraiserError = true;
					} else {
						this.fundraiserError = false;
					}
				});
		
	}
	redirectToFundraiser() {
		this.router.navigate(['/my-fundraisers']);
	}
	redirectToTarget(status: string) {
		// Navigate to the target component with the specified filterName parameter
		this.router.navigate(['/my-fundraisers'], {
			queryParams: { filter: status },
		});
		this.selectedFilter = status; // Set the selectedFilter value
	}
}
