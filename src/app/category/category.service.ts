import { Injectable } from '@angular/core';

import { CategoryDataStorageService } from './category-dataStorage.service';
import { ReplaySubject, Subject } from 'rxjs';
import { Product } from '../new-product/product.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  wishedProducts: string[] = [];
  updatedLoadingStatus = new Subject<boolean>();
  updateWishedProducts = new Subject<string[]>();
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

  addProductToWishList(productId: string, userId: string): void {
    this.updatedLoadingStatus.next(true);
    this.categoryDataStorageService
      .saveProductOnWishList(productId, userId)
      .subscribe({
        next: (res) => {
          this.wishedProducts.push(res.wishedProduct.product);
          this.updateWishedProducts.next(this.wishedProducts.slice());
        },
        error: () => {
          this.updatedLoadingStatus.next(false);
        },
        complete: () => {
          this.updatedLoadingStatus.next(true);
        },
      });
  }

  getWishedProducts(userId: string, newProducts: string[]): void {
    this.categoryDataStorageService
      .fetchWishedProducts(userId, newProducts)
      .subscribe({
        next: (res) => {
          this.wishedProducts = res.wishedProducts.map((wp) => wp.product);
          this.updateWishedProducts.next(this.wishedProducts.slice());
        },
        error: () => {},
        complete: () => {},
      });
  }

  removeProductFromWishList(userId: string, productId: string): void {
    this.updatedLoadingStatus.next(true);
    this.categoryDataStorageService
      .removeProductFromWishlist(userId, productId)
      .subscribe({
        next: (res) => {
          const index = this.wishedProducts.indexOf(productId);

          this.wishedProducts.splice(index, 1);

          this.updateWishedProducts.next(this.wishedProducts.slice());
        },
        error: () => {
          this.updatedLoadingStatus.next(false);
        },
        complete: () => {
          this.updatedLoadingStatus.next(false);
        },
      });
  }
}
