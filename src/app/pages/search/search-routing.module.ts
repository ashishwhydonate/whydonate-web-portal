import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { PageNotFoundComponent } from 'src/app/global/components/page-not-found/page-not-found.component';
/** *Search Module Routes */

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: SearchComponent,
	},
	
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SearchRoutingModule {}
