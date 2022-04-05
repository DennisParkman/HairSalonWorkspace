import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SessionStorageService } from 'ngx-webstorage';
import { User, UserRole } from '../models/user.model';
import { UserService } from '../services/user-service/user.service';

@Component(
{
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit 
{
  //list of users
  users: User[];
  
  //list of roles
  roles: UserRole[];

  //user field attributes
  username: string;
  password: string;
  role: UserRole;
 
  loginValid: boolean = true;
  bcrypt = require('bcryptjs');

  constructor(private userService: UserService, 
              private toastr: ToastrService, 
              private router: Router,
              private sessionStorage: SessionStorageService) 
  { }

  ngOnInit(): void 
  {
    this.userService.getUser().subscribe(s => 
    {
      this.users = s; 
      console.log(this.users); //debug
    }
    );
  }

  onSubmit(): void 
  {
    this.loginValid = true;
    for(let user of this.users)
    {
      if(this.username == user.username)
      {
        let validPassword = this.bcrypt.compareSync(this.password, user.password)
        if(validPassword)
        {
          this.sessionStorage.store(this.username, this.password); //this gets lost once the browser tab is closed
          this.toastr.success("Login Successfull!");
          console.log("Login Successfull");
          this.router.navigateByUrl('/home');
        }
        else
        {
          this.toastr.error("Password Invalid!");
          this.loginValid = false;
        }
      }
      else
      {
        this.toastr.error("Username is Invalid!");
        this.loginValid = false;
      }
    }
  }
}
