import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/global/guards/auth-guard';
import { BalanceComponent } from './balance.component';
/** *Balance Module Routes */
const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: BalanceComponent,
		canActivate: [AuthGuard],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class BalanceRoutingModule {}
