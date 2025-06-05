import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HomeComponent } from '../home/home.component';
import { AccountDepositWithdrawService } from '../service/account-deposit-withdraw-service.service'; 

@Component({
  selector: 'app-account-deposit-withdraw',
  standalone: true,
  imports: [CommonModule,HomeComponent,FormsModule],
  templateUrl: './account-deposit-withdraw.component.html',
  styleUrls: ['./account-deposit-withdraw.component.css']
})
export class AccountDepositWithdrawComponent {
  amount: number = 0;
  accountPIN: string = '';
  action: 'deposit' | 'withdraw' = 'deposit';
  transactionHistory: { type: string; amount: number; time: Date }[] = [];

  constructor(
    private transactionService: AccountDepositWithdrawService,
    private toastr: ToastrService
  ) {}

  submitTransaction(type: 'deposit' | 'withdraw') {
    const request$ = type === 'deposit'
      ? this.transactionService.deposit(this.amount, this.accountPIN) 
      : this.transactionService.withdraw(this.amount, this.accountPIN); 

    request$.subscribe({
      next: (response) => {
        this.toastr.success(response.message || 'Transaction Successful', 'Success');
        this.transactionHistory.unshift({
          type,
          amount: this.amount,
          time: new Date()
        });
        this.amount = 0;
        this.accountPIN = '';
      },
      error: (error) => {
        this.toastr.error(error.error?.message || 'Transaction Failed', 'Error');
      }
    });
  }
}
