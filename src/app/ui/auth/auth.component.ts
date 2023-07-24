import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import {AuthService} from "../../data/services/auth/auth.service";
import {CommonModule} from "@angular/common";
import {AppResponse} from "../../data/models/AppResponse";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  // component state variables
  appResponse?: AppResponse = undefined
  isLogin: boolean = true
  isLoading: boolean = false
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })

  // services
  authService: AuthService
  constructor(authService: AuthService) {
    this.authService = authService
  }

  toggleAuthPage(): void {
    this.isLogin = !this.isLogin
  }

  private toggleAuthLoading(): void {
    this.isLoading = !this.isLoading
  }

  loginAccount(){
    const email = this.loginForm.value.email ?? ''
    const pass = this.loginForm.value.password ?? ''
    this.toggleAuthLoading()
    this.authService.logInAccount(email, pass)
      .then(r => {
        this.appResponse = r
        console.log("response",r)
        this.toggleAuthLoading()
      })
      .catch(err => {
        this.appResponse = {
          message: err.message,
          body: err,
          status: 500
        }
        console.log("error",err)
        this.toggleAuthLoading()
      })
  }

}
