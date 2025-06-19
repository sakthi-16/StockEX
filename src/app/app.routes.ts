import { Routes } from '@angular/router';

// Component imports
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AccountAdditionComponent } from './account-addition/account-addition.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { StockAdditionComponent } from './stock-addition/stock-addition.component';
import { HomeComponent } from './home/home.component';
import { ShowStocksComponent } from './show-stocks/show-stocks.component';
import { MyStocksComponent } from './my-stocks/my-stocks.component';
import { RecentAccountTransactionsComponent } from './recent-accoun-transaction/recent-accoun-transaction.component';
import { FirstPageComponent } from './first-page/first-page.component';
import { SignupComponent } from './signup/signup.component';
import { AccountDepositWithdrawComponent } from './account-deposit-withdraw/account-deposit-withdraw.component';
import { AllAccountTransactionsComponent } from './all-account-transaction/all-account-transaction.component';
import { AllStocksTransactionsComponent } from './all-transaction/all-transaction.component';
import { RecentStocksTransactionsComponent } from './recent-stock-transaction/recent-stock-transaction.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { TransactionStatusComponent } from './transaction-status/transaction-status.component';
import { AdminNavBarComponent } from './admin-nav-bar/admin-nav-bar.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AddStockComponent } from './add-stock/add-stock.component';

// Guard imports
import { AuthGuard } from './auth.guard';
import { LoggedGuard } from './logged.guard';
import { PaymentStatusComponent } from './payment-status/payment-status.component';
import { UpdateStockPriceComponent } from './update-stock-price/update-stock-price.component';
import { FavouritesComponent } from './favourites/favourites.component';

export const routes: Routes = [
  // Public routes - only accessible when NOT logged in
  { path: '', component: FirstPageComponent, canActivate: [LoggedGuard] },
  { path: 'app-login', component: LoginComponent, canActivate: [LoggedGuard] },
  { path: 'app-signup', component: SignupComponent, canActivate: [LoggedGuard] },
  { path: 'app-forgot-password', component: ForgotPasswordComponent, canActivate: [LoggedGuard] },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [LoggedGuard] },

  // Protected routes - accessible only when logged in
  { path: 'app-home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'app-account-addition', component: AccountAdditionComponent, canActivate: [AuthGuard] },
  { path: 'stock-addition', component: StockAdditionComponent, canActivate: [AuthGuard] },
  { path: 'app-show-stocks', component: ShowStocksComponent, canActivate: [AuthGuard] },
  { path: 'app-my-stocks', component: MyStocksComponent, canActivate: [AuthGuard] },
  { path: 'app-recent-accoun-transaction', component: RecentAccountTransactionsComponent, canActivate: [AuthGuard] },
  { path: 'app-account-deposit-withdraw', component: AccountDepositWithdrawComponent, canActivate: [AuthGuard] },
  { path: 'app-all-account-transaction', component: AllAccountTransactionsComponent, canActivate: [AuthGuard] },
  { path: 'app-all-stocks-transactions', component: AllStocksTransactionsComponent, canActivate: [AuthGuard] },
  { path: 'app-recent-stocks-transactions', component: RecentStocksTransactionsComponent, canActivate: [AuthGuard] },
  { path: 'app-my-profile', component: MyProfileComponent, canActivate: [AuthGuard] },
  { path: 'app-transaction-status', component: TransactionStatusComponent, canActivate: [AuthGuard] },
  { path: 'payment-status', component: PaymentStatusComponent,canActivate:[AuthGuard] },
  { path: 'app-admin-nav-bar', component:AdminNavBarComponent ,canActivate:[AuthGuard] },
  { path: 'app-admin-home', component:AdminHomeComponent,canActivate:[AuthGuard] },
  { path: 'app-add-stock', component:AddStockComponent,canActivate:[AuthGuard] },
  { path: 'app-update-stock', component:UpdateStockPriceComponent,canActivate:[AuthGuard] },
  {
  path: 'favourites/:collectionName',component: FavouritesComponent,canActivate:[AuthGuard]},


  // Fallback
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
