import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllAccountService, UserAccountHistoryDTO } from '../service/all-account-transaction.service';
import { HomeComponent } from '../home/home.component';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-all-account-transactions',
  standalone: true,
  imports: [CommonModule, HomeComponent, NgChartsModule],
  templateUrl: './all-account-transaction.component.html',
  styleUrls: ['./all-account-transaction.component.css']
})
export class AllAccountTransactionsComponent implements OnInit {
  transactions: UserAccountHistoryDTO[] = [];
  paginatedTransactions: UserAccountHistoryDTO[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  totalPayins: number = 0;
  totalPayouts: number = 0;

  // ✅ Bar Chart Config
  public barChartType: 'bar' = 'bar';
  public barChartData: ChartData<'bar', number[], string> = {
    labels: ['Pay-in', 'Payout'],
    datasets: [
      {
        label: 'Amount (₹)',
        data: [0, 0],
        backgroundColor: ['#198754', '#dc3545'],
        borderRadius: 6
      }
    ]
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value}`
        }
      }
    }
  };

  constructor(private accountHistoryService: AllAccountService) {}

  ngOnInit(): void {
    this.accountHistoryService.getRecentTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.totalPages = Math.ceil(this.transactions.length / this.itemsPerPage);
        this.updatePaginatedTransactions();
        this.calculateChartData();
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

  calculateChartData(): void {
    let payIn = 0;
    let payOut = 0;
    this.transactions.forEach(tx => {
      if (tx.transactionType === 'deposit') {
        payIn += tx.amountTransacted;
      } else {
        payOut += tx.amountTransacted;
      }
    });

    this.totalPayins = payIn;
    this.totalPayouts = payOut;
    this.barChartData.datasets[0].data = [payIn, payOut];
  }
}
