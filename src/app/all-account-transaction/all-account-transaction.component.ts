import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllAccountService, UserAccountHistoryDTO } from '../service/all-account-transaction.service';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-all-account-transactions',
  standalone: true,
  imports: [CommonModule, HomeComponent],
  templateUrl: './all-account-transaction.component.html',
  styleUrls: ['./all-account-transaction.component.css']
})
export class AllAccountTransactionsComponent implements OnInit {
  transactions: UserAccountHistoryDTO[] = [];
  paginatedTransactions: UserAccountHistoryDTO[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(private accountHistoryService: AllAccountService) {}

  ngOnInit(): void {
    this.accountHistoryService.getRecentTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.totalPages = Math.ceil(this.transactions.length / this.itemsPerPage);
        this.updatePaginatedTransactions();
      },
      error: () => console.error('Failed to load recent transactions')
    });
  }

  updatePaginatedTransactions(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedTransactions = this.transactions.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedTransactions();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedTransactions();
    }
  }

  
  getTransactionTypeClass(tx: UserAccountHistoryDTO, index: number): string {
    const absoluteIndex = (this.currentPage - 1) * this.itemsPerPage + index;

    if (absoluteIndex + 1 < this.transactions.length) {
      const nextTx = this.transactions[absoluteIndex + 1];
      const currentBalance = tx.currentAccountBalance;
      const previousBalance = nextTx.currentAccountBalance;

      return currentBalance > previousBalance ? 'deposit' : 'withdraw';
    }

    return 'deposit';
  }
}
