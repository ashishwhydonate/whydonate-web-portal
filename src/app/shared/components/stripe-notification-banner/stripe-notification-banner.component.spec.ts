import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeNotificationBannerComponent } from './stripe-notification-banner.component';

describe('StripeNotificationBannerComponent', () => {
  let component: StripeNotificationBannerComponent;
  let fixture: ComponentFixture<StripeNotificationBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StripeNotificationBannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StripeNotificationBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
