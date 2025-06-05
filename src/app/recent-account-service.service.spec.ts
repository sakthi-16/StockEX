import { TestBed } from '@angular/core/testing';

import { RecentAccountServiceService } from './recent-account-service.service';

describe('RecentAccountServiceService', () => {
  let service: RecentAccountServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecentAccountServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
