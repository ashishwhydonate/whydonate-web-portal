import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundraiserContactComponent } from './fundraiser-contact.component';

describe('FundraiserContactComponent', () => {
  let component: FundraiserContactComponent;
  let fixture: ComponentFixture<FundraiserContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundraiserContactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundraiserContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
