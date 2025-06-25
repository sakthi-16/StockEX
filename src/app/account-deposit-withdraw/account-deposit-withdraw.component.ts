import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HomeComponent } from '../home/home.component';
import { AccountDepositWithdrawService } from '../service/account-deposit-withdraw-service.service';
import { NotyfService } from '../service/notyf.service';

@Component({
  selector: 'app-account-deposit-withdraw',
  standalone: true,
  imports: [CommonModule, HomeComponent, FormsModule],
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
    private toastr: ToastrService,
    private notyf: NotyfService
  ) {}

  submitTransaction(type: 'deposit' | 'withdraw') {
    // Manual validation
    if (this.amount === null || this.amount === undefined || this.amount <= 0) {
      this.notyf.error('Please enter a valid amount greater than zero.');
      return;
    }

      if (!Number.isInteger(this.amount)) {
    this.notyf.error('Only whole numbers are allowed in the amount.');
    this.toastr.error('Amount must be a whole number.', 'Invalid Amount');
    return;
  }

    if (!this.accountPIN || this.accountPIN.trim() === '') {
      this.toastr.error('Please enter your account PIN.', 'Missing PIN');
      this.notyf.error('PIN is required.');
      return;
    }

    const request$ = type === 'deposit'
      ? this.transactionService.deposit(this.amount, this.accountPIN)
      : this.transactionService.withdraw(this.amount, this.accountPIN);

    request$.subscribe({
      next: (response) => {
        this.toastr.success(response.message || 'Transaction Successful', 'Success');
        this.notyf.success(response.message);
        this.transactionHistory.unshift({
          type,
          amount: this.amount,
          time: new Date()
        });
        this.amount = 0;
        this.accountPIN = '';
      },
      error: (error) => {
        const msg = error.error?.message || 'Transaction Failed';
        this.toastr.error(msg, 'Error');
        this.notyf.error(msg);
      }
    });
  }
}
