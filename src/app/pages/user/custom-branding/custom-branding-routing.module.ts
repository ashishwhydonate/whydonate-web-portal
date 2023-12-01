import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/global/guards/auth-guard';

import { CustomBrandingComponent } from './components/custom-branding/custom-branding.component';
import { EmailComponent } from './components/custom-branding/email/email.component';
import { ReceiptComponent } from './components/custom-branding/receipt/receipt.component';
/** *Custom Branding Routing Module */

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: CustomBrandingComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'email',
		component: EmailComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'receipt',
		component: ReceiptComponent,
		canActivate: [AuthGuard],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class CustomBrandingRoutingModule {}
