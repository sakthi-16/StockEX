import { TestBed } from '@angular/core/testing';

import { AccountDepositWithdrawServiceService } from './account-deposit-withdraw-service.service';

describe('AccountDepositWithdrawServiceService', () => {
  let service: AccountDepositWithdrawServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountDepositWithdrawServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
