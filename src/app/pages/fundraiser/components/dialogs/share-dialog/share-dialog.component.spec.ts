import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatLegacyTabGroupHarness as MatTabGroupHarness } from '@angular/material/legacy-tabs/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ShareDialogComponent } from './share-dialog.component';

describe('ShareDialogComponent', () => {
	let component: ShareDialogComponent;
	let fixture: ComponentFixture<ShareDialogComponent>;
	let loader: HarnessLoader;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatTabsModule, NoopAnimationsModule],
			declarations: [ShareDialogComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ShareDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		loader = TestbedHarnessEnvironment.loader(fixture);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should load harness for tab-group', async () => {
		const tabGroups = await loader.getAllHarnesses(MatTabGroupHarness);
		expect(tabGroups.length).toBe(1);
	});

	it('should be able to get tabs of tab-group', async () => {
		const tabGroup = await loader.getHarness(MatTabGroupHarness);
		const tabs = await tabGroup.getTabs();
		expect(tabs.length).toBe(4);
	});
});
