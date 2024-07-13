import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  FetchCategoriesProductsResponse,
  FetchCategoriesResponse,
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
}
