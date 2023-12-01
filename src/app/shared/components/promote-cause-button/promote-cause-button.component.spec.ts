import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoteCauseButtonComponent } from './promote-cause-button.component';

describe('PromoteCauseButtonComponent', () => {
  let component: PromoteCauseButtonComponent;
  let fixture: ComponentFixture<PromoteCauseButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromoteCauseButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoteCauseButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
