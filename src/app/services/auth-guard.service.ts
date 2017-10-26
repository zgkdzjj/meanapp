import {Injectable} from '@angular/core';
import {CanActivate} from "@angular/router";
import {Router} from "@angular/router";
import {AuthService} from "./auth.service";

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate() {
    if (this.authService.loggedIn()) {
      //console.log('canActivate => ture');
      return true;
    } else {
      //console.log('canActivate => false');
      this.router.navigate(['home']);
      return false;
    }
  }


}
