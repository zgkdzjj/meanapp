import {Component, OnInit} from '@angular/core';
import {ValidateService} from "../../services/validate.service";
import {AuthService} from "../../services/auth.service";
import {FlashMessagesService} from "angular2-flash-messages";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  //email: String;
  username: String;
  password: String;

  constructor(private validateService: ValidateService,
              private flashMessagesService: FlashMessagesService,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
  }

  onSubmit() {
    const loginDetails = {
      //email: this.email,
      username: this.username,
      password: this.password
    }

    // Validate Login Form
    if (!this.validateService.validateLoginForm(loginDetails)) {
      console.log('Please fill in login details');
      this.flashMessagesService.show('Please fill in login details', {
        cssClass: 'alert-danger', timeout: 3000});
    }


    // Validate Login Details
    this.authService.validateLoginDetails(loginDetails).subscribe(
      data =>{
        console.log('data=> ' + JSON.stringify(data,null,4));
        if (data.success){
          this.authService.storeUserInfo(data.user,data.token);
          this.router.navigate(['/dashboard']);
          this.flashMessagesService.show('Login Succeed', {
            cssClass: 'alert-success', timeout: 3000
          });
          console.log('Login Succeed');
        } else {
          this.flashMessagesService.show(data.msg, {
            cssClass: 'alert-danger', timeout: 3000
          });
          this.router.navigate(['/login']);
          console.log(data.msg);
        }
      }
    );

    // Store User Info into local storage
    //storeUserInfo(){}
  }

}
