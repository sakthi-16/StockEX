import { TestBed } from '@angular/core/testing';
import { LoggedGuard } from './logged.guard';
import { Router } from '@angular/router';

describe('LoggedGuard', () => {
  let guard: LoggedGuard;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        LoggedGuard,
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(LoggedGuard);
  });

  it('should allow access when token is not in localStorage (user not logged in)', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    const result = guard.canActivate();

    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and redirect when token exists in localStorage (user is logged in)', () => {
    spyOn(localStorage, 'getItem').and.returnValue('mock-token');

    const result = guard.canActivate();

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/app-show-stocks']);
  });
});
