import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutSummaryComponent } from './payout-summary.component';

describe('PayoutSummaryComponent', () => {
  let component: PayoutSummaryComponent;
  let fixture: ComponentFixture<PayoutSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayoutSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayoutSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
