import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmationComponent } from './dialog-confirmation.component';

describe('DialogComponent', () => {
	let component: DialogConfirmationComponent;
	let fixture: ComponentFixture<DialogConfirmationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [DialogConfirmationComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DialogConfirmationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});