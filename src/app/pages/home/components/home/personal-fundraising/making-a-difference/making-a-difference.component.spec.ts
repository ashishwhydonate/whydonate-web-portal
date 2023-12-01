import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakingADifferenceComponent } from './making-a-difference.component';

describe('MakingADifferenceComponent', () => {
  let component: MakingADifferenceComponent;
  let fixture: ComponentFixture<MakingADifferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakingADifferenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakingADifferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
