import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserAccountHistoryDTO {
  currentAccountBalance: number;
  amountTransacted: number;
  amountTransactedTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecentAccountTransactionService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: 'Bearer ' + token
    });
  }

  getRecentTransactions(): Observable<UserAccountHistoryDTO[]> {
    return this.http.get<UserAccountHistoryDTO[]>(`${this.baseUrl}/recentAccountTransactions`, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }
}
