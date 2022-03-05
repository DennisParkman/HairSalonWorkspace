import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnavailabilityPageComponent } from './unavailability-page.component';

describe('UnavailabilityPageComponent', () => {
  let component: UnavailabilityPageComponent;
  let fixture: ComponentFixture<UnavailabilityPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnavailabilityPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnavailabilityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
