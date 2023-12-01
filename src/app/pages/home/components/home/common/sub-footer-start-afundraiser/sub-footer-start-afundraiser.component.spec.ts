import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubFooterStartAFundraiserComponent } from './sub-footer-start-afundraiser.component';

describe('SubFooterStartAFundraiserComponent', () => {
  let component: SubFooterStartAFundraiserComponent;
  let fixture: ComponentFixture<SubFooterStartAFundraiserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubFooterStartAFundraiserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubFooterStartAFundraiserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
