import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/global/guards/auth-guard';
import { MyFundraisersComponent } from './components/my-fundraisers/my-fundraisers.component';
/** *My Fundraisers Routing Component */
const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: MyFundraisersComponent,
		canActivate: [AuthGuard],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class MyFundraisersRoutingModule {}
