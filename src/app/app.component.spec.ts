import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './global/components/footer/footer.component';
import { HeaderComponent } from './global/components/header/header.component';
import { PageNotFoundComponent } from './global/components/page-not-found/page-not-found.component';
import { SharedModule } from './shared/shared.module';

/**
 * IMPORT NECESSARY COMPONENTS
 */
describe('AppComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterTestingModule, MaterialModule, SharedModule],
			declarations: [
				AppComponent,
				HeaderComponent,
				FooterComponent,
				PageNotFoundComponent,
			],
		}).compileComponents();
	});

	/**
	 * *CHECK IF APP COMPONENT IS CREATED
	 */

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});

	/**
	 *CHECK IF RIGHT TITLE IS LOADED
	 */

	it(`should have as title 'WhyDonate: Personal Crowdfunding and Charity Fundraising'`, () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.componentInstance;
		expect(app.title).toEqual(
			'WhyDonate: Personal Crowdfunding and Charity Fundraising'
		);
	});

	/**
	 * CHECK IF HEADER IS LOADED
	 */

	it(`should have a header`, () => {
		const fixture = TestBed.createComponent(AppComponent);
		const header = fixture.debugElement.query(By.css('#header'));
		expect(header).toBeTruthy();
	});

	/**
	 *CHECK IF FOOTER IS LOADED
	 */
	it(`should have a footer`, () => {
		const fixture = TestBed.createComponent(AppComponent);
		const footer = fixture.debugElement.query(By.css('#footer'));
		expect(footer).toBeTruthy();
	});
});
