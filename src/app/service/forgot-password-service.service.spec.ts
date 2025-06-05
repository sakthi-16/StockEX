import { TestBed } from '@angular/core/testing';

import { ForgotPasswordServiceService } from './forgot-password-service.service';

describe('ForgotPasswordServiceService', () => {
  let service: ForgotPasswordServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForgotPasswordServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
