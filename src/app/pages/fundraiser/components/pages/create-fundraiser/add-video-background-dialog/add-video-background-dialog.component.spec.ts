import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVideoBackgroundDialogComponent } from './add-video-background-dialog.component';

describe('AddVideoBackgroundDialogComponent', () => {
  let component: AddVideoBackgroundDialogComponent;
  let fixture: ComponentFixture<AddVideoBackgroundDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVideoBackgroundDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVideoBackgroundDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
