import { TestBed } from '@angular/core/testing';

import { TransactionStatusService } from './transaction-status-service.service';

describe('TransactionStatusServiceService', () => {
  let service: TransactionStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
