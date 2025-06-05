import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TransactionHistoryDTO {
  stockName: string;
  stockImage: string;
  amountCameInOrGoneOut: number;
  transactionType:string
}

@Injectable({
  providedIn: 'root'
})
export class RecentStocksTransactionsService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: 'Bearer ' + token
    });
  }

  getStockTransactionHistory(): Observable<TransactionHistoryDTO[]> {
    return this.http.get<TransactionHistoryDTO[]>(`${this.baseUrl}/allStockTransactions`, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }
}
