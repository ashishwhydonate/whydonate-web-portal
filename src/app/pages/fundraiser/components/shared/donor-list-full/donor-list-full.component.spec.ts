import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorListFullComponent } from './donor-list-full.component';

describe('DonorListFullComponent', () => {
  let component: DonorListFullComponent;
  let fixture: ComponentFixture<DonorListFullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonorListFullComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorListFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
