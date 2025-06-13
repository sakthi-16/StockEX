import { TestBed } from '@angular/core/testing';

import { UpdateStockPriceServiceService } from './update-stock-price-service.service';

describe('UpdateStockPriceServiceService', () => {
  let service: UpdateStockPriceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateStockPriceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
