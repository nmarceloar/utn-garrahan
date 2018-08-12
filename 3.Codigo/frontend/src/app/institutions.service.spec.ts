import { TestBed, inject } from '@angular/core/testing';

import { InstitutionsService } from './institutions.service';

describe('InstitutionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InstitutionsService]
    });
  });

  it('should be created', inject([InstitutionsService], (service: InstitutionsService) => {
    expect(service).toBeTruthy();
  }));
});
