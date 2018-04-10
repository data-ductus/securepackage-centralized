import { TestBed, inject } from '@angular/core/testing';

import { GlobalvarsService } from './globalvars.service';

describe('GlobalvarsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalvarsService]
    });
  });

  it('should be created', inject([GlobalvarsService], (service: GlobalvarsService) => {
    expect(service).toBeTruthy();
  }));
});
