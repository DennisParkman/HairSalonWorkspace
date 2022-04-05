import { Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
//import { Console } from 'console';
import { Stylist } from '../models/stylist.model';
import { StylistService } from '../services/stylist-service/stylist.service';
import { MatDialog } from '@angular/material/dialog';
import { User,UserRole } from '../models/user.model';



@Component(
{
  selector: 'app-stylist-page',
  templateUrl: './stylist-page.component.html',
  styleUrls: ['./stylist-page.component.scss']
})
export class StylistPageComponent implements OnInit 
{
  @ViewChild('formDialog', {static: true}) formDialog: TemplateRef<any>; //tag used for the add and update forms

  //list of stylists
  stylists: Stylist[];

  //stylist field attributes
  bio: string;
  name: string;
  level: number;
  stylistUpdateId: any = null;
  stylistImage: string;

  //booleans to change visibility
  editSytlistFunctions: boolean = false;
  addingStylist: boolean = false;
  updateSylist: boolean = false;
  stylistsLoading: boolean = true;

  role: UserRole[]; //array of roles used for access control
  

  constructor(private stylistService: StylistService, private dialog: MatDialog) { }

  /**
   * On loading page, all stylists on the database are loaded into a stylist array
   */
  ngOnInit(): void 
  {
    // set enumerable values for role
    this.role = [
      UserRole.Manager,
      UserRole.Receptionist,
      UserRole.Stylist
    ]
    this.stylistService.getStylists().subscribe(s => 
      {
        this.stylists = s; 
        this.stylistsLoading = false; 
        console.log(this.stylists); //debug
      }
    );
  }

  /**
   * Function to allow access to certain features on the stylist page
   */
  canAccess(accessLevel: string)
  {
    let dummy: User = {id: 1, username: "Dummy", password: "pass123", role: UserRole.Manager};
    return this.roleToString(dummy.role) == accessLevel
  }

  /**
   * Function that accepts enum role and returns it in the form of string
   * @param r enum role
   * @returns timeperiod in string
   */
   roleToString(r: UserRole): string
   {
     return User.roleToString(r);
   }

  /**
   * Function to close and reset dialog box
   */
   closeDialog()
   {
     this.resetDialog();
     this.dialog.closeAll(); //closes dialog boxes
   }

   resetDialog() 
   {
    this.addingStylist = false;
    this.updateSylist = false;
    this.clearFields();
  }

   /**
   * function to show create form from dialog box of events
   */
  setCreateStylist()
  {
    this.resetDialog();
    this.addingStylist = true;
    this.dialog.open(this.formDialog);
  }

  /*
    send new stylist entered in form to stylist service method
  */
  addStylist() 
  {
    //tells the page that stylists are being loaded
    this.stylistsLoading = true;

    //create stylist object to add to the database
    let stylist: Stylist = {bio: this.bio, name: this.name, level: this.level, stylistImage: this.stylistImage};

    //send the new stylist to the backend via stylistService
    this.stylistService.addStylist(stylist).subscribe(value => 
    {
      this.stylists.push(value);
      this.addingStylist = false;
      this.clearFields();
      this.stylistsLoading = false;
    });

    this.dialog.closeAll(); //close dialog box
  }

  /*
    cancel creating stylist
  */
  cancelAddStylist()
  {
    this.clearFields(); 
    this.addingStylist = false;
    this.dialog.closeAll();
  }

  /*
    Display update sytlist form for specific stylist
  */
  displayUpdateSytlist(stylist: Stylist)
  {
    
    this.stylistUpdateId = stylist.id;
    this.name = stylist.name;
    this.level = stylist.level;
    this.bio = stylist.bio;

    this.updateSylist = true;
    this.dialog.open(this.formDialog);
  }

  /*
    Convert the uploaded image to binary base64 string before updatingStylist is called. This is to ensure that the database receives
    the image in binary.
  */
  EncodeImage(event: any)
  {
    // Temporary Variable for converting the image to binary, log the receipt of the file.
    var EncodedImage: string = "";
    // Pull the first file uploaded.
    var file: File = event.target.files[0];
    // Setup filestream object.
    var fileStream: FileReader = new FileReader();

    // Defining the file script onloadend function, required to ensure the field is updated properly.
    fileStream.onloadend = (e) =>
    {
      // Get the conversion result and store in the field.
      this.stylistImage = btoa(fileStream.result as string);
      // Log the uploaded file.
      console.log(this.stylistImage);
    }

    // Call the file to text function.
    fileStream.readAsBinaryString(file)
  }

  /*
    Used to decode an image stored as a base 64 string. For use in displaying stylist image.
  */
  DecodeImage(img?: string)
  {
    // Log the img given.
    console.log(img)
    // Check if not null, otherwise post.
    if(img != null || img != "") return 'data:image/png;base64,' + img;
    else return "ImageNotFound";
  }

  /*
    send updated stylist entered in form to stylist service method
  */
  updatingStylist()
  {
    // Temorary stylist object that will replace the object being updated.
    let stylist: Stylist = {id: this.stylistUpdateId, bio: this.bio, name: this.name, level: this.level, stylistImage: this.stylistImage};

    // Query the database for the stylist being updated.
    var index = this.stylists.findIndex(x => x.id === this.stylistUpdateId);

    // Call the update service to pass to back end, and update the stylist. 
    // If the stylistImage is 
    if(stylist.stylistImage == null || stylist.stylistImage == "")
    {
      stylist.stylistImage = this.stylists[index].stylistImage;
    }
    this.stylistService.updateStylist(stylist);
    this.stylists[index] = stylist;

    // Clearing the fields/flags
    this.updateSylist = false;    // Form not to be displayed.
    this.stylistUpdateId = null;
    this.clearFields();
    this.dialog.closeAll();
  }

  /*
    hide stylist update form
  */
  cancelUpdatingStylist()
  {
    this.updateSylist = false;
    this.stylistUpdateId = null;
    this.clearFields();
    this.dialog.closeAll();
  }

  /*
    send delete request to the specified stylist in the database using the service method
  */
  deleteStylist(stylist: Stylist)
  {
    this.stylistsLoading = true;
    this.stylistService.deleteStylist(stylist);
    var index = this.stylists.findIndex(x => x === stylist);
    this.stylists.splice(index, 1);
    this.stylistsLoading = false;
  }

  /*
    toggle delete and update buttons
  */
  toggleStylistFunctionButtons()
  {
    this.editSytlistFunctions = !this.editSytlistFunctions;
  }

  /*
    clear form information
  */
  clearFields()
  {
    this.bio = "";
    this.level = 0;
    this.name = "";
    this.stylistImage = "";
  }

  /*
    sort stylists by level from highest level to lowest level
  */
  sortByLevelDesending(): void
  {
    this.stylists.sort((a, b) => (a.level > b.level) ? -1 : 1);
  }

  /*
    sort stylists by level from lowest level to highest level
  */
  sortByLevelAscending(): void
  {
    this.stylists.sort((a, b) => (a.level < b.level) ? -1 : 1);
  }

  /*
    sort stylists by name in alphabetical order from A to Z
  */
  sortByNameAscending(): void
  {
    this.stylists.sort((a, b) => (a.name < b.name) ? -1 : 1);
  }

  /*
    sort stylists by name in reverse alphabetical order from Z to A
  */
  sortByNameDesending(): void
  {
    this.stylists.sort((a, b) => (a.name > b.name) ? -1 : 1);
  }

}
