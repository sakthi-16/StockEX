import { TestBed } from '@angular/core/testing';

import { AddStockService } from './add-stock-service.service';

describe('AddStockServiceService', () => {
  let service: AddStockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddStockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
