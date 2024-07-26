import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  FetchCategoryOldestProductsResponse,
  FetchCategoryProductsByHighestPriceResponse,
  FetchCategoryProductsByLowestPriceResponse,
  FetchCategoryProductsResponse,
  FetchCategoryResponse,
  FetchWishedProductsResponse,
  RemoveWishedProductRespone,
  SaveWishedProductResponse,
} from './CategoryRes.model';

import { environment } from '../../environments/environment.development';

const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class CategoryDataStorageService {
  constructor(private http: HttpClient) {}

  fetchCategoryProducts(categoryId: string): Observable<{
    message: string;
    categoryProducts: {
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
      .get<FetchCategoryProductsResponse>(
        'https://house-of-dryfruits-backend.onrender.com/api/products/fetchCategoryProducts',
        {
          params: new HttpParams().set('categoryId', categoryId),
        }
      )
      .pipe(
        map((res) => {
          return {
            message: res.message,
            categoryProducts: res.categoryProducts.map((product) => {
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

  fetchCategory(categoryId: string): Observable<{
    message: string;
    category: {
      id: string;
      categoryName: string;
      parent?: {
        id: string;
        categoryName: string;
        properties: { property: string; values: string[] }[];
      };
      properties: { property: string; values: string[] }[];
    };
  }> {
    return this.http
      .get<FetchCategoryResponse>(
        'https://house-of-dryfruits-backend.onrender.com/api/categories/fetchCategory',
        {
          params: new HttpParams().set('categoryId', categoryId),
        }
      )
      .pipe(
        map((responseData) => {
          if (responseData.category.parent) {
            return {
              message: responseData.message,
              category: {
                id: responseData.category._id,
                categoryName: responseData.category.categoryName,
                parent: {
                  id: responseData.category.parent._id,
                  categoryName: responseData.category.parent.categoryName,
                  properties: responseData.category.parent.properties,
                },
                properties: responseData.category.properties.map((property) => {
                  return {
                    property: property.property,
                    values: property.values,
                  };
                }),
              },
            };
          }
          return {
            message: responseData.message,
            category: {
              id: responseData.category._id,
              categoryName: responseData.category.categoryName,
              properties: responseData.category.properties.map((property) => {
                return {
                  property: property.property,
                  values: property.values,
                };
              }),
            },
          };
        })
      );
  }

  getOldestCategoryProducts(categoryId: string): Observable<{
    message: string;
    categoryProducts: {
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
      .get<FetchCategoryOldestProductsResponse>(
        'https://house-of-dryfruits-backend.onrender.com/api/products/fetchOldestCategoryProducts',
        {
          params: new HttpParams().set('categoryId', categoryId),
        }
      )
      .pipe(
        map((res) => {
          return {
            message: res.message,
            categoryProducts: res.categoryProducts.map((product) => {
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

  getCategoryProductsByLowestPrice(categoryId: string): Observable<{
    message: string;
    categoryProducts: {
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
      .get<FetchCategoryProductsByLowestPriceResponse>(
        'https://house-of-dryfruits-backend.onrender.com/api/products/fetchCategoryProductsByLowestPrice',
        {
          params: new HttpParams().set('categoryId', categoryId),
        }
      )
      .pipe(
        map((res) => {
          return {
            message: res.message,
            categoryProducts: res.categoryProducts.map((product) => {
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

  getCategoryProductsByHighestPrice(categoryId: string): Observable<{
    message: string;
    categoryProducts: {
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
      .get<FetchCategoryProductsByHighestPriceResponse>(
        'https://house-of-dryfruits-backend.onrender.com/api/products/fetchCategoryProductsByHighestPrice',
        {
          params: new HttpParams().set('categoryId', categoryId),
        }
      )
      .pipe(
        map((res) => {
          return {
            message: res.message,
            categoryProducts: res.categoryProducts.map((product) => {
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
        'https://house-of-dryfruits-backend.onrender.com/api/wishlist/saveToWishList',
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
        'https://house-of-dryfruits-backend.onrender.com/api/wishlist/fetchWishedProducts',
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
      'https://house-of-dryfruits-backend.onrender.com/api/wishlist/removeFromWishList',
      {
        params: new HttpParams()
          .append('userId', userId)
          .append('productId', productId),
      }
    );
  }
}
