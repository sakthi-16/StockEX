import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UpdateStockService {
  private baseUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: 'Bearer ' + token });
  }

  updateStock(data: { stockName: string; stockPrice: number }): Observable<any> {
    return this.http.patch(`${this.baseUrl}/updateStock`, data, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  getStocks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/showStocks`, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }
}
