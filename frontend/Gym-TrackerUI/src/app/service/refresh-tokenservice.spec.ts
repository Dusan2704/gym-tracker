import { TestBed } from '@angular/core/testing';

import { RefreshTokenservice } from './refresh-tokenservice';

describe('RefreshTokenservice', () => {
  let service: RefreshTokenservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefreshTokenservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
