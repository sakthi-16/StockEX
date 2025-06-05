import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MyStocksService } from '../service/my-stocks.service';
import { HomeComponent } from '../home/home.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sell-stocks',
  standalone: true,
  imports: [HomeComponent, FormsModule, CommonModule],
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

  // Validation
  sellQuantityError: 'invalid' | 'exceed' | null = null;
  formValid: boolean = false;

  @ViewChild('sellModal') sellModalTemplate: any;

  constructor(private modalService: NgbModal, private sellService: MyStocksService) {}

  ngOnInit(): void {
    this.loadUserHoldings();
  }

  loadUserHoldings(): void {
    this.sellService.getUserHoldings().subscribe(data => {
      this.stockList = data;
    });
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
        this.loadUserHoldings();
        setTimeout(() => modal.close(), 2000);
      },
      error: (error: any) => {
        this.sellMessage = error.error.message || 'Transaction failed.';
        this.isSuccessMessage = false;
      }
    });
  }
}
