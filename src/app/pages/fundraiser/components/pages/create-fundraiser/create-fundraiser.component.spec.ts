import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFundraiserComponent } from './create-fundraiser.component';

describe('CreateFundraiserComponent', () => {
  let component: CreateFundraiserComponent;
  let fixture: ComponentFixture<CreateFundraiserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFundraiserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFundraiserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
