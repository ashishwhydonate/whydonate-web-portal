import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundraiserPreviewComponent } from './fundraiser-preview.component';

describe('FundraiserPreviewComponent', () => {
  let component: FundraiserPreviewComponent;
  let fixture: ComponentFixture<FundraiserPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundraiserPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FundraiserPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
