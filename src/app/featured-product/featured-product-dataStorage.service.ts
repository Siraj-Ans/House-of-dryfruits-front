import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { FetchFeaturedProduct } from './FeaturedProductRes.model';

import { environment } from '../../environments/environment.development';

const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class FeaturedProductDataStorageService {
  constructor(private http: HttpClient) {}

  fetchFeaturedProduct(): Observable<{
    message: string;
    featuredProduct?: {
      id: string;
      productName: string;
      productCategory: string;
      productImages: string[];
      description: string;
      priceInPKR: number;
    } | null;
  }> {
    return this.http
      .get<FetchFeaturedProduct>(BACKEND_URL + '/settings/fetchFeaturedProduct')
      .pipe(
        map((res) => {
          return {
            message: res.message,
            featuredProduct: res.featuredProduct
              ? {
                  id: res.featuredProduct._id,
                  productName: res.featuredProduct.productName,
                  productCategory: res.featuredProduct.productCategory,
                  productImages: res.featuredProduct.productImages,
                  description: res.featuredProduct.description,
                  priceInPKR: res.featuredProduct.priceInPKR,
                }
              : null,
          };
        })
      );
  }
}
