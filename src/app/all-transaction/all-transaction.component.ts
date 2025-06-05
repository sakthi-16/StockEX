import { Component, OnInit } from '@angular/core';
import { AllStocksTransactionsService, TransactionHistoryDTO } from '../service/all-transaction-service.service';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-all-stocks-transactions',
  templateUrl: './all-transaction.component.html',
  styleUrls: ['./all-transaction.component.css'],
  standalone: true,
  imports: [CommonModule, HomeComponent]
})
export class AllStocksTransactionsComponent implements OnInit {
  transactionHistory: TransactionHistoryDTO[] = [];
  paginatedData: TransactionHistoryDTO[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 0;

  constructor(private historyService: AllStocksTransactionsService) {}

  ngOnInit(): void {
    this.historyService.getStockTransactionHistory().subscribe({
      next: (data) => {
        this.transactionHistory = data;
        this.totalPages = Math.ceil(this.transactionHistory.length / this.itemsPerPage);
        this.updatePagination();
      },
      error: () => console.error('Failed to fetch transaction history')
    });
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.transactionHistory.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
}
