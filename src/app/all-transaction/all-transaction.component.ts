import { Component, OnInit } from '@angular/core';
import { AllStocksTransactionsService, TransactionHistoryDTO } from '../service/all-transaction-service.service';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType, ChartData } from 'chart.js';

@Component({
  selector: 'app-all-stocks-transactions',
  templateUrl: './all-transaction.component.html',
  styleUrls: ['./all-transaction.component.css'],
  standalone: true,
  imports: [CommonModule, HomeComponent, NgChartsModule]
})
export class AllStocksTransactionsComponent implements OnInit {
  transactionHistory: TransactionHistoryDTO[] = [];
  paginatedData: TransactionHistoryDTO[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 0;

  chartReady = false;


  // ✅ Chart properties with proper type and default values
  barChartType: 'bar' = 'bar';
  barChartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: []
  };
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  constructor(private historyService: AllStocksTransactionsService) {}

  ngOnInit(): void {
    this.historyService.getStockTransactionHistory().subscribe({
      next: (data) => {
        this.transactionHistory = data;
        this.totalPages = Math.ceil(this.transactionHistory.length / this.itemsPerPage);
        this.updatePagination();
        this.prepareChartData(); // prepare chart on init
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

  // ✅ Chart data logic
 prepareChartData(): void {
  const bought = new Map<string, number>();
  const sold = new Map<string, number>();

  for (const tx of this.transactionHistory) {
    const name = tx.stockName;
    if (tx.transactionType === 'withdraw') {
      bought.set(name, (bought.get(name) || 0) + 1);
    } else if (tx.transactionType === 'deposit') {
      sold.set(name, (sold.get(name) || 0) + 1);
    }
  }

  const allNames = Array.from(new Set([...bought.keys(), ...sold.keys()]));

  this.barChartData = {
    labels: allNames,
    datasets: [
      {
        label: 'Bought',
        data: allNames.map(name => bought.get(name) || 0),
        backgroundColor: 'green'
      },
      {
        label: 'Sold',
        data: allNames.map(name => sold.get(name) || 0),
        backgroundColor: 'red'
      }
    ]
  };

  this.chartReady = true; // ✅ mark chart as ready
}

}
