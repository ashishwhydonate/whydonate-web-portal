import {
    HttpClientTestingModule
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginComponent } from './login.component';


describe('LoginComponent', () => {
	let component: LoginComponent;
	let fixture: ComponentFixture<LoginComponent>;
	let router: Router;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
				MaterialModule,
				SharedModule,
				HttpClientTestingModule,
				BrowserAnimationsModule,
			],
			declarations: [LoginComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		router = TestBed.inject(Router);
		router.navigate(['account']);
		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create login component', () => {
		expect(component).toBeTruthy();
	});
});
