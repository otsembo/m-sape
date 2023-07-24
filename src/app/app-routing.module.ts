import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./ui/home/home.component";
import {AuthComponent} from "./ui/auth/auth.component";

const routes: Routes = [
  { component: HomeComponent, path: '' },
  { component: AuthComponent, path: 'auth' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
