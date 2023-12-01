import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceComponent } from './balance.component';

describe('BalanceComponent', () => {
	let component: BalanceComponent;
	let fixture: ComponentFixture<BalanceComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BalanceComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(BalanceComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should called the get transaction and donation given ngOnInit', () => {
		component.ngOnInit();
		expect(component.getTransactionBalance).toHaveBeenCalled();
		expect(component.getDonationGiven).toHaveBeenCalled();
	});
});
