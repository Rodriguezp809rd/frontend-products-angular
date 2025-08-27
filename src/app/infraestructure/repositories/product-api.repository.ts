import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product, ApiListResponse } from '../../core/models/product.model';

const BASE = 'http://localhost:3002/bp';
const RESOURCE = `${BASE}/products`;

@Injectable({ providedIn: 'root' })
export class ProductApiRepository {

  constructor(private http: HttpClient) {}

getProducts(opts: { page?: number; limit?: number; search?: string } = {}) {
  let params = new HttpParams();
  if (opts.page != null)  params = params.set('page', String(opts.page));
  if (opts.limit != null) params = params.set('limit', String(opts.limit));
  if (opts.search && opts.search.trim()) params = params.set('search', opts.search.trim());
  return this.http.get<ApiListResponse<Product>>(RESOURCE, { params });
}

  getProductsOnly(params?: { page?: number; limit?: number }): Observable<Product[]> {
    return this.getProducts(params).pipe(map(res => res.data ?? []));
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${RESOURCE}/${encodeURIComponent(id)}`);
  }


  verifyId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${RESOURCE}/verification/${encodeURIComponent(id)}`);
  }

  createProduct(product: Product): Observable<{ message: string; data: Product }> {
    return this.http.post<{ message: string; data: Product }>(RESOURCE, product);
  }

  updateProduct(id: string, partial: Partial<Product>): Observable<{ message: string; data: Product }> {
    return this.http.put<{ message: string; data: Product }>(
      `${RESOURCE}/${encodeURIComponent(id)}`,
      partial
    );
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${RESOURCE}/${encodeURIComponent(id)}`);
  }
}
