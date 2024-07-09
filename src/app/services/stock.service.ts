import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Stock } from '../models/stocks';
import { Price } from '../models/prices';
import { PriceService } from './price.service';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = this.apiService.apiUrl;  reorderTotal: number = 0;


  constructor(private httpClient: HttpClient, private apiService: ApiService, private priceService: PriceService) {

  }

  getStock(StockId: number) {
    return this.httpClient.get(`${this.apiUrl}Stock/GetStock` + "/" + StockId).pipe(map(result => result))
  }

  getStockByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}Stock/SearchStock/${name}`).pipe(
      map(result => result as any[])
    );
  }

  getStocks(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Stock/GetAllStocks`).pipe(map(result => result))
  }

  addStock(Stock: Stock): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}Stock/AddStock`, Stock, this.apiService.httpOptions)
  }

  deleteStock(StockId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}Stock/DeleteStock` + "/" + StockId, this.apiService.httpOptions)
  }

  editStock(StockId: number, Stock: Stock): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}Stock/UpdateStock/${StockId}`, Stock, this.apiService.httpOptions)
  }
}
