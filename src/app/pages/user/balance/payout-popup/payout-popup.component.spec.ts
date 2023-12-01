import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutPopupComponent } from './payout-popup.component';

describe('PayoutPopupComponent', () => {
  let component: PayoutPopupComponent;
  let fixture: ComponentFixture<PayoutPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayoutPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
