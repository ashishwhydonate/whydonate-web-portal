import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripePromptComponent } from './stripe-prompt.component';

describe('StripePromptComponent', () => {
  let component: StripePromptComponent;
  let fixture: ComponentFixture<StripePromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StripePromptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StripePromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
