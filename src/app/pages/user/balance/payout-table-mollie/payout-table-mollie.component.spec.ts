import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutTableMollieComponent } from './payout-table-mollie.component';

describe('PayoutTableMollieComponent', () => {
  let component: PayoutTableMollieComponent;
  let fixture: ComponentFixture<PayoutTableMollieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayoutTableMollieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayoutTableMollieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
