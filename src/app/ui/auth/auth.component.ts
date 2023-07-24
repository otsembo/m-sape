import {Component, Input} from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import {AuthService} from "../../data/services/auth/auth.service";
import {AppResponse} from "../../data/models/AppResponse";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  // component input
  @Input() isLogin: boolean = true

  // component state variables
  appResponse?: AppResponse
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
  constructor(authService: AuthService, private router: Router) {
    this.authService = authService
  }

  toggleAuthPage(): void {
    this.isLogin = !this.isLogin
    this.appResponse = undefined
  }

  private toggleAuthLoading(): void {
    this.isLoading = !this.isLoading
  }

  success = (r: AppResponse) => {
    this.appResponse = r
    r.message == "success" ? this.navigateToDashboard() : null

  }
  error = (err: any): void => {
    this.appResponse = {
      message: err.message,
      body: err,
      status: 500
    }
  }

  private async navigateToDashboard(){
    await new Promise(resolve => setTimeout(resolve, 500));
    await this.router.navigate(["dashboard"])
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
