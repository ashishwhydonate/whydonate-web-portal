import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturesAndWhyWhydonateComponent } from './features-and-why-whydonate.component';

describe('FeaturesAndWhyWhydonateComponent', () => {
  let component: FeaturesAndWhyWhydonateComponent;
  let fixture: ComponentFixture<FeaturesAndWhyWhydonateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeaturesAndWhyWhydonateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturesAndWhyWhydonateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
