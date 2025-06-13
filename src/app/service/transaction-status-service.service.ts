import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TransactionStatusDTO {
  sellerOrderNo: string;
  stockName: string;
  stockQuantity: number;
  transactionStatus: 'Success' | 'Failure';
}

@Injectable({
  providedIn: 'root'
})
export class TransactionStatusService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: 'Bearer ' + token
    });
  }

  getTransactionStatus(): Observable<TransactionStatusDTO[]> {
    return this.http.get<TransactionStatusDTO[]>(`${this.baseUrl}/transaction-status`, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }
}
