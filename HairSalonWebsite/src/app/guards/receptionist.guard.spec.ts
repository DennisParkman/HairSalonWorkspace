import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { SessionStorageService } from 'ngx-webstorage';

import { ReceptionistGuard } from './receptionist.guard';

describe('ReceptionistGuard', () => {
  let guard: ReceptionistGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SessionStorageService
      ],
      imports: [
        ToastrModule.forRoot(), RouterTestingModule
      ]
    });
    guard = TestBed.inject(ReceptionistGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
