import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopRecurringDonationComponent } from './stop-recurring-donation.component';

describe('StopRecurringDonationComponent', () => {
  let component: StopRecurringDonationComponent;
  let fixture: ComponentFixture<StopRecurringDonationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StopRecurringDonationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StopRecurringDonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
