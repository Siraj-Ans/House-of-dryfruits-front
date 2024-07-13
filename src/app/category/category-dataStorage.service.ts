import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  FetchCategoryProductsResponse,
  FetchCategoryResponse,
} from './CategoryRes.model';

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
      .get<FetchCategoryProductsResponse>(
        'http://localhost:3000/api/products/fetchCategoryProducts',
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
        'http://localhost:3000/api/categories/fetchCategory',
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
}
