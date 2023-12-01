import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './global/components/page-not-found/page-not-found.component';

/**
 * This Application uses lazy loading for all the internal modules.
 */

export const routes: Routes = [
	/**
	 *Default route should always serve home page
	 */
	{
		path: '',
		loadChildren: () =>
			import('./pages/home/home.module').then((m) => m.HomeModule),
	},
	/**
	 * Account Module
	 */
	{
		path: 'account',
		loadChildren: () =>
			import('./pages/account/account.module').then((m) => m.AccountModule),
	},
	/**
	 * Redirect to login/register component of account Module
	 */
	{ path: 'login', redirectTo: 'account/login', pathMatch: 'full' },
	{ path: 'register', redirectTo: 'account/register', pathMatch: 'full' },
	/**
	 * Fundraiser Module
	 */
	{
		path: 'fundraising',
		loadChildren: () =>
			import('./pages/fundraiser/fundraiser.module').then(
				(m) => m.FundraiserModule
			),
	},
	/**
	 * Redirect to Create component of Fundraiser Module
	 */
	{ path: 'create', redirectTo: 'fundraising/create', pathMatch: 'full' },
	/**
	 * Search Module
	 */
	{
		path: 'search',
		loadChildren: () =>
			import('./pages/search/search.module').then((m) => m.SearchModule),
	},
	/**
	 * Donation Module
	 */
	{
		path: 'donate',
		loadChildren: () =>
			import('./pages/donation/donation.module').then((m) => m.DonationModule),
	},
	/**
	 * Profile Module
	 */
	{
		path: 'profile',
		loadChildren: () =>
			import('./pages/user/profile/profile.module').then(
				(m) => m.ProfileModule
			),
	},
	/**
	 * Dashboard Module
	 */
	{
		path: 'dashboard',
		loadChildren: () =>
			import('./pages/user/dashboard/dashboard.module').then(
				(m) => m.DashboardModule
			),
	},
	/**
	 * My Fundraisers Module
	 */
	{
		path: 'my-fundraisers',
		loadChildren: () =>
			import('./pages/user/my-fundraisers/my-fundraisers.module').then(
				(m) => m.MyFundraisersModule
			),
	},
	/**
	 * Custom Branding Module
	 */
	{
		path: 'custom-branding',
		loadChildren: () =>
			import('./pages/user/custom-branding/custom-branding.module').then(
				(m) => m.CustomBrandingModule
			),
	},
	/**
	 * Balance Module
	 */
	{
		path: 'balance',
		loadChildren: () =>
			import('./pages/user/balance/balance.module').then(
				(m) => m.BalanceModule
			),
	},
	/**
	 * Error page
	 */
	{
		path: '**',
		pathMatch: 'full',
		component: PageNotFoundComponent,
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			scrollPositionRestoration: 'enabled',
			initialNavigation: 'enabledBlocking',
		}),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
