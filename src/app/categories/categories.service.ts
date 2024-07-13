import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { CategoriesDataStorageService } from './categories-dataStorage.service';

import { Category } from './category.model';
import { CategoryProduct } from './CategoryProduct.model';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  updatedCategoriesProducts = new ReplaySubject<CategoryProduct>(0);
  updateMainCategories = new ReplaySubject<Category[]>(0);
  updateCategories = new ReplaySubject<Category[]>(0);
  updateCategory = new ReplaySubject<Category>(0);

  constructor(
    private categoriesDataStorageService: CategoriesDataStorageService
  ) {}

  getCategories(): Observable<{
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
    return this.categoriesDataStorageService.fetchCategories();
  }

  getCategoriesProducts(categoryIds: string): Observable<{
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
    return this.categoriesDataStorageService.fetchCategoriesProducts(
      categoryIds
    );
  }
}
