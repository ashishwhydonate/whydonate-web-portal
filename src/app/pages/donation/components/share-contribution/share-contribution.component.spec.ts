import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShareContributionComponent } from './share-contribution.component';


describe('ShareContributionComponent', () => {
  let component: ShareContributionComponent;
  let fixture: ComponentFixture<ShareContributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareContributionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareContributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
