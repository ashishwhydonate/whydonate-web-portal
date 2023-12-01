import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationFormComponent } from './components/registration/registration-form/registration-form.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { DeactivatedAccountComponent } from './components/deactivated-account/deactivated-account.component';
import { RegistrationCompleteComponent } from './components/registration/registration-complete/registration-complete.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { PageNotFoundComponent } from 'src/app/global/components/page-not-found/page-not-found.component';
/** *Account Routing Module */

const routes: Routes = [
	{
		path: 'reset_password',
		component: ResetPasswordComponent,
	},
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'login',
	},
	{
		path: 'login',
		component: LoginComponent,
	},
	{
		path: 'register',
		component: RegistrationFormComponent,
	},
	{
		path: 'registration-complete',
		component: RegistrationCompleteComponent,
	},
	{
		path: 'email-verification',
		component: EmailVerificationComponent,
	},
	{
		path: 'forgot-password',
		component: ForgotPasswordComponent,
	},
	{
		path: 'deactivated',
		component: DeactivatedAccountComponent,
	},
	
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AccountRoutingModule {}
