import { Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { User, UserRole } from '../../models/user.model';
import { UserService } from '../../services/user-service/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent implements OnInit {

  @ViewChild('formDialog', {static: true}) formDialog: TemplateRef<any>; //tag used for the add and update forms

  //list of users
  users: User[];

  //list of roles
  roles: UserRole[];

  //user field attributes
  username: string;
  password: string;
  confPassword: string;
  role: UserRole;
  hashedPassword: string;
  userUpdateId: any = null;

  //booleans to change visibility
  editUserFunctions: boolean = false;
  addingUser: boolean = false;
  updateUser: boolean = false;
  usersLoading: boolean = true;

  //boolean for show/hide password
  hide: boolean = true;

  //bcrypt singleton for hashing passwords
  //docs found at: https://www.npmjs.com/package/bcrypt
  //need to install bcryptjs
  bcrypt = require('bcryptjs');

  //temp global hashing salt; we might want to store salt in user table
  salt: number = 10;

  constructor(private userService: UserService, 
              private dialog: MatDialog, 
              private toastr: ToastrService) 
  { }

  /**
   * On loading page, all users on the database are loaded into a user array
   */
  ngOnInit(): void 
  { 
    //initialize the list of roles
    this.roles = 
    [
      UserRole.Manager,
      UserRole.Stylist,
      UserRole.Receptionist
    ];

    this.userService.getUsers().subscribe(u => 
      {
        this.users = u; 
        this.usersLoading = false; 
        console.log(this.users); //debug
      }
    );
    
  }

  roleToString(role: UserRole): string
  {
    return User.roleToString(role);
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
    if(!this.validateFields(false))
    {
      return;
    }
    //tells the page that users are being loaded
    this.usersLoading = true;

    //hash the password
    //TODO: test with async hashing instead?
    this.hashedPassword = this.bcrypt.hashSync(this.password, this.salt);

    //debug; DELETE AFTER USE
    console.log("hashedPassword type" + (typeof this.hashedPassword) + "pwd hash: " + this.hashedPassword)

    //create user object to add to the database
    let user: User = {username: this.username, password: this.hashedPassword, role: this.role};

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
    Display update user form for specific user
  */
  displayUpdateUser(user: User)
  {
    this.userUpdateId = user.id;
    this.username = user.username;
    this.role = user.role;
    this.hashedPassword = user.password;

    this.updateUser = true;
    this.dialog.open(this.formDialog);
  }

  /*
    send updated user entered in form to user service method
  */
  updatingUser()
  {
    //quit if invalid fields
    if(!this.validateFields(true))
    {
      return;
    }

    //hash the password if there is a new password
    if(this.password != "" && this.password != null)
    {
      console.log(this.password);
      //TODO: test with async hashing instead?
      this.hashedPassword = this.bcrypt.hashSync(this.password, this.salt);
    }
    // Temorary user object that will replace the object being updated.
    let user: User = {id: this.userUpdateId, username: this.username, password: this.hashedPassword, role: this.role};

    console.log(user);

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
    this.username = "";
    this.role = 0; //the default role (Manager)
  }


  /**
   * validates the update/create user form, checking for unique user name
   * and matching confirmed password.
   * only requires a nonempty password if creating.
   * Blank password fields for update leaves password the same
   * @param isUpdate flag for if this is validation for updating an existing user
   * @returns true if the form is valid, false otherwise
   */
   validateFields(isUpdate: boolean) : boolean
   {
      //require a username
      if(this.username == "" || this.username == null)
      {
        this.toastr.error("Username is required!");
        console.log("Username is reqired!");
        return false;
      }

      //require a password if not updating
      if(!isUpdate)
      {
        if(this.password == "" || this.password == null)
        {
          this.toastr.error("Password is required!");
          console.log("Password is reqired!");
          return false;
        }
      }
      
      //require a role
      if(this.role == null || this.roleToString(this.role) == "Error")
      {
        this.toastr.error("User role is required!");
        console.log("User role is reqired!");
        return false;
      }

      //check username is unique, returning false if not
      for(let user of this.users)
      {
        if(user.username === this.username && user.id != this.userUpdateId)
        {
          this.toastr.error("username " + this.username + " is already in use");
          console.log("username " + this.username + " is already in use")
          return false;
        }
      }

      //check password and confPassword match, returning false if not
      if(this.password !== this.confPassword)
      {
        this.toastr.error("Passwords don't match!");
        console.log("Passwords don't match!");
        return false;
      }

      //if it got this far, the form is valid
      return true;
   }

}
