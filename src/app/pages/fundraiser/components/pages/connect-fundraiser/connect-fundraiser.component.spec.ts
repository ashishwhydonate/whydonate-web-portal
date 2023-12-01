import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectFundraiserComponent } from './connect-fundraiser.component';

describe('ConnectFundraiserComponent', () => {
  let component: ConnectFundraiserComponent;
  let fixture: ComponentFixture<ConnectFundraiserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectFundraiserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectFundraiserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
