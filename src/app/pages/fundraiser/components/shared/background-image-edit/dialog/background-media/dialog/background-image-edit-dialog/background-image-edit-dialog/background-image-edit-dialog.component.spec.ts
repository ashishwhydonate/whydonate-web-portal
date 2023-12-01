import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundImageEditDialogComponent } from './background-image-edit-dialog.component';

describe('BackgroundImageEditDialogComponent', () => {
  let component: BackgroundImageEditDialogComponent;
  let fixture: ComponentFixture<BackgroundImageEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackgroundImageEditDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackgroundImageEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
