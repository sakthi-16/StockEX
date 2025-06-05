import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';


import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FirstPageComponent } from "./first-page/first-page.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { AccountAdditionComponent } from './account-addition/account-addition.component';
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { StockAdditionComponent } from "./stock-addition/stock-addition.component";
import { AccountDepositWithdrawComponent } from "./account-deposit-withdraw/account-deposit-withdraw.component";
import { MyStocksComponent } from './my-stocks/my-stocks.component';
import { ShowStocksComponent } from "./show-stocks/show-stocks.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgbDropdownModule
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'StockEX';
  
}
