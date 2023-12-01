import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyButtonHarness as MatButtonHarness } from '@angular/material/legacy-button/testing';
import { PaymentRequestComponent } from './payment-request.component';


describe('PaymentRequestComponent', () => {
	let component: PaymentRequestComponent;
	let fixture: ComponentFixture<PaymentRequestComponent>;
	let loader: HarnessLoader;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatButtonModule],
			declarations: [PaymentRequestComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(PaymentRequestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		loader = TestbedHarnessEnvironment.loader(fixture);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should load all button harnesses', async () => {
		const buttons = await loader.getAllHarnesses(MatButtonHarness);
		expect(buttons.length).toBe(5);
	});
});
