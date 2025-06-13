import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { UpdateStockService } from '../service/update-stock-price-service.service';
import { AdminNavBarComponent } from "../admin-nav-bar/admin-nav-bar.component";
import { NotyfService } from '../service/notyf.service';

@Component({
  selector: 'app-update-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavBarComponent],
  providers: [UpdateStockService], // ✅ ADD THIS
  templateUrl: './update-stock-price.component.html',
  styleUrls: ['./update-stock-price.component.css']
})
export class UpdateStockPriceComponent implements OnInit {
  stockList: any[] = [];
  selectedStock: any = null;
  newPrice: number = 0;

  // ✅ Use inject() when using standalone components and no constructor
  private stockService = inject(UpdateStockService);
  private modalService = inject(NgbModal);

  ngOnInit(): void {
    this.loadStocks();
  }

    constructor(
      private notyf: NotyfService
    ){}

  loadStocks(): void {
    this.stockService.getStocks().subscribe({
      next: data => this.stockList = data,
      error: err => console.error('Failed to load stocks', err)
    });
  }

  openUpdateModal(content: any, stock: any): void {
    this.selectedStock = stock;
    this.newPrice = 0;
    this.modalService.open(content, { centered: true });
  }

  updateStock(modalRef: any): void {
    if (!this.newPrice || this.newPrice <= 0) return;

    const updateData = {
      stockName: this.selectedStock.stockName,
      stockPrice: this.newPrice
    };

    this.stockService.updateStock(updateData).subscribe({
      next: (res) => {
        modalRef.close();
        this.loadStocks();
        this.notyf.success(res.message);
      },
      error: (err) => {
        console.error('Update failed', err);
        this.notyf.error(err.error.message);
      }
    });
  }
}
