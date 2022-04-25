import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { StylistPageComponent } from './stylist-page.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SessionStorageService } from 'ngx-webstorage';

describe('StylistPageComponent', () => 
{
  let component: StylistPageComponent;
  let fixture: ComponentFixture<StylistPageComponent>;

  beforeEach(async () => 
  {
    await TestBed.configureTestingModule(
    {
      declarations: [ StylistPageComponent ],
      imports: [HttpClientTestingModule, MatDialogModule],
      providers: [SessionStorageService]
    })
    .compileComponents();
  });

  beforeEach(() => 
  {
    fixture = TestBed.createComponent(StylistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => 
  {
    expect(component).toBeTruthy();
  });
});
