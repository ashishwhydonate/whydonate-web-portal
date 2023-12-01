import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartFundraiserButtonComponent } from './start-fundraiser-button.component';

describe('StartFundraiserButtonComponent', () => {
  let component: StartFundraiserButtonComponent;
  let fixture: ComponentFixture<StartFundraiserButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartFundraiserButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartFundraiserButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
