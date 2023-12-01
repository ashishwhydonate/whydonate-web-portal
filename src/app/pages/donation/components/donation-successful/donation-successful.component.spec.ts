import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonationSuccessfulComponent } from './donation-successful.component';


describe('DonationSuccessfulComponent', () => {
  let component: DonationSuccessfulComponent;
  let fixture: ComponentFixture<DonationSuccessfulComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationSuccessfulComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationSuccessfulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
