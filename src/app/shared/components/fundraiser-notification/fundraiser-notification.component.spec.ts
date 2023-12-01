import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundraiserNotificationComponent } from './fundraiser-notification.component';

describe('FundraiserNotificationComponent', () => {
  let component: FundraiserNotificationComponent;
  let fixture: ComponentFixture<FundraiserNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundraiserNotificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundraiserNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
