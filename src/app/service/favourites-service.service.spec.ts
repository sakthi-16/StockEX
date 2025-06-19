import { TestBed } from '@angular/core/testing';

import { FavouritesServiceService } from './favourites-service.service';

describe('FavouritesServiceService', () => {
  let service: FavouritesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavouritesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
