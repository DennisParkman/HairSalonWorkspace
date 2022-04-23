import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionStorageService } from 'ngx-webstorage';
import { UserRole } from '../models/user.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ReceptionistGuard implements CanActivate
{
  constructor(private sessionStorage: SessionStorageService, private toastr: ToastrService, private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    /**
     * This block of code requires that a user is has access to at least receptionist level features and will
     * redirect any traffic from unauthorized users back to the login page
     */
    if(this.sessionStorage.retrieve('user') == null)
    {
      this.toastr.error("Access Denied");
      this.router.navigateByUrl('/loginpage');
      return false;
    }
    
    if(this.sessionStorage.retrieve('user').role == UserRole.Manager || 
          this.sessionStorage.retrieve('user').role == UserRole.Stylist || 
          this.sessionStorage.retrieve('user').role == UserRole.Receptionist)
    {
      return true;
    }
    else 
    {
      this.toastr.error("Access Denied");
      this.router.navigateByUrl('/loginpage');
      return false;
    }
  }
}
