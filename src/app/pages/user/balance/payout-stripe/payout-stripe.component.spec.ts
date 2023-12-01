import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutStripeComponent } from './payout-stripe.component';

describe('PayoutStripeComponent', () => {
  let component: PayoutStripeComponent;
  let fixture: ComponentFixture<PayoutStripeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayoutStripeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayoutStripeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
