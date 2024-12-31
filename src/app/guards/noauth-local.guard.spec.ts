import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { noauthLocalGuard } from './noauth-local.guard';

describe('noauthLocalGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => noauthLocalGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
