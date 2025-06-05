import { TestBed } from '@angular/core/testing';

import { SignupService } from './signup-service.service';

describe('SignupServiceService', () => {
  let service: SignupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
