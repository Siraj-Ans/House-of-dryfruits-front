import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { FetchCartItemProducts, FetchShippingFee } from './CartRes.model';

import { environment } from '../../environments/environment.development';

const BACKEND_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class CartDataStorageService {
  constructor(private http: HttpClient) {}

  fetchCartItemProducts(cartItemIds: string[]): Observable<{
    message: string;
    products: {
      id: string;
      productName: string;
      productCategory: string;
      productImages: string[];
      description: string;
      priceInPKR: number;
      createdAt: string;
      updatedAt: string;
    }[];
  }> {
    return this.http
      .get<FetchCartItemProducts>(BACKEND_URL + '/products/fetchCartProducts', {
        params: new HttpParams().set('productIds', JSON.stringify(cartItemIds)),
      })
      .pipe(
        map((res) => {
          return {
            message: res.message,
            products: res.products.map((product) => {
              return {
                id: product._id,
                productName: product.productName,
                productCategory: product.productCategory,
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

  fetchShippingFee(): Observable<{
    message: string;
    shippingFee: number;
  }> {
    return this.http.get<FetchShippingFee>(
      BACKEND_URL + '/settings/fetchShippingfee'
    );
  }
}
