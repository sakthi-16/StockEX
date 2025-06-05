import { TestBed } from '@angular/core/testing';

import { RecentAccountTransactionService } from './recent-account-service.service';

describe('RecentStocksTransactionService', () => {
  let service: RecentAccountTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecentAccountTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
