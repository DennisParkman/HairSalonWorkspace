import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { runInThisContext } from 'vm';
import { User } from '../models/user.model';
import { UserService } from '../services/user-service/user.service';

@Component(
{
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit 
{
  users: User[];
  username: string;
  password: string;
  loginValid: boolean = true;
  constructor(private userService: UserService, private toastr: ToastrService) 
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
        let validPassword = bcrypt.compareSync(this.password, user.password)
        if(validPassword)
        {
          this.toastr.success("Login Successfull!");
          console.log("Login Successfull");
        }
        else
        {
          this.toastr.error("Password Invalid!");
        }
      }
      else
      {
        this.toastr.error("Username is Invalid!");
      }
    }
  }
}
