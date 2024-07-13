import { Injectable } from '@angular/core';

import { CategoryDataStorageService } from './category-dataStorage.service';
import { ReplaySubject } from 'rxjs';
import { Product } from '../new-product/product.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  udatedCategoryProducts = new ReplaySubject<Product[]>(0);

  constructor(private categoryDataStorageService: CategoryDataStorageService) {}

  getCategoryProducts(categoryId: string): void {
    this.categoryDataStorageService
      .fetchCategoryProducts(categoryId)
      .subscribe({
        next: (res) => {
          this.udatedCategoryProducts.next(res.categoryProducts);
        },
        error: () => {},
        complete: () => {},
      });
  }
}
