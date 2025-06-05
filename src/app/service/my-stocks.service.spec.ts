import { TestBed } from '@angular/core/testing';

import { MyStocksService } from './my-stocks.service';

describe('MyStocksService', () => {
  let service: MyStocksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyStocksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
