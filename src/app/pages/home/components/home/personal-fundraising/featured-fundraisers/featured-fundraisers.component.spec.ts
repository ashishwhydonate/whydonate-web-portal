import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedFundraisersComponent } from './featured-fundraisers.component';

describe('FeaturedFundraisersComponent', () => {
  let component: FeaturedFundraisersComponent;
  let fixture: ComponentFixture<FeaturedFundraisersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeaturedFundraisersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedFundraisersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
