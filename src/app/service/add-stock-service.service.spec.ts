import { TestBed } from '@angular/core/testing';

import { AddStockServiceService } from './add-stock-service.service';

describe('AddStockServiceService', () => {
  let service: AddStockServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddStockServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
