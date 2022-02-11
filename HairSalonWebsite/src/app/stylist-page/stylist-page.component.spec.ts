import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StylistPageComponent } from './stylist-page.component';

describe('StylistPageComponent', () => 
{
  let component: StylistPageComponent;
  let fixture: ComponentFixture<StylistPageComponent>;

  beforeEach(async () => 
  {
    await TestBed.configureTestingModule(
    {
      declarations: [ StylistPageComponent ]
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
