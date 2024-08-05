import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  FetchWishedProductsResponse,
  RemoveWishedProductRespone,
} from './WishListRes.model';

import { environment } from '../../../environments/environment.development';

const BACKEND_URL = environment.apiUrl + '/wishlist/';

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
        BACKEND_URL + 'fetchWishedProductsAccount',
        {
          params: new HttpParams().append('userId', userId),
        }
      )
      .pipe(
        map((res) => {
          console.log('res: ', res);
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
      BACKEND_URL + 'removeFromWishListAccount',
      {
        params: new HttpParams()
          .append('userId', userId)
          .append('wishedProductId', wishedProductId),
      }
    );
  }
}
