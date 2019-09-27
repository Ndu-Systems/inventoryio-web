/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SplashService } from './splash.service';

describe('Service: Splash', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SplashService]
    });
  });

  it('should ...', inject([SplashService], (service: SplashService) => {
    expect(service).toBeTruthy();
  }));
});
