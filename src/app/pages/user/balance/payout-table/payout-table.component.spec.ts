import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutTableComponent } from './payout-table.component';

describe('PayoutTableComponent', () => {
  let component: PayoutTableComponent;
  let fixture: ComponentFixture<PayoutTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayoutTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
