import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationBannerComponent } from './organisation-banner.component';

describe('OrganisationBannerComponent', () => {
  let component: OrganisationBannerComponent;
  let fixture: ComponentFixture<OrganisationBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
