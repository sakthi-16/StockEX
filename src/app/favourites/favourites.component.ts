// FavouritesComponent.ts (fixed)
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShowStocksService } from '../service/show-stocks.service';
import { NotyfService } from '../service/notyf.service';
import { FavouritesService } from '../service/favourites-service.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [CommonModule, HomeComponent, FormsModule],
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit {
  collectionName: string = '';
  collectionStocks: any[] = [];

  showUndoCollectionModal: boolean = false;
  showUndoStockModal: boolean = false;
  showDeleteEmptyCollectionModal: boolean = false;

  recentlyRemovedStockName: string = '';
  selectedStock: any = null;
  buyQuantity: number = 1;
  enteredBuyPin: string = '';
  buyMessage: string = '';
  isSuccessMessage: boolean = false;
  buyQuantityError: 'invalid' | 'exceed' | null = null;
  formValid: boolean = true;
  confirmData: any = null;

  selectedBankType: 'B2C' | 'B2B' = 'B2C';
  selectedBankCode: string = '';
  selectedBank: any = '';
  allBanks: any[] = [];
  displayedBanks: any[] = [];
  isBankLoading: boolean = false;
  isRedirectingToFPX: boolean = false;

  selectedCollection: string = '';
  favouriteCollections: string[] = [];

  fpxUrl: string = 'https://services.gomobi.io/payment/DirectToFPX.aspx';
  redirectUrl: string = 'http://localhost:8080/api/users/buy-confirm';

  @ViewChild('paymentform') paymentForm!: ElementRef<HTMLFormElement>;
  @ViewChild('buyModal') buyModalTemplate: any;
  @ViewChild('confirmModal') confirmModalTemplate: any;
  @ViewChild('taxesModal') taxesModalTemplate: any;

  private buyModalRef: NgbModalRef | null = null;
  private confirmModalRef: NgbModalRef | null = null;
  private taxesModalRef: NgbModalRef | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stockService: ShowStocksService,
    private notyf: NotyfService,
    private favouritesService: FavouritesService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(query => {
      if (query['undoCollection'] === 'true') {
        this.collectionName = query['collectionName'] || '';
        this.showUndoCollectionModal = true;
      }
    });

    this.route.paramMap.subscribe(params => {
      this.collectionName = params.get('collectionName') || this.collectionName;
      this.collectionStocks = [];

      if (this.collectionName) {
        this.stockService.getCollectionByName(this.collectionName).subscribe({
          next: (stocks) => {
            this.collectionStocks = stocks;
            setTimeout(() => {
              if (this.collectionStocks.length === 0) {
                this.showDeleteEmptyCollectionModal = true;
              }
            }, 0);
          },
          error: () => this.notyf.error('Failed to load collection')
        });
      }
    });
  }

  removeCollection(): void {
    this.favouritesService.deleteCollection(this.collectionName).subscribe({
      next: (res) => {
        this.notyf.success(res.message || 'Collection removed.');
        this.showUndoCollectionModal = true;
      },
      error: () => this.notyf.error('Failed to remove collection.')
    });
  }

  undoCollection(): void {
    this.favouritesService.undoDeletedCollection(this.collectionName).subscribe({
      next: (res) => {
        this.notyf.success(res.message || 'Collection restored.');
        this.showUndoCollectionModal = false;
        this.ngOnInit();
      },
      error: () => this.notyf.error('Failed to restore collection.')
    });
  }

  proceedToHome(): void {
    this.showUndoCollectionModal = false;
    this.router.navigate(['/app-show-stocks']);
  }

  removeStock(stockName: string): void {
    const payload = { stockName, collectionName: this.collectionName };
    this.favouritesService.deleteStockFromCollection(payload).subscribe({
      next: (res) => {
        this.notyf.success(res.message || 'Stock removed.');
        this.collectionStocks = this.collectionStocks.filter(s => s.stockName !== stockName);
        this.recentlyRemovedStockName = stockName;
        setTimeout(() => this.showUndoStockModal = true, 0);
        if (this.collectionStocks.length === 0) {
          setTimeout(() => this.showDeleteEmptyCollectionModal = true, 0);
        }
      },
      error: (err: any) => this.notyf.error(err.error.message || 'Failed to remove stock.')
    });
  }

  undoDeletedStock(): void {
    const payload = {
      stockName: this.recentlyRemovedStockName,
      collectionName: this.collectionName
    };
    this.favouritesService.undoDeletedStock(payload).subscribe({
      next: (res) => {
        this.notyf.success(res.message || 'Stock restored.');
        this.showUndoStockModal = false;
        this.recentlyRemovedStockName = '';
        this.ngOnInit();
      },
      error: () => this.notyf.error('Failed to restore stock.')
    });
  }

  deleteEmptyCollection(): void {
    this.favouritesService.deleteCollectionPermanently(this.collectionName).subscribe({
      next: (res) => {
        this.notyf.success(res.message || 'Empty collection deleted.');
        this.showDeleteEmptyCollectionModal = false;
        this.router.navigate(['/app-show-stocks']);
      },
      error: () => this.notyf.error('Failed to delete empty collection.')
    });
  }

  confirmPermanentStockDeletion(): void {
    const payload = {
      stockName: this.recentlyRemovedStockName,
      collectionName: this.collectionName
    };
    this.favouritesService.deleteStockPermanently(payload).subscribe({
      next: (res) => {
        this.notyf.success(res.message || 'Stock permanently deleted.');
        this.showUndoStockModal = false;
      },
      error: () => this.notyf.error('Failed to permanently delete stock.')
    });
  }

  confirmPermanentCollectionDeletion(): void {
    this.favouritesService.deleteCollectionPermanently(this.collectionName).subscribe({
      next: (res) => {
        this.notyf.success(res.message || 'Collection permanently deleted.');
        this.showUndoCollectionModal = false;
        this.router.navigate(['/app-show-stocks']);
      },
      error: () => this.notyf.error('Failed to permanently delete collection.')
    });
  }

  handleStockPermanentNo(): void {
    this.confirmPermanentStockDeletion();
    this.showUndoStockModal = false;
  }

  handleCollectionPermanentNo(): void {
    this.confirmPermanentCollectionDeletion();
    this.showDeleteEmptyCollectionModal = false;
    this.showUndoCollectionModal = false;
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

  onBankChange(bank: any) {
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
      bankName: this.selectedBank.bankName
    };

    this.stockService.buyStock(buyData).subscribe({
      next: (response: any) => {
        this.confirmData = response;
        this.isSuccessMessage = true;
        this.buyMessage = '';
        modal.close();
        this.confirmModalRef = this.modalService.open(this.confirmModalTemplate, { backdrop: 'static' });
        this.notyf.success('Stock purchase data received. Please confirm payment.');
        this.ngOnInit();
      },
      error: (error: any) => {
        this.buyMessage = error.error.message || 'Transaction failed.';
        this.isSuccessMessage = false;
        this.notyf.error(this.buyMessage);
      }
    });
  }

  onBankTypeChange(type: 'B2C' | 'B2B'): void {
    this.selectedBankType = type;
    this.selectedBank = '';
    this.selectedBankCode = '';
    this.isBankLoading = true;

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
            bankType: type
          }));
          this.filterBanks();
        } else {
          this.notyf.error('Invalid bank list format');
        }
        this.isBankLoading = false;
      },
      error: (err) => {
        console.error('Error loading banks', err);
        this.notyf.error('Could not load bank list');
        this.isBankLoading = false;
      }
    });
  }

  filterBanks(): void {
    this.displayedBanks = this.allBanks.filter((bank: any) => bank.bankType === this.selectedBankType);
  }

  onBankSelect(): void {
    const bank = this.displayedBanks.find(b => b.bankName === this.selectedBank);
    this.selectedBankCode = bank?.bankCode || '';
  }

  submitFPXForm(): void {
    this.isRedirectingToFPX = true;
    setTimeout(() => {
      this.paymentForm.nativeElement.submit();
    }, 1200);
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
