import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShowStocksService } from '../service/show-stocks.service';
import { NotyfService } from '../service/notyf.service';
import { FavouritesService } from '../service/favourites-service.service';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [CommonModule, HomeComponent],
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit {
  collectionName: string = '';
  collectionStocks: any[] = [];

  showUndoCollectionModal: boolean = false;
  showUndoStockModal: boolean = false;

  recentlyRemovedStockName: string = '';

  showDeleteEmptyCollectionModal: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stockService: ShowStocksService,
    private notyf: NotyfService,
    private favouritesService: FavouritesService
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
          console.log("Stocks loaded:", stocks);
          console.log("Show empty modal?", stocks.length === 0);
          this.collectionStocks = stocks;

          // ✅ Delay modal check to next change detection cycle
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
      this.showUndoCollectionModal = true; // Show modal here
    },
    error: () => this.notyf.error('Failed to remove collection.')
  });
}

 undoCollection(): void {
  this.favouritesService.undoDeletedCollection(this.collectionName).subscribe({
    next: (res) => {
      this.notyf.success(res.message || 'Collection restored.');
      this.showUndoCollectionModal = false;
      this.ngOnInit(); // Reload
    },
    error: () => this.notyf.error('Failed to restore collection.')
  });
}

proceedToHome(): void {
  this.showUndoCollectionModal = false;
  this.router.navigate(['/app-show-stocks']);
}


 removeStock(stockName: string): void {
  const payload = {
    stockName,
    collectionName: this.collectionName
  };

  this.favouritesService.deleteStockFromCollection(payload).subscribe({
    next: (res) => {
      this.notyf.success(res.message || 'Stock removed.');
      this.collectionStocks = this.collectionStocks.filter(s => s.stockName !== stockName);
      this.recentlyRemovedStockName = stockName;

      // ✅ Show undo stock modal
      setTimeout(() => {
        this.showUndoStockModal = true;
      }, 0);

      // ✅ Check if now the list is empty, show delete confirmation
      if (this.collectionStocks.length === 0) {
        setTimeout(() => {
          this.showDeleteEmptyCollectionModal = true;
        }, 0);
      }
    },
    error: (err:any) => this.notyf.error(err.error.message || 'Failed to remove stock.')
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
      this.recentlyRemovedStockName = ''; // ✅ Reset so heart becomes red
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
  this.showUndoCollectionModal = false; // if needed
}


}
