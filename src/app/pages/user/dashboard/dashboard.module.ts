import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { ProfileViewComponent } from './components/dashboard/profile-view/profile-view.component';
import { MyFundraisersViewComponent } from './components/dashboard/my-fundraisers-view/my-fundraisers-view.component';
import { DonationSummaryComponent } from './components/dashboard/donation-summary/donation-summary.component';
import { GivenDonationComponent } from './components/dashboard/donation-summary/given-donation/given-donation.component';
import { RecurringReceivedDonationComponent } from './components/dashboard/donation-summary/recurring-received-donation/recurring-received-donation.component';
import { ReceivedDonationComponent } from './components/dashboard/donation-summary/received-donation/received-donation.component';
import { RecurringGivenDonationComponent } from './components/dashboard/donation-summary/recurring-given-donation/recurring-given-donation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatTableExporterModule } from 'mat-table-exporter';
import { AccountViewComponent } from './components/dashboard/account-view/account-view.component';
import { StopRecurringDonationComponent } from './components/dashboard/donation-summary/stop-recurring-donation/stop-recurring-donation/stop-recurring-donation.component';
import { UsermessageStopComponent } from './components/dashboard/donation-summary/usermessage-stop/usermessage-stop.component';
import { UsermessageCancelComponent } from './components/dashboard/donation-summary/usermessage-cancel/usermessage-cancel.component';
import { SummariesComponent } from './components/dashboard/summaries/summaries.component';
import { PayoutSummaryComponent } from './components/dashboard/payout-summary/payout-summary.component';

/** *Dashboard Module */
@NgModule({
	declarations: [
		DashboardComponent,
		ProfileViewComponent,
		MyFundraisersViewComponent,
		DonationSummaryComponent,
		GivenDonationComponent,
		RecurringReceivedDonationComponent,
		SummariesComponent,
		ReceivedDonationComponent,
		RecurringGivenDonationComponent,
		AccountViewComponent,
		StopRecurringDonationComponent,
		UsermessageStopComponent,
		UsermessageCancelComponent,
		PayoutSummaryComponent,
	],
	imports: [
		CommonModule,
		DashboardRoutingModule,
		SharedModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
	],
})
export class DashboardModule {}
