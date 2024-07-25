import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  FetchProductResponse,
  FetchReviewsResponse,
  SaveReviewResponse,
} from './ProductRes.model';

import { environment } from '../../environments/environment.development';

const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class ProductDataStorageService {
  constructor(private http: HttpClient) {}

  fetchProduct(productId: string): Observable<{
    message: string;
    product: {
      id: string;
      productName: string;
      productCategory: string;
      productImages: string[];
      description: string;
      priceInPKR: number;
      createdAt: string;
      updatedAt: string;
    };
  }> {
    return this.http
      .get<FetchProductResponse>(BACKEND_URL + '/products/fetchProduct', {
        params: new HttpParams().set('productId', productId),
      })
      .pipe(
        map((res) => {
          return {
            message: res.message,
            product: {
              id: res.product._id,
              productName: res.product.productName,
              productCategory: res.product.productCategory,
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

  saveReview(
    title: string,
    comment: string,
    stars: number,
    productId: string
  ): Observable<{
    message: string;
    review: {
      id: string;
      title: string;
      comment: string;
      stars: number;
      productId: string;
    };
  }> {
    return this.http
      .post<SaveReviewResponse>(BACKEND_URL + '/reviews/saveReview', {
        title: title,
        comment: comment,
        stars: stars,
        productId: productId,
      })
      .pipe(
        map((res) => {
          return {
            message: res.message,
            review: {
              id: res.review._id,
              title: res.review.title,
              comment: res.review.comment,
              stars: res.review.stars,
              productId: res.review.productId,
            },
          };
        })
      );
  }

  fetchReviews(productId: string): Observable<{
    message: string;
    reviews: {
      id: string;
      title: string;
      comment: string;
      stars: number;
      productId: string;
      createdAt: string;
      updatedAt: string;
    }[];
  }> {
    return this.http
      .get<FetchReviewsResponse>(BACKEND_URL + '/reviews/fetchReviews', {
        params: new HttpParams().set('productId', productId),
      })
      .pipe(
        map((res) => {
          return {
            message: res.message,
            reviews: res.reviews.map((review) => {
              return {
                id: review._id,
                title: review.title,
                comment: review.comment,
                stars: review.stars,
                productId: review.productId,
                createdAt: new Date(review.createdAt).toLocaleString('en-us'),
                updatedAt: review.updatedAt,
              };
            }),
          };
        })
      );
  }
}
