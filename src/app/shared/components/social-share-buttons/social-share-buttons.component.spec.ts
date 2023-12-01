import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialShareButtonsComponent } from './social-share-buttons.component';

describe('SocialShareButtonsComponent', () => {
  let component: SocialShareButtonsComponent;
  let fixture: ComponentFixture<SocialShareButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialShareButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialShareButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
