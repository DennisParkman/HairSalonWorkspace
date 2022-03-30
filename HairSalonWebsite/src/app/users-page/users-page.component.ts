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
  userName: string;
  password: string
  confPassword: string
  hashedPassword: string;
  userUpdateId: any = null;

  //booleans to change visibility
  editUserFunctions: boolean = false;
  addingUser: boolean = false;
  updateUser: boolean = false;
  usersLoading: boolean = true;

  //boolean for show/hide password
  hide: boolean = true;

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
    //check that the form fields are valid
    if(!this.validateFields())
    {
      return;
    }
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
    this.userName = user.userName;
    this.password = user.password;
    this.confPassword = user.confPassword;

    this.updateUser = true;
    this.dialog.open(this.formDialog);
  }

  /*
    send updated user entered in form to user service method
  */
  updatingUser()
  {
    // Temorary user object that will replace the object being updated.
    let user: User = {id: this.userUpdateId, confPassword: this.confPassword, userName: this.userName, password: this.password};

    // Query the database for the user being updated.
    var index = this.users.findIndex(x => x.id === this.userUpdateId);

    // Call the update service to pass to back end, and update the user. 
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
    this.editUserFunctions = !this.editUserFunctions;
  }

  /*
    clear form information
  */
  clearFields()
  {
    this.confPassword = "";
    this.password = "";
    this.userName = "";
  }


  /**
   * Validate Fields before adding/updating a user
   */
   validateFields() : boolean
   {
      //assume the form is valid
      let isValid: boolean = true;


      //return the status of the form
      return isValid;
   }

}
