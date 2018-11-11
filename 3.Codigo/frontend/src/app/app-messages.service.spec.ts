import { TestBed, inject } from '@angular/core/testing';

import { AppMessagesService } from './app-messages.service';

describe('AppMessagesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppMessagesService]
    });
  });

  it('should be created', inject([AppMessagesService], (service: AppMessagesService) => {
    expect(service).toBeTruthy();
  }));
});
