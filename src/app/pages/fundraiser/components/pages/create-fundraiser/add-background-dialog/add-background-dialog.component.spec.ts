import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddBackgroundDialogComponent } from './add-background-dialog.component';


describe('AddBackgroundDialogComponent', () => {
  let component: AddBackgroundDialogComponent;
  let fixture: ComponentFixture<AddBackgroundDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBackgroundDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBackgroundDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
