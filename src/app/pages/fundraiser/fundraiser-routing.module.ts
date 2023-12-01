import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FundraiserComponent } from './components/fundraiser.component';
import { CustomDonationFormComponent } from './components/pages/custom-donation-form/custom-donation-form.component';
import { ConnectFundraiserComponent } from './components/pages/connect-fundraiser/connect-fundraiser.component';
import { fundraiserNotfoundhandlerComponent } from './components/pages/fundraiser-not-found-handler/fundraiser-not-found-handler.component';
import { fundraiserIsDraftComponent } from './components/pages/fundraiser-is-draft/fundraiser-is-draft.component';
import { CreateFundraiserComponent } from './components/pages/create-fundraiser/create-fundraiser.component';
import { AuthGuard } from 'src/app/global/guards/auth-guard';
import { StripePromptComponent } from 'src/app/shared/components/stripe-prompt/stripe-prompt.component';
import { PageNotFoundComponent } from 'src/app/global/components/page-not-found/page-not-found.component';
/** *Fundraiser Routing Module */

const routes: Routes = [
	{
		path: 'fundraiser-not-found',
		component: fundraiserNotfoundhandlerComponent,
	},
	{
		path: 'fundraiser-is-draft',
		component: fundraiserIsDraftComponent,
	},
	{
		path: 'create',
		component: CreateFundraiserComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'stripe-prompt',
		component: StripePromptComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'connect/:slug',
		component: ConnectFundraiserComponent,
		canActivate: [AuthGuard],
	},
	{
		path: ':slug',
		component: FundraiserComponent,
	},
	{
		path: 'donation-amount/:slug',
		component: CustomDonationFormComponent,
		canActivate: [AuthGuard],
	},
	
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class FundraiserRoutingModule {}
