import { TestBed } from '@angular/core/testing';

import { MyProfileService } from './my-profile-service.service';

describe('MyProfileServiceService', () => {
  let service: MyProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
