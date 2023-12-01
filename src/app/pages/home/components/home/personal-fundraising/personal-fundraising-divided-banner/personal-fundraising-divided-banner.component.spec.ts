import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalFundraisingDividedBannerComponent } from './personal-fundraising-divided-banner.component';

describe('PersonalFundraisingDividedBannerComponent', () => {
  let component: PersonalFundraisingDividedBannerComponent;
  let fixture: ComponentFixture<PersonalFundraisingDividedBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalFundraisingDividedBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalFundraisingDividedBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
