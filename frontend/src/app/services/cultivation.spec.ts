import { TestBed } from '@angular/core/testing';

import { Cultivation } from './cultivation';

describe('Cultivation', () => {
  let service: Cultivation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cultivation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
