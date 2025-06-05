import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountAdditionService {

  private apiUrl = 'http://localhost:8080/api/users/accountAddition'; // change based on your backend route

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
  }

  addAccount(data: any): Observable<string> {
    return this.http.post(this.apiUrl, data, { headers: this.getAuthHeaders(),
      withCredentials: true, responseType: 'text' });
  }
}
