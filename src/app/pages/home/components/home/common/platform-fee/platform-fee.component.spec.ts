import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformFeeComponent } from './platform-fee.component';

describe('PlatformFeeComponent', () => {
  let component: PlatformFeeComponent;
  let fixture: ComponentFixture<PlatformFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlatformFeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
