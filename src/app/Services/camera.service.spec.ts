/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CameraServiceService } from './camera.service';

describe('Service: CameraService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CameraServiceService]
    });
  });

  it('should ...', inject([CameraServiceService], (service: CameraServiceService) => {
    expect(service).toBeTruthy();
  }));
});
