import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalCollectionBoxComponent } from './digital-collection-box.component';

describe('DigitalCollectionBoxComponent', () => {
  let component: DigitalCollectionBoxComponent;
  let fixture: ComponentFixture<DigitalCollectionBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DigitalCollectionBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalCollectionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
