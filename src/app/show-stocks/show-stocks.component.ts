import { Component, ElementRef, OnInit, viewChild, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ShowStocksService } from '../service/show-stocks.service';
import { NotyfService } from '../service/notyf.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';

interface Bank {
  bankCode: string;
  bankName: string;
  bankType: string;
  logo?: string;
}

@Component({
  selector: 'app-show-stocks',
  templateUrl: './show-stocks.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, HomeComponent],
})
export class ShowStocksComponent implements OnInit {
  stockList: any[] = [];
  selectedStock: any;
  buyQuantity: number = 1;
  enteredBuyPin: string = '';
  buyMessage: string = '';
  isSuccessMessage: boolean = false;

  buyQuantityError: 'invalid' | 'exceed' | null = null;
  formValid: boolean = false;

  confirmData: any = null;

  selectedBankType: 'B2C' | 'B2B' = 'B2C';
  selectedBankCode: string = '';
  selectedBank: any = '';
  allBanks: Bank[] = [];
  displayedBanks: Bank[] = [];

  @ViewChild('paymentform') paymentForm!: ElementRef<HTMLFormElement>

  fpxUrl: string = 'https://services.gomobi.io/payment/DirectToFPX.aspx';
  redirectUrl: string = 'http://localhost:8080/api/users/buy-confirm';

  merchantId: string = ' ';
  tid: string = ' ';
  merchantName: string = ' ';
  merchantEmail: string = '';
  buyerName: string = '';
 
  
  private buyModalRef: NgbModalRef | null = null;
  private confirmModalRef: NgbModalRef | null = null;
  private taxesModalRef: NgbModalRef | null = null;

  // 🔧 NEW Spinner Flags
  isBankLoading: boolean = false;
  isRedirectingToFPX: boolean = false;

  @ViewChild('buyModal') buyModalTemplate: any;
  @ViewChild('confirmModal') confirmModalTemplate: any;
  @ViewChild('taxesModal') taxesModalTemplate: any;

  constructor(
    private modalService: NgbModal,
    private stockService: ShowStocksService,
    private notyf: NotyfService
  ) {}

  ngOnInit(): void {
    this.loadStocks();
  }

  loadStocks(): void {
    this.stockService.getAllStocks().subscribe({
      next: (data) => {
        console.log('Stocks data received:', data);
    
        this.stockList = data;
      },
      error: (err) => console.error('Error loading stocks:', err),
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
    this.selectedBankType = 'B2C';
    this.selectedBankCode = '';
    this.selectedBank = '';
    this.buyModalRef = this.modalService.open(this.buyModalTemplate, { backdrop: 'static' });
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

  onBankChange(bank: Bank | null) {
    this.selectedBank = bank;
  }

  proceedToBuy(modal: NgbModalRef): void {
    if (!this.buyQuantity || !this.enteredBuyPin || this.buyQuantityError) {
      this.buyMessage = 'Please enter valid quantity and PIN.';
      this.isSuccessMessage = false;
      return;
    }

    const buyData = {
      stockName: this.selectedStock.stockName,
      stockQuantity: this.buyQuantity,
      accountPIN: this.enteredBuyPin,
      bankCode: this.selectedBank.bankCode,
      bankName: this.selectedBank.bankName,
    };

    this.stockService.buyStock(buyData).subscribe({
      next: (response: any) => {
        console.log(response);
        this.confirmData = response;

        this.isSuccessMessage = true;
        this.buyMessage = '';

        modal.close();

        this.confirmModalRef = this.modalService.open(this.confirmModalTemplate, { backdrop: 'static' });

        this.notyf.success('Stock purchase data received. Please confirm payment.');
        this.loadStocks();
      },
      error: (error: any) => {
        this.buyMessage = error.error?.message || 'Transaction failed.';
        this.isSuccessMessage = false;
        this.notyf.error(this.buyMessage);
      },
    });
  }

  onBankTypeChange(type: 'B2C' | 'B2B'): void {
    this.selectedBankType = type;
    this.selectedBank = '';
    this.selectedBankCode = '';

    this.isBankLoading = true; // 🔧 Start loading

    this.stockService.getAvailableBanks().subscribe({
      next: (res: any) => {
        let rawBankList: any[] = [];

        if (type === 'B2C' && res.responseDataB2C?.bankList) {
          rawBankList = res.responseDataB2C.bankList;
        } else if (type === 'B2B' && res.responseDataB2B?.bankList) {
          rawBankList = res.responseDataB2B.bankList;
        }

        if (Array.isArray(rawBankList)) {
          this.allBanks = rawBankList.map((bank: any) => ({
            bankCode: bank.BankCode || '',
            bankName: bank.BankDisplayName || bank.BankName || '',
            bankType: type,
          }));

          console.log('Mapped Banks:', this.allBanks);
          this.filterBanks();
        } else {
          this.notyf.error('Invalid bank list format');
        }

        this.isBankLoading = false; // 🔧 Stop loading
      },
      error: (err) => {
        console.error('Error loading banks', err);
        this.notyf.error('Could not load bank list');
        this.isBankLoading = false; // 🔧 Stop loading on error
      },
    });
  }

  filterBanks(): void {
    if (this.allBanks.length) {
      this.displayedBanks = this.allBanks.filter((bank: Bank) => bank.bankType === this.selectedBankType);
    }
  }

  onBankSelect(): void {
    const bank = this.displayedBanks.find(b => b.bankName === this.selectedBank);
    this.selectedBankCode = bank?.bankCode || '';
    console.log('Selected BankCode:', this.selectedBankCode);
    console.log(this.confirmData);
  }

  submitFPXForm(): void {
    this.isRedirectingToFPX = true; // 🔧 Show spinner

    setTimeout(() => {
      this.paymentForm.nativeElement.submit();
      // const form = document.querySelector('form#fpxForm') as HTMLFormElement;
      // if (form) {
      //   form.submit();
      //   this.confirmModalRef?.close();
      // } else {
      //   this.notyf.error('FPX form not found.');
      // }
    }, 1200); // small delay to show loading spinner
  }

  openTaxesModal(): void {
    this.taxesModalRef = this.modalService.open(this.taxesModalTemplate);
  }

  isBuyFormComplete(): boolean {
  return (
    this.formValid &&
    this.enteredBuyPin.trim() !== '' &&
    this.selectedBank?.bankCode?.trim() !== ''
  );
}



}
