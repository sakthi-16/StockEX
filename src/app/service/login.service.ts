import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class LoginService {
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient,private router: Router) {}

  login(credentials: { email: string; password: string }): Observable<{ token: string, isLinkedAccount: boolean }> {
  return this.http.post<{ token: string, isLinkedAccount: boolean }>(
    `${this.baseUrl}/login`,
    credentials,
    { observe: 'body' }
  );
}


  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

   logout() {
  localStorage.removeItem('token');
  this.router.navigate(['/app-login']);
}

sendOtp(email: string): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/forgot-password`, { email });
}


verifyOtp(data: { email: string, otp: string }) {
  return this.http.post(`${this.baseUrl}/verify-otp`, data);
}


resetPassword(email: string, newPassword: string,confirmPassword:string): Observable<any> {
  return this.http.post(`${this.baseUrl}/reset-password`, { email, newPassword,confirmPassword });
}
}
