import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupStartFundraiserComponent } from './popup-start-fundraiser.component';

describe('PopupStartFundraiserComponent', () => {
  let component: PopupStartFundraiserComponent;
  let fixture: ComponentFixture<PopupStartFundraiserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupStartFundraiserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupStartFundraiserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
