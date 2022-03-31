import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';

@Injectable(
{
  providedIn: 'root'
})
export class UserService 
{

  constructor(private http: HttpClient) 
  { }

  //backend baseURL
  readonly baseURL = 'http://localhost:63235/';

  /**
     * To add an user object to the C# backend database located at 
     * @baseURL variable in the form of an enumrable array
     * @param user is the object that is added
     * @returns user that is added
     */
   addUser(user: User): Observable<User>
   {
       let url = this.baseURL.concat("User");
       console.log(url);
       console.log(user);
       return this.http.post<User>(url, user);
   }
   
   /**
    * To get an enumerable array of users from the C# backend database located at
    * @baseURL variable in the form of an enumrable array
    * @returns all users as an enumerable array
    */
   getUser(): Observable<User[]>
   {
       let url = this.baseURL.concat("User");
       return this.http.get<User[]>(url); // <User> is required on this line when a constructor is included in the model file
   }

    /**
    * To update an user object to the C# backend database located at 
    * @baseURL variable in the form of an enumrable array
    * @param user is the object that contains updated information for an user entry in the database
    */
   updateUser(user: User): void
   {
       let url = this.baseURL.concat("User");
       this.http.put(url, user).subscribe();
   }

   /**
    * To delete an user object from the C# backend database located 
    * @baseURL variable in the form of an enumerable array
    * @param user is the object that needs to be deleted
    */
   deleteUser(user: User): void
   {
       let url = this.baseURL.concat("User/" + user.username);
       this.http.delete(url).subscribe();
   }

}
