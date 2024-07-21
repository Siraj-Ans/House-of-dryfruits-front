import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  FetchWishedProductsResponse,
  RemoveWishedProductRespone,
} from './WishListRes.model';

@Injectable({
  providedIn: 'root',
})
export class WishListDataStorageService {
  constructor(private http: HttpClient) {}

  fetchWishedProducts(userId: string): Observable<{
    message: string;
    wishedProducts: {
      id: string;
      user: string;
      product: {
        id: string;
        productName: string;
        productCategory: string;
        productImages: string[];
        description: string;
        priceInPKR: number;
      };
    }[];
  }> {
    return this.http
      .get<FetchWishedProductsResponse>(
        'http://localhost:3000/api/wishlist/fetchWishedProductsAccount',
        {
          params: new HttpParams().append('userId', userId),
        }
      )
      .pipe(
        map((res) => {
          return {
            message: res.message,
            wishedProducts: res.wishedProducts.map((wishedProduct) => {
              return {
                id: wishedProduct._id,
                user: wishedProduct.user,
                product: {
                  id: wishedProduct.product._id,
                  productName: wishedProduct.product.productName,
                  productCategory: wishedProduct.product.productCategory,
                  productImages: wishedProduct.product.productImages,
                  description: wishedProduct.product.description,
                  priceInPKR: wishedProduct.product.priceInPKR,
                },
              };
            }),
          };
        })
      );
  }

  removeProductFromWishlist(
    userId: string,
    wishedProductId: string
  ): Observable<{
    message: string;
  }> {
    return this.http.delete<RemoveWishedProductRespone>(
      'http://localhost:3000/api/wishlist/removeFromWishListAccount',
      {
        params: new HttpParams()
          .append('userId', userId)
          .append('wishedProductId', wishedProductId),
      }
    );
  }
}
