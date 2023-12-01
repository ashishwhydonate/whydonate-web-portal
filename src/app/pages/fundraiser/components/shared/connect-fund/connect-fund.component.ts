import { Router } from '@angular/router';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Tools } from 'src/utilities/tools';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FundraiserService } from '../../../services/fundraiser.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-connect-fund',
	templateUrl: './connect-fund.component.html',
})
/** *Connect Fund Component */
export class ConnectFundComponent implements OnInit {
	@Input() slug = '';
	@Input() isAllowChild!: boolean;
	@Input() isLoggedInUserAdmin: boolean = false;
	@Input() hideToggleSwitch = false;
	allowConnectedFundraiser: boolean = true;
	isBrowser: boolean = false;
	tooltip = $localize`:@@connect_fund_mat_tooltip:if you create a connected fundraiser, it will be linked to an already existing fundraiser. The donations are paid to this parent fundraiser.`;
	allowTooltip = $localize`:@@connect_fund_mat_tooltip_allow_connected_toggle:This option will allow you to connect more fundraisers with your already existing fundraiser.`;

	constructor(
		public _media: MediaObserver,
		public router: Router,
		private _fundraiserService: FundraiserService,
		public notificationService: NotificationService,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	ngOnInit(): void {
		this.allowConnectedFundraiser = this.isAllowChild;
	}

	routeToConnectFundraiser() {
		// localStorage.setItem('previous_path', 'fundraising/connect/' + this.slug);
		// this.router.navigate(['fundraising/connect/' + this.slug]);
		let connectedUrl = 'fundraising/connect/' + this.slug;
		console.log('connectedUrl', connectedUrl);
		Tools.setPreviousPath(connectedUrl);
		this.router.navigate([connectedUrl]);
	}

	onToggleChange(event: MatSlideToggleChange) {
		this.allowConnectedFundraiser = event.checked;
		const toggleValue = {
			allow_connected_fundraiser: this.allowConnectedFundraiser,
		};

		console.log('ALL1', this.allowConnectedFundraiser);

		this._fundraiserService
			.allowConnectedFundraiser({
				allow_child: this.allowConnectedFundraiser,
				slug: this.slug,
			})
			.subscribe((res: any) => {
				console.log('RES2', res);

				this.notificationService.openNotification(
					$localize`:@@connect_fund_allow_connected_notification: Allow Connected Fundraiser Settings Saved`,
					'',
					'success'
				);
				if (this.isBrowser) window.location.reload();
			});
	}
}
