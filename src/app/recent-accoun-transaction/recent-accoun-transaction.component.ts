import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecentAccountTransactionService, UserAccountHistoryDTO } from '../service/recent-account-service.service';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-recent-transactions',
  standalone: true,
  imports: [CommonModule, HomeComponent],
  templateUrl: './recent-accoun-transaction.component.html',
  styleUrls: ['./recent-accoun-transaction.component.css']
})
export class RecentAccountTransactionsComponent implements OnInit {
  transactions: UserAccountHistoryDTO[] = [];
  paginatedTransactions: UserAccountHistoryDTO[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(private accountHistoryService: RecentAccountTransactionService) {}

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

  
   getTransactionTypeClass(tx: UserAccountHistoryDTO): string {
   return tx.transactionType === 'deposit' ? 'deposit' : 'withdraw';
 }
}
