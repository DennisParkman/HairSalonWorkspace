import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DayDialogBoxComponent } from './day-dialog-box.component';

describe('DayDialogBoxComponent', () => {
  let component: DayDialogBoxComponent;
  let fixture: ComponentFixture<DayDialogBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayDialogBoxComponent ],
      providers: [
        { 
        provide: MatDialogRef,
        useValue: []
         },
         { 
         provide: MAT_DIALOG_DATA, 
         useValue: [] 
         }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
