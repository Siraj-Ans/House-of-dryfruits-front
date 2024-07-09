import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { FetchProductsResponse } from './ProductsRes.model';

@Injectable({ providedIn: 'root' })
export class ProductsDataStorageService {
  constructor(private http: HttpClient) {}

  fetchProducts(): Observable<{
    message: string;
    products: {
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
    }[];
  }> {
    return this.http
      .get<FetchProductsResponse>(
        'http://localhost:3000/api/products/fetchProducts'
      )
      .pipe(
        map((res) => {
          return {
            message: res.message,
            products: res.products.map((product) => {
              return {
                id: product._id,
                productName: product.productName,
                productCategory: {
                  id: product.productCategory._id,
                  categoryName: product.productCategory.categoryName,
                  properties: product.productCategory.properties,
                },
                productImages: product.productImages,
                description: product.description,
                priceInPKR: product.priceInPKR,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
              };
            }),
          };
        })
      );
  }
}
