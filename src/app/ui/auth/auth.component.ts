import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import {AuthService} from "../../data/services/auth/auth.service";
import {AppResponse} from "../../data/models/AppResponse";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  // component state variables
  appResponse?: AppResponse
  isLogin: boolean = true
  isLoading: boolean = false

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })

  registerForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    confirm: new FormControl(''),
    phone: new FormControl(''),
  })

  // services
  authService: AuthService
  constructor(authService: AuthService) {
    this.authService = authService
  }

  toggleAuthPage(): void {
    this.isLogin = !this.isLogin
    this.appResponse = undefined
  }

  private toggleAuthLoading(): void {
    this.isLoading = !this.isLoading
  }

  success = (r: AppResponse) => this.appResponse = r
  error = (err: any): void => {
    this.appResponse = {
      message: err.message,
      body: err,
      status: 500
    }
  }


  async loginAccount(){
    const { email, password } = this.loginForm.value
    this.toggleAuthLoading()
    await this.authService.logInAccount(email, password)
      .then(this.success)
      .catch(this.error)
    this.toggleAuthLoading()
  }

  async registerAccount(){
    const { email, password, confirm, phone } = this.registerForm.value
    this.toggleAuthLoading()
    await this.authService.createAccount(email, password, email, phone)
      .then(this.success)
      .catch(this.error)
    this.toggleAuthLoading()
  }

}
