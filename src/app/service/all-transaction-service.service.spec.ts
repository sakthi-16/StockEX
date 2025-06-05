import { TestBed } from '@angular/core/testing';

import { AllStocksTransactionsService } from './all-transaction-service.service';

describe('AllTransactionServiceService', () => {
  let service: AllStocksTransactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllStocksTransactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
