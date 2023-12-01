import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundraisingSiteComponent } from './fundraising-site.component';

describe('FundraisingSiteComponent', () => {
  let component: FundraisingSiteComponent;
  let fixture: ComponentFixture<FundraisingSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundraisingSiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FundraisingSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
