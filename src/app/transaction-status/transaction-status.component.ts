import { Component, OnInit } from '@angular/core';
import { TransactionStatusService, TransactionStatusDTO } from '../service/transaction-status-service.service';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction-status',
  templateUrl: './transaction-status.component.html',
  styleUrls: ['./transaction-status.component.css'],
  standalone: true,
  imports: [CommonModule, HomeComponent,FormsModule]
})
export class TransactionStatusComponent implements OnInit {
  transactions: TransactionStatusDTO[] = [];
  sortedTransactions: TransactionStatusDTO[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 4;
  sortOrder: 'recent' | 'oldest' = 'recent';

  constructor(private statusService: TransactionStatusService) {}

  ngOnInit(): void {
    this.statusService.getTransactionStatus().subscribe({
      next: (data) => {
        this.transactions = data;
        this.applySort(); // Initial sort
      },
      error: () => console.error('Failed to fetch transaction status')
    });
  }

  applySort(): void {
    this.sortedTransactions = [...this.transactions]; // shallow copy
    if (this.sortOrder === 'recent') {
      this.sortedTransactions.reverse();
    }
    this.currentPage = 1; // Reset to first page when sort changes
  }

  onSortOrderChange(): void {
    this.applySort();
  }

  get paginatedTransactions(): TransactionStatusDTO[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.sortedTransactions.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.sortedTransactions.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }
}
