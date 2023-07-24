import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  // component state variables
  isLogin: boolean = true

  toggleAuthPage(): void {
    this.isLogin = !this.isLogin
  }

}
