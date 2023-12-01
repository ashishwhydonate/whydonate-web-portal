import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartingAFundraiserComponent } from './starting-a-fundraiser.component';

describe('StartingAFundraiserComponent', () => {
  let component: StartingAFundraiserComponent;
  let fixture: ComponentFixture<StartingAFundraiserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartingAFundraiserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartingAFundraiserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
