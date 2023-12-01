import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonationSuccessfulFormComponent } from './donation-successful-form.component';


describe('DonationSuccessfulFormComponent', () => {
  let component: DonationSuccessfulFormComponent;
  let fixture: ComponentFixture<DonationSuccessfulFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationSuccessfulFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationSuccessfulFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
