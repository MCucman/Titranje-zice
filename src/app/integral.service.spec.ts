import { TestBed } from '@angular/core/testing';

import { IntegralService } from './integral.service';

describe('IntegralService', () => {
  let service: IntegralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntegralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
