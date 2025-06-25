import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddStockService, Stock } from '../service/add-stock-service.service';
import { AdminNavBarComponent } from "../admin-nav-bar/admin-nav-bar.component";
import { NotyfService } from '../service/notyf.service';

@Component({
  selector: 'app-add-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavBarComponent],
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.css']
})
export class AddStockComponent {
  stock: Stock = {
    stockName: '',
    stocksImage: '',
    stocksDeclared: 0,
    totalStocks: 0
  };

  // successMessage: string = '';
  // errorMessage: string = '';

  constructor(private addStockService: AddStockService, private notyf: NotyfService) {}

  onSubmit(): void {
    // this.successMessage = '';
    // this.errorMessage = '';

    this.addStockService.addStock(this.stock).subscribe({
      next: (res) => {
        // this.successMessage = res.message;
        this.notyf.success(res.message);
        this.stock = { stockName: '', stocksImage: '', stocksDeclared: 0, totalStocks: 0 };
      },
      error: (err) => {
        // this.errorMessage = err.error.message;
        this.notyf.error(err.error.message);
      }
    });
  }
  preventDecimalInput(event: KeyboardEvent): void {
  const invalidChars = ['.', ',', 'e', 'E', '+', '-'];
  if (invalidChars.includes(event.key)) {
    event.preventDefault();
  }
}

}
