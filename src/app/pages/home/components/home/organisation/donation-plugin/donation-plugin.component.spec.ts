import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationPluginComponent } from './donation-plugin.component';

describe('DonationPluginComponent', () => {
  let component: DonationPluginComponent;
  let fixture: ComponentFixture<DonationPluginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationPluginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationPluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
