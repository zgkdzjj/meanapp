import {Component, OnInit} from '@angular/core';
import {ValidateService} from "../../services/validate.service";
import {AuthService} from "../../services/auth.service";
import {FlashMessagesService} from "angular2-flash-messages";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: String;
  username: String;
  email: String;
  password: String;

  constructor(private validateService: ValidateService,
              private flashMessageService: FlashMessagesService,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
  }

  onSubmit() {
    const user = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password
    }

    // Validate register fields
    if (!this.validateService.validateRegister(user)) {
      console.log('Please fill in all fields');
      this.flashMessageService.show('Please fill in all fields', {
        cssClass: 'alert-danger', timeout: 3000
      });
    }

    // Validate Email format
    if (!this.validateService.validateEmail(user.email)) {
      console.log('Please enter the correct email address');
      this.flashMessageService.show('Please enter the correct email address', {
        cssClass: 'alert-danger',
        timeout: 3000
      });
    }
    console.log('onSubmit triggered ' + this.name);

    // Register User
    this.authService.registerUser(user).subscribe(
      data => {
        if (data.success) {
          this.flashMessageService.show('You are now registered and can log in', {
            cssClass: 'alert-success',
            timeout: 3000
          });
          this.router.navigate(['/login']);
        } else {
          this.flashMessageService.show('Something is wrong, please try again',{
            cssClass: 'alert-danger',
            timeout: 3000
          });
          this.router.navigate(['/register']);
        }

      }
    );
  }

}
