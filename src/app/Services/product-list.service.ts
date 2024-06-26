import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ProductModel } from '../dashboard/product.model';  // To insure structure
@Injectable({
  providedIn: 'root'
})
export class ProductListService {
  // JSON Server URL to perform CRUD
  private baseUrl = 'http://localhost:3000/posts';

  constructor(private http: HttpClient) { }

  // Post Data
  postProduct(data: any) {
    return this.http.post<ProductModel>(this.baseUrl, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Get The Data
  getProduct() {
    return this.http.get<ProductModel>(this.baseUrl).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Modify The Data
  updateProduct(data: ProductModel, id: number) {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<any>(url, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Remove The Data
  deleteProduct(id: number) {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<ProductModel>(url).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
