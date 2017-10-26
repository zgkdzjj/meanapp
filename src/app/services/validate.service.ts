import {Injectable} from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() {
  }

  validateRegister(user) {
    if (user.name == "" || user.username == "" || user.email == "" || user.password == "") {
      return false;
    } else {
      return true;
    }
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  validateLoginForm(loginDetails) {
    if (loginDetails.email== "" || loginDetails.password == "") {
      return false;
    } else {
      return true;
    }
  }

}
