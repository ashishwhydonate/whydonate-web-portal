import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutSettingsComponent } from './payout-settings.component';

describe('PayoutSettingsComponent', () => {
  let component: PayoutSettingsComponent;
  let fixture: ComponentFixture<PayoutSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayoutSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayoutSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
