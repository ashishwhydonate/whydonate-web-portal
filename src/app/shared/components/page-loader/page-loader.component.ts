/** This component is recalled in mostly all components and defines page layout */
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-page-loader',
	templateUrl: './page-loader.component.html',
	styleUrls: ['./page-loader.component.scss'],
})
//** *Page Loader Component */
export class PageLoaderComponent implements OnInit {
	constructor() {}
	
	ngOnInit(): void {}
}
