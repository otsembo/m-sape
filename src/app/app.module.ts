import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './ui/components/navbar/navbar.component';
import { HomeComponent } from './ui/home/home.component';
import {NgOptimizedImage} from "@angular/common";
import { AuthComponent } from './ui/auth/auth.component';
import {ReactiveFormsModule} from "@angular/forms";
import { LoaderComponent } from './ui/components/loader/loader.component';
import { MessageComponent } from './ui/components/message/message.component';
import { DashboardComponent } from './ui/dashboard/dashboard.component';
import { DashboardNavComponent } from './ui/components/dashboard-nav/dashboard-nav.component';
import { DashboardMenuItemComponent } from './ui/components/dashboard-menu-item/dashboard-menu-item.component';
import { TransactionComponent } from './ui/components/transaction/transaction.component';
import { NotificationComponent } from './ui/components/notification/notification.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    AuthComponent,
    LoaderComponent,
    MessageComponent,
    DashboardComponent,
    DashboardNavComponent,
    DashboardMenuItemComponent,
    TransactionComponent,
    NotificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
