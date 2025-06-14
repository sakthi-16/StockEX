import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShowStocksService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }

  getAllStocks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/showStocks`, {
      headers: this.getAuthHeaders(), withCredentials: true
    });
  }

  buyStock(data: {
    stockName: string;
    stockQuantity: number;
    accountPIN: string;
    bankCode?: string;                          
  }): Observable<any> {
    console.log("data is",data);
    
    return this.http.post<any>(`${this.baseUrl}/buy`, data, {
      headers: this.getAuthHeaders(), withCredentials: true
    });
  }

  getAvailableBanks(): Observable<any> {
    const payload = { "Service": "FULL_LIST" };
    return this.http.post<any>('https://services.gomobi.io/api/fpx', payload);
  }
}
