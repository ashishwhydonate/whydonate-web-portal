import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeSignUpButtonComponent } from './free-sign-up-button.component';

describe('FreeSignUpButtonComponent', () => {
  let component: FreeSignUpButtonComponent;
  let fixture: ComponentFixture<FreeSignUpButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreeSignUpButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeSignUpButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
