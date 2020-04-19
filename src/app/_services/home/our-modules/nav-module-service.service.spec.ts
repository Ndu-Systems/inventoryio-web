/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NavModuleServiceService } from './nav-module-service.service';

describe('Service: NavModuleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavModuleServiceService]
    });
  });

  it('should ...', inject([NavModuleServiceService], (service: NavModuleServiceService) => {
    expect(service).toBeTruthy();
  }));
});
