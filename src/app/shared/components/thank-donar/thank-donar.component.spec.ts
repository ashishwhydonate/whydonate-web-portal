import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankDonarComponent } from './thank-donar.component';

describe('ThankDonarComponent', () => {
  let component: ThankDonarComponent;
  let fixture: ComponentFixture<ThankDonarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThankDonarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThankDonarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
