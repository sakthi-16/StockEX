import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountDepositWithdrawServiceService {

  constructor() { }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountDepositWithdrawService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: 'Bearer ' + token
    });
  }

  deposit(amount: number, accountPIN: string): Observable<any> {
    const body = { amount, accountPIN };
    return this.http.patch<any>(`${this.baseUrl}/deposit`, body, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  withdraw(amount: number, accountPIN: string): Observable<any> {
    const body = { amount, accountPIN };
    return this.http.patch<any>(`${this.baseUrl}/withdraw`, body, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }
}
