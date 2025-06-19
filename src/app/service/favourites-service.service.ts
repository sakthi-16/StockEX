import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavouritesService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }

  getCollectionByName(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/get-collection?collectionName=${encodeURIComponent(name)}`, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  //  Remove a collection
  deleteCollection(collectionName: string): Observable<any> {
    return this.http.patch<any>(
      `${this.baseUrl}/delete-collection?collectionName=${encodeURIComponent(collectionName)}`,
      {},
      { headers: this.getAuthHeaders(), withCredentials: true }
    );
  }

  //  Undo deleted collection
  undoDeletedCollection(collectionName: string): Observable<any> {
    return this.http.patch<any>(
      `${this.baseUrl}/undo-deleted-collection?collectionName=${encodeURIComponent(collectionName)}`,
      {},
      { headers: this.getAuthHeaders(), withCredentials: true }
    );
  }

  //  Remove a stock from a collection
  deleteStockFromCollection(payload: { stockName: string; collectionName: string }): Observable<any> {
    return this.http.patch<any>(
      `${this.baseUrl}/delete-collected-stock`,
      payload,
      { headers: this.getAuthHeaders(), withCredentials: true }
    );
  }

  //  Undo deleted stock
  undoDeletedStock(payload: { stockName: string; collectionName: string }): Observable<any> {
    return this.http.patch<any>(
      `${this.baseUrl}/undo-deleted-collected-stock`,
      payload,
      { headers: this.getAuthHeaders(), withCredentials: true }
    );
  }

  // Permanent-delete
deleteStockPermanently(payload: { stockName: string; collectionName: string }): Observable<any> {
  return this.http.put<any>(
    `${this.baseUrl}/delete-collected-stock`,
    payload,
    { headers: this.getAuthHeaders(), withCredentials: true }
  );
}

deleteCollectionPermanently(collectionName: string): Observable<any> {
  return this.http.put<any>(
    `${this.baseUrl}/delete-collection?collectionName=${encodeURIComponent(collectionName)}`,
    {},
    { headers: this.getAuthHeaders(), withCredentials: true }
  );
}

}
