/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SupportService } from './support.service';

describe('Service: Support', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupportService]
    });
  });

  it('should ...', inject([SupportService], (service: SupportService) => {
    expect(service).toBeTruthy();
  }));
});
