import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { SessionStorageService } from 'ngx-webstorage';

import { ManagerGuard } from './manager.guard';

describe('ManagerGuard', () => {
  let guard: ManagerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SessionStorageService
      ],
      imports: [
        ToastrModule.forRoot(), RouterTestingModule
      ]
    });
    guard = TestBed.inject(ManagerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
