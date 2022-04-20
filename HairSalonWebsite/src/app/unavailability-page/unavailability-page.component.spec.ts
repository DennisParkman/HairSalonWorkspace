import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~ngOnInit~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * testing ngOnInit
   * checks enum is set
   */

  /**
   * testing ngOnInit
   * checks the lists are set correctly
   */

  /**
   * testing ngOnInit
   * checks that filteredStylists is the same as stylists
   */
  

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~setStylistIdFromDropdown~~~~~~~~~~~~~~~~~~~~~~~~~
   * testing setStylistIdFromDropdown
   * checks that this.name and this.stylistid are set
   */

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~stylistDropdownFilter~~~~~~~~~~~~~~~~~~~~~~~~~
   * testing stylistDropdownFilter
   * ensures that it returns a properly filtered stylist list
   */

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~stylistDropdownDisplay~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /** 
   * testing stylistDropdownDisplay
   * ensures function returns the stylist name for a non-null stylist object
   */

  /** 
   * testing stylistDropdownDisplay
   * ensures function returns empty string for a null stylist object
   */

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~showWorkScheduleBy~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * testing showWorkScheduleBy
   * ensures events is empty for no full schedule
   */

  /**
   * testing showWorkScheduleBy
   * ensures events is correctly populated for a populated full schedule
   */

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~validateFields~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * testing validateFields
   * checks fails on no name
   */
  
  /**
   * testing validateFields
   * checks fails on no start date
   */
  
  /**
   * testing validateFields
   * checks fails on no end date
   */
  
  /**
   * testing validateFields
   * checks fails on no period
   */
  
  /**
   * testing validateFields
   * checks fails on end before start
   */
  
  /**
   * testing validateFields
   * checks fails on start before now/date created
   */
  
  /**
   * testing validateFields
   * checks a valid unavailability passes
   */

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~clearFields~~~~~~~~~~~~~~~~~~~~~~~~~
   * testing clearFields
   * ensures the fields are cleared
   */

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~resetDialog~~~~~~~~~~~~~~~~~~~~~~~~~
   * testing resetDialog
   * ensures the fields are cleared
   */

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~timePeriodToString~~~~~~~~~~~~~~~~~~~~~~~~~
   * testing timePeriodToString
   * checks that each timeperiod gets converted to its string equivalent
   */

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~checkUnavailabilityConflict~~~~~~~~~~~~~~~~~~~~~~~~~ */
  
  /**
   * ensure that an unavailability that conflicts with an appointment returns true
   */

  /**
   * ensure that an unavailability for one stylist does not conflict an appointment for a different stylist
   * 
   */

  /**
   * ensure that an unavailability that does not conflict with any appointment returns false
   */

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~setCreateUnavailability~~~~~~~~~~~~~~~~~~~~~~~~~ 
   * check that the fields are populated right
  */

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~addUnavailability~~~~~~~~~~~~~~~~~~~~~~~~~ 
   * test that unavailability is added to front-end list and fields are set properly
   * calls to this.stylistScheduleService.refreshStylistScheduleWithUnavailability()
   *  and this.appCalendar.updateFullCalendar() should be tested in their native modules
  */

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~deleteUnavailability~~~~~~~~~~~~~~~~~~~~~~~~~ 
   * test that unavailability is removed from the front-end list and fields are
   * reset properly
   * Does not test methods of external modules
  */

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~startUpdateUnavailability~~~~~~~~~~~~~~~~~~~~~~~~~ 
   * check that the fields from the right unavailability are loaded and booleans updated
  */

  /** ~~~~~~~~~~~~~~~~~~~~~~~~~updateUnavailability~~~~~~~~~~~~~~~~~~~~~~~~~ 
   * check that the right unavailability is updated and the fields are cleared
  */
});
