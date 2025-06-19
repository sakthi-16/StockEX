import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';


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

  getFavourites(): Observable<string[]> {
  return this.http.get<string[]>(`${this.baseUrl}/get-favourites`, {
    headers: this.getAuthHeaders(),
    withCredentials: true
  });
}

createCollection(collectionName: string): Observable<any> {
  const params = new HttpParams().set('collectionName', collectionName);
  return this.http.post(`${this.baseUrl}/create-collection`, null, {
    headers: this.getAuthHeaders(),
    params,
    withCredentials: true
  });
}



getCollectionStocks(collectionName: string): Observable<any[]> {
  const params = new HttpParams().set('collectionName', collectionName);
  return this.http.get<any[]>(`${this.baseUrl}/get-collection`, {
    headers: this.getAuthHeaders(),
    params,
    withCredentials: true
  });
}

deleteCollection(collectionName: string): Observable<any> {
  const params = new HttpParams().set('collectionName', collectionName);
  return this.http.patch(`${this.baseUrl}/delete-collection`, null, {
    headers: this.getAuthHeaders(),
    params,
    withCredentials: true
  });
}

undoDeletedCollection(collectionName: string): Observable<any> {
  const params = new HttpParams().set('collectionName', collectionName);
  return this.http.patch(`${this.baseUrl}/undo-deleted-collection`, null, {
    headers: this.getAuthHeaders(),
    params,
    withCredentials: true
  });
}

deleteCollectedStock(payload: any): Observable<any> {
  return this.http.patch(`${this.baseUrl}/delete-collected-stock`, payload, {
    headers: this.getAuthHeaders(),
    withCredentials: true
  });
}

undoDeletedCollectedStock(payload: any): Observable<any> {
  return this.http.patch(`${this.baseUrl}/undo-deleted-collected-stock`, payload, {
    headers: this.getAuthHeaders(),
    withCredentials: true
  });
}

getUserCollections(): Observable<string[]> {
  return this.http.get<string[]>('http://localhost:8080/api/users/get-favourites', {
    headers: this.getAuthHeaders(), withCredentials: true
  });
}

addStockToCollection(payload: { stockName: string, collectionName: string }): Observable<any> {
  return this.http.post<any>('http://localhost:8080/api/users/collection-addition', payload, {
    headers: this.getAuthHeaders(), withCredentials: true
  });
}

createNewCollection(collectionName: string): Observable<any> {
  const params = new HttpParams().set('collectionName', collectionName);
  return this.http.post(`${this.baseUrl}/create-collection`, null, {
    params,
    headers: this.getAuthHeaders(),
    withCredentials: true
  });
}

 getCollectionByName(collectionName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/get-collection`, {
      params: { collectionName },
       headers: this.getAuthHeaders(),
    withCredentials: true
    });
  }





}
