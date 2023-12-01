import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { ProfileService } from '../../services/profile.service';
import { takeUntil } from 'rxjs/operators';
import { AccountService } from 'src/app/pages/account/services/account.service';

@Component({
	selector: 'app-head-navigation',
	templateUrl: './head-navigation.component.html',
	styleUrls: ['./head-navigation.component.scss'],
})
export class HeadNavigationComponent implements OnInit {
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	sub!: Subscription;
	profile!: any;
	profile_routes: any;
	profileImage: any;
	routeSelected: string;
	profileName: any;
	isReceiver: boolean = false;
	profileLoader: boolean = false;
	panelOpenState = false;
	@Input() accountRoute = '';
	@Output() newItemEvent = new EventEmitter<string>();
	selectedRouteName: string = '';
	constructor(
		private _route: ActivatedRoute,
		private _profileService: ProfileService,
		public accountService: AccountService
	) {
		this.routeSelected = this.accountRoute;
		this.sub = this._route.data.subscribe(
			(v) => (this.routeSelected = v.route)
		);

		switch (this.routeSelected) {
			case 'api':
				this.selectedRouteName = $localize`:@@profile_apiKey_label:API Key`;
				break;
			case 'account':
				this.selectedRouteName = $localize`:@@profile_personalDetails_label:Personal Details`;
				break;
			case 'payout-settings':
				this.selectedRouteName = $localize`:@@profile_payoutSettings:Payout Settings`;
				break;
			case 'email':
				this.selectedRouteName = $localize`:@@profile_emailSettings_label:Email Settings`;
				break;
			case 'deactivate':
				this.selectedRouteName = $localize`:@@profile_deactivateAccount_label:Deactive Account`;
				break;
		}
		console.log('VVVVV', this.selectedRouteName);
		this.profile_routes = [
			{
				name: $localize`:@@profile_personalDetails_label:Personal Details`,
				route: 'account',
			},
			{
				name: $localize`:@@profile_payoutSettings:Payout Settings`,
				route: 'payout-settings',
			},
			{ name: $localize`:@@profile_apiKey_label:API Key`, route: 'api' },
			{
				name: $localize`:@@profile_emailSettings_label:Email Settings`,
				route: 'email',
			},
			{
				name: $localize`:@@profile_deactivateAccount_label:Deactive Account`,
				route: 'deactivate',
			},
		];
	}

	ngOnInit(): void {
		this.profileLoader = true;
		if (this.accountService.checkHeaders()) {
			this.getUserProfile();
		}
	}

	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.complete();
	}
	getUserProfile() {
		if (this.accountService.checkHeaders()) {
			this._profileService
				.getProfile()
				.pipe(takeUntil(this._unsubscribeAll)) // Unsubscribe
				.subscribe((profile: any) => {
					// Update the profile
					this.profile = profile;
					this.profileName = profile.data?.profile?.name;
					this.isReceiver = profile.data?.profile?.is_receiver;

					this._profileService.getDonationCount().subscribe((res: any) => {
						if (
							this.isReceiver == true &&
							res?.data?.first_donation_received == 1
						) {
						} else {
							const index = this.profile_routes.findIndex(
								(item: any) => item.route === 'personal-verification'
							);

							if (index !== -1) {
								this.profile_routes.splice(index, 1);
							}
						}
					});
					if (!this.isReceiver) {
						const index = this.profile_routes.findIndex(
							(item: any) => item.route === 'payout-settings'
						);

						if (index !== -1) {
							this.profile_routes.splice(index, 1);
						}
					}
					this.profileLoader = false;
					// Update the the profile image
					this.profileImage = profile.data?.profile?.image;
				});
		}
	}

	addNewItem(value: string) {
		this.newItemEvent.emit(value);
	}
}
