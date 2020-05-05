import { TestBed } from '@angular/core/testing';

import { PickService } from './pick.service';

describe('PickService', () => {
  let service: PickService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PickService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
