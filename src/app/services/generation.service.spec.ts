import { TestBed, inject } from '@angular/core/testing';

import { GenerationService } from './generation.service';

describe('GenerationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GenerationService]
    });
  });

  it('should be created', inject([GenerationService], (service: GenerationService) => {
    expect(service).toBeTruthy();
  }));
});
