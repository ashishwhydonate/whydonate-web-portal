import { TestBed } from '@angular/core/testing';

import { CustomBrandingService } from './custom-branding.service';

describe('CustomBrandingService', () => {
  let service: CustomBrandingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomBrandingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
