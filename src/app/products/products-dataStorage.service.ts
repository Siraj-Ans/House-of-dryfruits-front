import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  FetchProductsResponse,
  FetchWishedProductsResponse,
  RemoveWishedProductRespone,
  SaveWishedProductResponse,
} from './ProductsRes.model';

import { environment } from '../../environments/environment.development';

const BACKEND_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class ProductsDataStorageService {
  constructor(private http: HttpClient) {}

  fetchProducts(): Observable<{
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
      .get<FetchProductsResponse>(BACKEND_URL + '/products/fetchProductsFront')
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

  saveProductOnWishList(
    productId: string,
    userId: string
  ): Observable<{
    message: string;
    wishedProduct: {
      user: string;
      product: string;
      id: string;
    };
  }> {
    return this.http
      .post<SaveWishedProductResponse>(
        BACKEND_URL + '/wishlist/saveToWishList',
        {
          productId: productId,
          userId: userId,
        }
      )
      .pipe(
        map((res) => {
          return {
            message: res.message,
            wishedProduct: {
              id: res.wishedProduct._id,
              user: res.wishedProduct.user,
              product: res.wishedProduct.product,
            },
          };
        })
      );
  }

  fetchWishedProducts(
    userId: string,
    newProducts: string[]
  ): Observable<{
    message: string;
    wishedProducts: {
      id: string;
      user: string;
      product: string;
    }[];
  }> {
    return this.http
      .get<FetchWishedProductsResponse>(
        BACKEND_URL + '/wishlist/fetchWishedProducts',
        {
          params: new HttpParams()
            .append('userId', userId)
            .append('newProducts', JSON.stringify(newProducts)),
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
                product: wishedProduct.product,
              };
            }),
          };
        })
      );
  }

  removeProductFromWishlist(
    userId: string,
    productId: string
  ): Observable<{
    message: string;
  }> {
    return this.http.delete<RemoveWishedProductRespone>(
      BACKEND_URL + '/wishlist/removeFromWishList',
      {
        params: new HttpParams()
          .append('userId', userId)
          .append('productId', productId),
      }
    );
  }
}
