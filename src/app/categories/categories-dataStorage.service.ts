import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  FetchCategoriesProductsResponse,
  FetchCategoriesResponse,
  FetchWishedProductsResponse,
  RemoveWishedProductRespone,
  SaveWishedProductResponse,
} from './CategoriesRes.model';

@Injectable({ providedIn: 'root' })
export class CategoriesDataStorageService {
  constructor(private http: HttpClient) {}

  fetchCategories(): Observable<{
    message: string;
    categories: {
      id: string;
      categoryName: string;
      parent?: {
        id: string;
        categoryName: string;
        properties: { property: string; values: string[] }[];
      };
      properties: { property: string; values: string[] }[];
    }[];
  }> {
    return this.http
      .get<FetchCategoriesResponse>(
        'http://localhost:3000/api/categories/fetchCategories'
      )
      .pipe(
        map((responseData) => {
          return {
            message: responseData.message,
            categories: responseData.categories.map((category) => {
              if (category.parent) {
                return {
                  id: category._id,
                  categoryName: category.categoryName,
                  parent: {
                    id: category.parent._id,
                    categoryName: category.parent.categoryName,
                    properties: category.parent.properties,
                  },
                  properties: category.properties.map((property) => {
                    return {
                      property: property.property,
                      values: property.values,
                    };
                  }),
                };
              }
              return {
                id: category._id,
                categoryName: category.categoryName,
                properties: category.properties.map((property) => {
                  return {
                    property: property.property,
                    values: property.values,
                  };
                }),
              };
            }),
          };
        })
      );
  }

  fetchCategoriesProducts(categoryIds: string): Observable<{
    message: string;
    categoriesProducts: {
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
      .get<FetchCategoriesProductsResponse>(
        'http://localhost:3000/api/products/fetchCategoriesProducts',
        {
          params: new HttpParams().set('categoryIds', categoryIds),
        }
      )
      .pipe(
        map((res) => {
          return {
            message: res.message,
            categoriesProducts: res.categoriesProducts.map((product) => {
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
        'http://localhost:3000/api/wishlist/saveToWishList',
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
        'http://localhost:3000/api/wishlist/fetchWishedProducts',
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
      'http://localhost:3000/api/wishlist/removeFromWishList',
      {
        params: new HttpParams()
          .append('userId', userId)
          .append('productId', productId),
      }
    );
  }
}
