import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadImageVideoPopUpComponent } from './upload-image-video-pop-up.component';

describe('UploadImageVideoPopUpComponent', () => {
  let component: UploadImageVideoPopUpComponent;
  let fixture: ComponentFixture<UploadImageVideoPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadImageVideoPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadImageVideoPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
