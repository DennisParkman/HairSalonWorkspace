import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { SessionStorageService } from 'ngx-webstorage';

import { StylistGuard } from './stylist.guard';

describe('StylistGuard', () => {
  let guard: StylistGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SessionStorageService
      ],
      imports: [
        ToastrModule.forRoot(), RouterTestingModule
      ]
    });
    guard = TestBed.inject(StylistGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
