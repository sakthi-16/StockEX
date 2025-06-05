import { TestBed } from '@angular/core/testing';

import { AccountAdditionService } from './account-addition-service.service';

describe('AccountAdditionServiceService', () => {
  let service: AccountAdditionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountAdditionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
