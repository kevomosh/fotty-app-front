import { TestBed } from '@angular/core/testing';

import { LoadingErrorService } from './loading-error.service';

describe('LoadingErrorService', () => {
  let service: LoadingErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
