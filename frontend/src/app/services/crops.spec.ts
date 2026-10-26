import { TestBed } from '@angular/core/testing';

import { Crops } from './crops';

describe('Crops', () => {
  let service: Crops;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Crops);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
