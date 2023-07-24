import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./ui/home/home.component";
import {AuthComponent} from "./ui/auth/auth.component";
import {DashboardComponent} from "./ui/dashboard/dashboard.component";

const routes: Routes = [
  { component: HomeComponent, path: '' },
  { component: AuthComponent, path: 'auth' },
  { component: DashboardComponent, path: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
