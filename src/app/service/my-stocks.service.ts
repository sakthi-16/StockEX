import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MyStocksService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
  }

  sellStock(data: { stockName: string; stockQuantity: number; accountPIN: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/sell`, data, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  getUserHoldings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/myStocks`, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }
}
