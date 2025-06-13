import { TestBed } from '@angular/core/testing';

import { PaymentStatusServiceService } from './payment-status-service.service';

describe('PaymentStatusServiceService', () => {
  let service: PaymentStatusServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentStatusServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
