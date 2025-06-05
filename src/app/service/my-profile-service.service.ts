import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
  userName: string;
  userId: number;
  email: string;
  bankName: string;
  currentBalance: number;
  accountPIN: string;
}

@Injectable({
  providedIn: 'root'
})
export class MyProfileService {
  private apiUrl = 'http://localhost:8080/api/users/myProfile'; // Adjust if needed

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.apiUrl, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }
}
