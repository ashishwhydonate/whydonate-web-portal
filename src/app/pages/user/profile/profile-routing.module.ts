import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { AccountComponent } from './components/profile/account/account.component';
import { BankComponent } from './components/profile/bank/bank.component';
import { ApiKeyComponent } from './components/profile/api-key/api-key.component';
import { EmailComponent } from './components/profile/email/email.component';
import { AuthGuard } from 'src/app/global/guards/auth-guard';
import { PersonalVerificationComponent } from './components/profile/personal-verification/personal-verification.component';
import { PayoutSettingsComponent } from './components/profile/payout/payout-settings/payout-settings.component';
/** *Profile Module Routes*/
const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'account',
	},
	{
		path: 'account',
		component: ProfileComponent,
		children: [{ path: '', component: AccountComponent }],
		data: { route: 'account' },
		canActivate: [AuthGuard],
	},
	{
		path: 'bank',
		component: ProfileComponent,
		children: [{ path: '', component: BankComponent }],
		data: { route: 'bank' },
		canActivate: [AuthGuard],
	},
	{
		path: 'personal-verification',
		component: ProfileComponent,
		children: [{ path: '', component: PersonalVerificationComponent }],
		data: { route: 'personal-verification' },
		canActivate: [AuthGuard],
	},
	{
		path: 'api',
		component: ProfileComponent,
		children: [{ path: '', component: ApiKeyComponent }],
		data: { route: 'api' },
		canActivate: [AuthGuard],
	},
	{
		path: 'email',
		component: ProfileComponent,
		children: [{ path: '', component: EmailComponent }],
		data: { route: 'email' },
		canActivate: [AuthGuard],
	},

	{
		path: 'payout-settings',
		component: ProfileComponent,
		children: [{ path: '', component: PayoutSettingsComponent }],
		data: { route: 'payout-settings' },
		canActivate: [AuthGuard],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ProfileRoutingModule {}
