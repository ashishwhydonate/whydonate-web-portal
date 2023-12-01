import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchComponent } from './search.component';


describe('SearchComponent', () => {
	let component: SearchComponent;
	let fixture: ComponentFixture<SearchComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
				MaterialModule,
				SharedModule,
				HttpClientTestingModule,
				BrowserAnimationsModule,
			],
			declarations: [SearchComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SearchComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create search component', () => {
		expect(component).toBeTruthy();
	});

	it('should create search input', () => {
		let sideDrawer = fixture.debugElement.nativeElement;
		expect(sideDrawer.querySelector('#search-input')).toBeTruthy();
	});

	it('should create search side drawer', () => {
		let sideDrawer = fixture.debugElement.nativeElement;
		expect(sideDrawer.querySelector('#search-side-drawer')).toBeTruthy();
	});

	it('should create search results', () => {
		let sideDrawer = fixture.debugElement.nativeElement;
		expect(sideDrawer.querySelector('#search-results')).toBeTruthy();
	});
});
