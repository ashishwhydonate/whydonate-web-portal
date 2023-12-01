import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/global/guards/auth-guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
/** *Dashboard Routing Module */

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
    canActivate: [AuthGuard],
		component: DashboardComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DashboardRoutingModule {}
