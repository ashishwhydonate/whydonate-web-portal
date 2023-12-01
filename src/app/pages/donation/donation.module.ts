import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonationPageComponent } from './components/donation-page/donation-page.component';
import { DonationFormComponent } from './components/donation-page/donation-form/donation-form.component';
import { DonationSuccessfulComponent } from './components/donation-successful/donation-successful.component';
import { DonationSuccessfulFormComponent } from './components/donation-successful/donation-successful-form/donation-successful-form.component';
import { DonationRoutingModule } from './donation-routing.module';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareContributionComponent } from './components/share-contribution/share-contribution.component';
import { CookieService } from 'ngx-cookie-service';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { DonationReceiptComponent } from './components/donation-receipt/donation-receipt.component';
import { TwoDigitDecimaNumberDirective } from './directives/number-two-decimal-places.directive';
import { StripeComponent } from './components/check-payment-status/stripe/stripe.component';
import { OppComponent } from './components/check-payment-status/opp/opp.component';
import { CurrencyListComponent } from 'src/app/pages/donation/components/currency-list/currency-list.component';
/** *Donation Module */
@NgModule({
	declarations: [
		DonationPageComponent,
		DonationFormComponent,
		DonationSuccessfulComponent,
		DonationSuccessfulFormComponent,
		ShareContributionComponent,
		NumbersOnlyDirective,
		TwoDigitDecimaNumberDirective,
		DonationReceiptComponent,
		StripeComponent,
		OppComponent,
		CurrencyListComponent,
	],
	imports: [
		CommonModule,
		DonationRoutingModule,
		MaterialModule,
		SharedModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
	],
	providers: [CookieService],
})
export class DonationModule {}
