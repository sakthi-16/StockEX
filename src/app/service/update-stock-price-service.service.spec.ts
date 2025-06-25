import { TestBed } from '@angular/core/testing';

import { UpdateStockService } from './update-stock-price-service.service';

describe('UpdateStockPriceServiceService', () => {
  let service: UpdateStockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateStockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
