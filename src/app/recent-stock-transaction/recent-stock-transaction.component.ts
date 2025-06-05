import { Component, OnInit } from '@angular/core';
import { RecentStocksTransactionsService, TransactionHistoryDTO } from '../service/recent-stocks-transaction.service';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-recent-stocks-transactions',
  templateUrl: './recent-stock-transaction.component.html',
  styleUrls: ['./recent-stock-transaction.component.css'],
  standalone: true,
  imports: [CommonModule, HomeComponent]
})
export class RecentStocksTransactionsComponent implements OnInit {
  transactionHistory: TransactionHistoryDTO[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 4;

  constructor(private historyService: RecentStocksTransactionsService) {}

  ngOnInit(): void {
    this.historyService.getStockTransactionHistory().subscribe({
      next: (data) => this.transactionHistory = data,
      error: () => console.error('Failed to fetch transaction history')
    });
  }

  get paginatedTransactions(): TransactionHistoryDTO[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.transactionHistory.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.transactionHistory.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }
}
