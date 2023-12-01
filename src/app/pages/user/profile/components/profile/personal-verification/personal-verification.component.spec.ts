import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalVerificationComponent } from './personal-verification.component';

describe('PersonalVerificationComponent', () => {
  let component: PersonalVerificationComponent;
  let fixture: ComponentFixture<PersonalVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
