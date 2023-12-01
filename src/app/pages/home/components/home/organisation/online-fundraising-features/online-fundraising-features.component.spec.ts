import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineFundraisingFeaturesComponent } from './online-fundraising-features.component';

describe('OnlineFundraisingFeaturesComponent', () => {
  let component: OnlineFundraisingFeaturesComponent;
  let fixture: ComponentFixture<OnlineFundraisingFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineFundraisingFeaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineFundraisingFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
