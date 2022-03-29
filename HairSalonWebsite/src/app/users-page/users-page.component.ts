import { Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/user-service/user.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent implements OnInit {

  @ViewChild('formDialog', {static: true}) formDialog: TemplateRef<any>; //tag used for the add and update forms

  //list of users
  users: User[];

  //user field attributes
  bio: string;
  name: string;
  level: number;
  userUpdateId: any = null;
  userImage: string;

  //booleans to change visibility
  editSytlistFunctions: boolean = false;
  addingUser: boolean = false;
  updateUser: boolean = false;
  usersLoading: boolean = true;
  

  constructor(private userService: UserService, private dialog: MatDialog) { }

  /**
   * On loading page, all users on the database are loaded into a user array
   */
  ngOnInit(): void 
  { 
    this.userService.getUsers().subscribe(u => 
      {
        this.users = u; 
        this.usersLoading = false; 
        console.log(this.users); //debug
      }
    );
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
    this.addingUser = false;
    this.updateUser = false;
    this.clearFields();
  }

   /**
   * function to show create form from dialog box of events
   */
  setCreateUser()
  {
    this.resetDialog();
    this.addingUser = true;
    this.dialog.open(this.formDialog);
  }

  /*
    send new user entered in form to user service method
  */
  addUser() 
  {
    //tells the page that users are being loaded
    this.usersLoading = true;

    //create user object to add to the database
    //TODO: populate user object with proper fields
    let user: User = {};

    //send the new user to the backend via userService
    this.userService.addUser(user).subscribe(value => 
    {
      this.users.push(value);
      this.addingUser = false;
      this.clearFields();
      this.usersLoading = false;
    });

    this.dialog.closeAll(); //close dialog box
  }

  /*
    cancel creating user
  */
  cancelAddUser()
  {
    this.clearFields(); 
    this.addingUser = false;
    this.dialog.closeAll();
  }

  /*
    Display update sytlist form for specific user
  */
  displayUpdateUser(user: User)
  {
    
    this.userUpdateId = user.id;
    this.name = user.name;
    this.level = user.level;
    this.bio = user.bio;

    this.updateUser = true;
    this.dialog.open(this.formDialog);
  }

  /*
    send updated user entered in form to user service method
  */
  updatingUser()
  {
    // Temorary user object that will replace the object being updated.
    let user: User = {id: this.userUpdateId, bio: this.bio, name: this.name, level: this.level, userImage: this.userImage};

    // Query the database for the user being updated.
    var index = this.users.findIndex(x => x.id === this.userUpdateId);

    // Call the update service to pass to back end, and update the user. 
    // If the userImage is 
    if(user.userImage == null || user.userImage == "")
    {
      user.userImage = this.users[index].userImage;
    }
    this.userService.updateUser(user);
    this.users[index] = user;

    // Clearing the fields/flags
    this.updateUser = false;    // Form not to be displayed.
    this.userUpdateId = null;
    this.clearFields();
    this.dialog.closeAll();
  }

  /*
    hide user update form
  */
  cancelUpdatingUser()
  {
    this.updateUser = false;
    this.userUpdateId = null;
    this.clearFields();
    this.dialog.closeAll();
  }

  /*
    send delete request to the specified user in the database using the service method
  */
  deleteUser(user: User)
  {
    this.usersLoading = true;
    this.userService.deleteUser(user);
    var index = this.users.findIndex(x => x === user);
    this.users.splice(index, 1);
    this.usersLoading = false;
  }

  /*
    toggle delete and update buttons
  */
  toggleUserFunctionButtons()
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
    this.userImage = "";
  }

  /*
    sort users by level from highest level to lowest level
  */
  sortByLevelDesending(): void
  {
    this.users.sort((a, b) => (a.level > b.level) ? -1 : 1);
  }

  /*
    sort users by level from lowest level to highest level
  */
  sortByLevelAscending(): void
  {
    this.users.sort((a, b) => (a.level < b.level) ? -1 : 1);
  }

  /*
    sort users by name in alphabetical order from A to Z
  */
  sortByNameAscending(): void
  {
    this.users.sort((a, b) => (a.name < b.name) ? -1 : 1);
  }

  /*
    sort users by name in reverse alphabetical order from Z to A
  */
  sortByNameDesending(): void
  {
    this.users.sort((a, b) => (a.name > b.name) ? -1 : 1);
  }

}
