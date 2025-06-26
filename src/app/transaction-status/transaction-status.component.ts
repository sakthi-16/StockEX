import { Component, OnInit } from '@angular/core';
import { TransactionStatusService, TransactionStatusDTO } from '../service/transaction-status-service.service';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-transaction-status',
  templateUrl: './transaction-status.component.html',
  styleUrls: ['./transaction-status.component.css'],
  standalone: true,
  imports: [CommonModule, HomeComponent, FormsModule, NgbModalModule, NgChartsModule]
})
export class TransactionStatusComponent implements OnInit {
  transactions: TransactionStatusDTO[] = [];
  sortedTransactions: TransactionStatusDTO[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 4;
  sortOrder: 'recent' | 'oldest' = 'recent';

  // Chart Related
  barChartType: 'bar' = 'bar';
  barChartData: ChartData<'bar', number[], string> = { labels: [], datasets: [] };
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    },
    scales: {
      x: {},
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };
  totalSuccess = 0;
  totalFailure = 0;
  chartReady = false;

  constructor(private statusService: TransactionStatusService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.statusService.getTransactionStatus().subscribe({
      next: (data) => {
        this.transactions = data;
        this.applySort();
      },
      error: () => console.error('Failed to fetch transaction status')
    });
  }

  applySort(): void {
    this.sortedTransactions = [...this.transactions];
    if (this.sortOrder === 'recent') {
      this.sortedTransactions.reverse();
    }
    this.currentPage = 1;
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

  openChartModal(content: any): void {
    this.prepareChartData();
    this.modalService.open(content, { size: 'lg' });
  }

  prepareChartData(): void {
    const successMap = new Map<string, number>();
    const failureMap = new Map<string, number>();
    this.totalSuccess = 0;
    this.totalFailure = 0;

    for (const tx of this.transactions) {
      const name = tx.stockName;
      if (tx.transactionStatus === 'Success') {
        successMap.set(name, (successMap.get(name) || 0) + 1);
        this.totalSuccess++;
      } else if (tx.transactionStatus === 'Failure') {
        failureMap.set(name, (failureMap.get(name) || 0) + 1);
        this.totalFailure++;
      }
    }

    const allNames = Array.from(new Set([...successMap.keys(), ...failureMap.keys()]));

    this.barChartData = {
      labels: allNames,
      datasets: [
        {
          label: 'Success',
          data: allNames.map(name => successMap.get(name) || 0),
          backgroundColor: 'gold'
        },
        {
          label: 'Failure',
          data: allNames.map(name => failureMap.get(name) || 0),
          backgroundColor: 'silver'
        }
      ]
    };

    this.chartReady = true;
  }
}
