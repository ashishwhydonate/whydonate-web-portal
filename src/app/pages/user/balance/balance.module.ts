import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BalanceRoutingModule } from './balance-routing.module';
import { BalanceComponent } from './balance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
// import { MatTableExporterModule } from 'mat-table-exporter';
import { MaterialModule } from 'src/app/material.module';
import { PayoutPopupComponent } from './payout-popup/payout-popup.component';
import { PayoutTableComponent } from './payout-table/payout-table.component';
import { PayoutTableMollieComponent } from './payout-table-mollie/payout-table-mollie.component';
import { PayoutStripeComponent } from './payout-stripe/payout-stripe.component';
/** *Balance Module */
@NgModule({
	declarations: [BalanceComponent, PayoutPopupComponent, PayoutTableComponent, PayoutTableMollieComponent, PayoutStripeComponent],
	imports: [
		CommonModule,
		BalanceRoutingModule,
		SharedModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
	],
})
export class BalanceModule {}
