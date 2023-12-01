import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from  '@angular/common/http';

@Component({
	selector: 'app-logo-app-links',
	templateUrl: './logo-app-links.component.html',
	styleUrls: ['../footer.component.scss'],
})
/** *Logo App Links Component Component */
export class LogoAppLinksComponent implements OnInit {
	constructor(
		private http: HttpClientModule
		) {}
	ngOnInit(): void {}
}
