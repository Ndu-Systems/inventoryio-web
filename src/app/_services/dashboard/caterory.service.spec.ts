/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CateroryService } from './caterory.service';

describe('Service: Caterory', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CateroryService]
    });
  });

  it('should ...', inject([CateroryService], (service: CateroryService) => {
    expect(service).toBeTruthy();
  }));
});
