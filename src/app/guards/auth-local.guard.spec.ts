import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authLocalGuard } from './auth-local.guard';

describe('authLocalGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authLocalGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
