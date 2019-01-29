import { TestBed, async, inject } from '@angular/core/testing';

import { IrradiationInProcessGuard } from './irradiation-in-process.guard';

describe('IrradiationInProcessGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IrradiationInProcessGuard]
    });
  });

  it('should ...', inject([IrradiationInProcessGuard], (guard: IrradiationInProcessGuard) => {
    expect(guard).toBeTruthy();
  }));
});
