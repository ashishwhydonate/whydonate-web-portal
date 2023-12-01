import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyFormFieldHarness as MatFormFieldHarness } from '@angular/material/legacy-form-field/testing';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EmbedComponent } from './embed.component';


describe('EmbedComponent', () => {
	let component: EmbedComponent;
	let fixture: ComponentFixture<EmbedComponent>;
	let loader: HarnessLoader;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				MatFormFieldModule,
				MatInputModule,
				ReactiveFormsModule,
				NoopAnimationsModule,
			],
			declarations: [EmbedComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(EmbedComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		loader = TestbedHarnessEnvironment.loader(fixture);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	it('should be able to load harnesses', async () => {
		const formFields = await loader.getAllHarnesses(MatFormFieldHarness);
		expect(formFields.length).toBe(3);
	});
});
