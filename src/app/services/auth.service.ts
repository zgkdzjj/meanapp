import {Injectable} from '@angular/core';
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/map';
import {tokenNotExpired} from "angular2-jwt";

@Injectable()
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http:Http) {
  }

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/register',
      user, {headers: headers})
      .map(res => res.json());
  }

  validateLoginDetails(loginDetails){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/authenticate',
      loginDetails, {headers: headers})
      .map(res => res.json());
  }

  storeUserInfo(user,token){
    this.authToken = token;
    this.user = user;
    localStorage.setItem('token', this.authToken);
    localStorage.setItem('user', JSON.stringify(this.user));
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();

  }

  // Check If Logged In
  loggedIn() {
    //console.log('Token Found => ' + tokenNotExpired());
    return tokenNotExpired();
  }

  loadToken() {
    this.authToken = localStorage.getItem('token');
  }

  getProfile() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    return this.http.post('http://localhost:3000/users/profile',
      null, {headers: headers})
      .map(res => res.json());
  }


}
