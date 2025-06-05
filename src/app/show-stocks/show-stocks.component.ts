import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShowStocksService } from '../service/show-stocks.service';
import { HomeComponent } from '../home/home.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotyfService } from '../service/notyf.service';

@Component({
  selector: 'app-show-stocks',
  standalone: true,
  imports: [HomeComponent, FormsModule, CommonModule],
  templateUrl: './show-stocks.component.html'
})
export class ShowStocksComponent implements OnInit {
  stockList: any[] = [];
  selectedStock: any;
  buyQuantity: number = 1;
  enteredBuyPin: string = '';
  buyMessage: string = '';
  isSuccessMessage: boolean = false;

  // Validation
  buyQuantityError: 'invalid' | 'exceed' | null = null;
  formValid: boolean = false;

  @ViewChild('buyModal') buyModalTemplate: any;

  constructor(private modalService: NgbModal, private stockService: ShowStocksService,
    private notyf: NotyfService
  ) {}

  ngOnInit(): void {
    this.loadStocks();
  }

  loadStocks(): void {
    this.stockService.getAllStocks().subscribe(data => {
      console.log('Stocks data received:', data);
      this.stockList = data;
    });
  }

  openBuyModal(stock: any): void {
    this.selectedStock = stock;
    this.buyQuantity = 1;
    this.enteredBuyPin = '';
    this.buyMessage = '';
    this.isSuccessMessage = false;
    this.buyQuantityError = null;
    this.formValid = true;
    this.modalService.open(this.buyModalTemplate);
  }

  validateBuyForm(): void {
    if (!Number.isInteger(this.buyQuantity) || this.buyQuantity <= 0) {
      this.buyQuantityError = 'invalid';
    } else if (this.selectedStock && this.buyQuantity > this.selectedStock.totalStocks) {
      this.buyQuantityError = 'exceed';
    } else {
      this.buyQuantityError = null;
    }

    this.formValid = !this.buyQuantityError;
  }

  proceedToBuy(modal: any): void {
    if (!this.buyQuantity || !this.enteredBuyPin || this.buyQuantityError) {
      this.buyMessage = 'Please enter valid quantity and PIN.';
      this.isSuccessMessage = false;
      return;
    }

    const buyData = {
      stockName: this.selectedStock.stockName,
      stockQuantity: this.buyQuantity,
      accountPIN: this.enteredBuyPin
    };

    this.stockService.buyStock(buyData).subscribe({
      next: (response: any) => {
        this.buyMessage = response.message;
        console.log(response);
        this.isSuccessMessage = true;

        this.notyf.success("stock bought successfully!");

        this.loadStocks();
        setTimeout(() => modal.close(), 2000);
      },
      error: (error: any) => {
        this.buyMessage = error.error.message || 'Transaction failed.';
        this.isSuccessMessage = false;
        this.notyf.error(error.error.message);
      }
    });
  }
}
