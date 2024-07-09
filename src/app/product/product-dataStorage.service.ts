import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { FetchProductResponse } from './ProductRes.model';

@Injectable({
  providedIn: 'root',
})
export class ProductDataStorageService {
  constructor(private http: HttpClient) {}

  fetchProduct(id: string): Observable<{
    message: string;
    product: {
      id: string;
      productName: string;
      productCategory: {
        id: string;
        categoryName: string;
        properties: { property: string; values: string[] }[];
      };
      productImages: string[];
      description: string;
      priceInPKR: number;
      createdAt: string;
      updatedAt: string;
    };
  }> {
    return this.http
      .get<FetchProductResponse>(
        'http://localhost:3000/api/products/fetchProduct',
        {
          params: new HttpParams().set('id', id),
        }
      )
      .pipe(
        map((res) => {
          return {
            message: res.message,
            product: {
              id: res.product._id,
              productName: res.product.productName,
              productCategory: {
                id: res.product.productCategory._id,
                categoryName: res.product.productCategory.categoryName,
                properties: res.product.productCategory.properties,
              },
              productImages: res.product.productImages,
              description: res.product.description,
              priceInPKR: res.product.priceInPKR,
              createdAt: res.product.createdAt,
              updatedAt: res.product.updatedAt,
            },
          };
        })
      );
  }
}
