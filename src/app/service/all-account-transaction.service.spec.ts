import { TestBed } from '@angular/core/testing';

import { AllAccountService } from './all-account-transaction.service';

describe('AllAccountTransactionService', () => {
  let service: AllAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
