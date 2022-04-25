import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';

import { SchedulePageComponent } from './schedule-page.component';

describe('SchedulePageComponent', () => 
{
  let component: SchedulePageComponent;
  let fixture: ComponentFixture<SchedulePageComponent>;

  beforeEach(async () => 
  {
    await TestBed.configureTestingModule({
      declarations: [ SchedulePageComponent ],
      imports: [HttpClientTestingModule, MatDialogModule,
        ToastrModule.forRoot()]
    })
    .compileComponents();
  });

  beforeEach(() => 
  {
    fixture = TestBed.createComponent(SchedulePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => 
  {
    expect(component).toBeTruthy();
  });
});
