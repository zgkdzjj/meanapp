import {Injectable} from '@angular/core';
import {noUndefined} from "@angular/compiler/src/util";

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

  isNumber(input) {
    var numbers = /^[0-9]+$/;
    if(input.match(numbers))
    {
      return true;
    }
    else {
      return false;
    }

  }

  // Validate the product details
  validateProdForm(prodDets) {
    console.log(prodDets.prodName);
    if (prodDets.prodName== undefined || prodDets.prodBrand==undefined || prodDets.prodQuantity==undefined || prodDets.prodCat==undefined || prodDets.prodRate==undefined || prodDets.prodStatus==undefined){
      return false;
    } else {
      return true;
    }

  }

}
