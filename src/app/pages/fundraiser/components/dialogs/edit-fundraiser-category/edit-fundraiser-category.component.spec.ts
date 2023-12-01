import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFundraiserCategoryComponent } from './edit-fundraiser-category.component';

describe('EditFundraiserCategoryComponent', () => {
  let component: EditFundraiserCategoryComponent;
  let fixture: ComponentFixture<EditFundraiserCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFundraiserCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFundraiserCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
