import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Stock {
  stockName: string;
  stocksImage: string;
  stocksDeclared: number;
  totalStocks: number;
  stockPrice?: number; // Calculated in backend
}

@Injectable({
  providedIn: 'root'
})
export class AddStockService {
  private baseUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  addStock(stock: Stock): Observable<any> {
    return this.http.post(`${this.baseUrl}/addStocks`, stock, {
      headers: this.getAuthHeaders()
    });
  }
}
