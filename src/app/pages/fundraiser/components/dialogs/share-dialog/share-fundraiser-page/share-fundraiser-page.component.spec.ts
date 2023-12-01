import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShareFundraiserPageComponent } from './share-fundraiser-page.component';


describe('ShareFundraiserPageComponent', () => {
  let component: ShareFundraiserPageComponent;
  let fixture: ComponentFixture<ShareFundraiserPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareFundraiserPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareFundraiserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
