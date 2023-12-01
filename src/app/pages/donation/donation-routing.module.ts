import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonationFormComponent } from './components/donation-page/donation-form/donation-form.component';
import { DonationPageComponent } from './components/donation-page/donation-page.component';
import { DonationReceiptComponent } from './components/donation-receipt/donation-receipt.component';
import { DonationSuccessfulComponent } from './components/donation-successful/donation-successful.component';
import { ShareContributionComponent } from './components/share-contribution/share-contribution.component';
import { StripeComponent } from './components/check-payment-status/stripe/stripe.component';
import { OppComponent } from './components/check-payment-status/opp/opp.component';
import { PageNotFoundComponent } from 'src/app/global/components/page-not-found/page-not-found.component';
/** *Donation Routing Module */
const routes: Routes = [
	{
		path: 'check-payment-status/opp/:slug',
		pathMatch: 'full',
		component: OppComponent,
	},
  {
		path: 'check-payment-status/stripe/:slug',
		pathMatch: 'full',
		component: StripeComponent,
	},
	{
		path: 'successful/:slug',
		pathMatch: 'full',
		component: DonationSuccessfulComponent,
	},
	{
		path: 'receipt/download',
		component: DonationReceiptComponent,
	},
	{
		path: 'share/:slug',
		component: ShareContributionComponent,
	},

	{
		path: ':slug',
		pathMatch: 'full',
		component: DonationPageComponent,
	},
	
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DonationRoutingModule {}
