import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundMediaComponent } from './background-media.component';

describe('BackgroundMediaComponent', () => {
  let component: BackgroundMediaComponent;
  let fixture: ComponentFixture<BackgroundMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackgroundMediaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackgroundMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
