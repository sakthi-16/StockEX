import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MyStocksService } from '../service/my-stocks.service';
import { HomeComponent } from '../home/home.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotyfService } from '../service/notyf.service';

import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-sell-stocks',
  standalone: true,
  imports: [HomeComponent, FormsModule, CommonModule, NgChartsModule],
  templateUrl: './My-stocks.component.html',
  styleUrls: ['./My-stocks.component.css']
})
export class MyStocksComponent implements OnInit {
  stockList: any[] = [];
  selectedStock: any;
  sellQuantity: number = 1;
  enteredSellPin: string = '';
  sellMessage: string = '';
  isSuccessMessage: boolean = false;

  sellQuantityError: 'invalid' | 'exceed' | null = null;
  formValid: boolean = false;

  totalStockQuantity: number = 0;
  totalStockValue: number = 0;

  // ✅ PIE CHART Data
  pieChartLabels: string[] = [];
  pieChartData: number[] = [];
  pieChartType: ChartType = 'pie';
  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    animation: {
      animateRotate: true,
      duration: 1200,
      easing: 'easeOutBounce'
    },
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };

  // ✅ BAR CHART Data
  barChartLabels: string[] = [];
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Stocks Owned', backgroundColor: '#42A5F5' }]
  };
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    animation: {
      duration: 800,
      easing: 'easeOutQuart'
    },
    scales: {
      x: {},
      y: {
        beginAtZero: true
      }
    }
  };

  @ViewChild('sellModal') sellModalTemplate: any;

  constructor(private modalService: NgbModal, private sellService: MyStocksService, private notyf: NotyfService) {}

  ngOnInit(): void {
    this.loadUserHoldings();
  }

  loadUserHoldings(): void {
    this.sellService.getUserHoldings().subscribe(data => {
      this.stockList = data;

      // ✅ Calculate chart and summary values based on (holdingStocks × currentStockPrice)
      const totalQuantity = this.stockList.reduce((sum, stock) => sum + stock.holdingStocks, 0);
      const totalValue = this.stockList.reduce((sum, stock) => sum + (stock.holdingStocks * stock.currentStockPrice), 0);

      this.pieChartLabels = this.stockList.map(stock => stock.stockName);
      this.pieChartData = this.stockList.map(stock => stock.holdingStocks * stock.currentStockPrice);

      this.barChartLabels = this.stockList.map(stock => stock.stockName);
      this.barChartData = {
        labels: this.barChartLabels,
        datasets: [{
          data: this.stockList.map(stock => stock.holdingStocks),
          label: 'Stocks Owned',
          backgroundColor: '#42A5F5'
        }]
      };

      this.animateCount('quantity', totalQuantity);
      this.animateCount('value', totalValue);
    });
  }

  animateCount(type: 'quantity' | 'value', target: number): void {
    let current = 0;
    const duration = 400;
    const step = Math.ceil(target / duration * 10);

    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      if (type === 'quantity') this.totalStockQuantity = current;
      else this.totalStockValue = current;
    }, 10);
  }

  openSellModal(stock: any): void {
    this.selectedStock = stock;
    this.sellQuantity = 1;
    this.enteredSellPin = '';
    this.sellMessage = '';
    this.isSuccessMessage = false;
    this.sellQuantityError = null;
    this.formValid = true;
    this.modalService.open(this.sellModalTemplate);
  }

  validateSellForm(): void {
    if (!Number.isInteger(this.sellQuantity) || this.sellQuantity <= 0) {
      this.sellQuantityError = 'invalid';
    } else if (this.selectedStock && this.sellQuantity > this.selectedStock.holdingStocks) {
      this.sellQuantityError = 'exceed';
    } else {
      this.sellQuantityError = null;
    }

    this.formValid = !this.sellQuantityError;
  }

  proceedToSell(modal: any): void {
    if (!this.sellQuantity || !this.enteredSellPin || this.sellQuantityError) {
      this.sellMessage = 'Please enter valid quantity and PIN.';
      this.isSuccessMessage = false;
      return;
    }

    const sellData = {
      stockName: this.selectedStock.stockName,
      stockQuantity: this.sellQuantity,
      accountPIN: this.enteredSellPin
    };

    this.sellService.sellStock(sellData).subscribe({
      next: (response: any) => {
        this.sellMessage = response.message || 'Stock sold successfully.';
        this.isSuccessMessage = true;
        this.notyf.success(response.message);
        this.loadUserHoldings();
        setTimeout(() => modal.close(), 2000);
      },
      error: (error: any) => {
        this.sellMessage = error.error.message || 'Transaction failed.';
        this.isSuccessMessage = false;
        this.notyf.error(error.error.message);
      }
    });
  }
}
