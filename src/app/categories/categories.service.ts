import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';

import { CategoriesDataStorageService } from './categories-dataStorage.service';
import { ToastService } from '../toast.service';

import { Category } from './category.model';
import { CategoryProduct } from './CategoryProduct.model';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  wishedProducts: string[] = [];
  updateLoadingStatus = new ReplaySubject<boolean>(0);
  updateWishedProducts = new Subject<string[]>();
  updatedCategoriesProducts = new ReplaySubject<CategoryProduct>(0);
  updateMainCategories = new ReplaySubject<Category[]>(0);
  updateCategories = new ReplaySubject<Category[]>(0);
  updateCategory = new ReplaySubject<Category>(0);

  constructor(
    private categoriesDataStorageService: CategoriesDataStorageService,
    private toastr: ToastService
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

  addProductToWishList(productId: string, userId: string): void {
    this.updateLoadingStatus.next(true);
    this.categoriesDataStorageService
      .saveProductOnWishList(productId, userId)
      .subscribe({
        next: (res) => {
          this.toastr.showSuccess('Product saved to the wishlist!', '', {
            toastClass: 'success-toast',
            timeOut: 3000,
            extendedTimeOut: 1000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
          });
          this.wishedProducts.push(res.wishedProduct.product);
          this.updateWishedProducts.next(this.wishedProducts.slice());
        },
        error: (err) => {
          if (!err.status)
            this.toastr.showError('Server failed!', '', {
              toastClass: 'error-toast',
              timeOut: 3000,
              extendedTimeOut: 1000,
              positionClass: 'toast-top-right',
              preventDuplicates: true,
            });
          else
            this.toastr.showError(err.error.message, '', {
              toastClass: 'error-toast',
              timeOut: 3000,
              extendedTimeOut: 1000,
              positionClass: 'toast-top-right',
              preventDuplicates: true,
            });
          this.updateLoadingStatus.next(false);
        },
        complete: () => {
          this.updateLoadingStatus.next(true);
        },
      });
  }

  getWishedProducts(userId: string, newProducts: string[]): void {
    this.categoriesDataStorageService
      .fetchWishedProducts(userId, newProducts)
      .subscribe({
        next: (res) => {
          this.wishedProducts = [
            ...this.wishedProducts,
            ...res.wishedProducts.map((wp) => wp.product),
          ];
          this.updateWishedProducts.next(this.wishedProducts.slice());
        },
        error: (err) => {
          if (!err.status)
            this.toastr.showError('Server failed!', '', {
              toastClass: 'error-toast',
              timeOut: 3000,
              extendedTimeOut: 1000,
              positionClass: 'toast-top-right',
              preventDuplicates: true,
            });
          else
            this.toastr.showError(err.error.message, '', {
              toastClass: 'error-toast',
              timeOut: 3000,
              extendedTimeOut: 1000,
              positionClass: 'toast-top-right',
              preventDuplicates: true,
            });
          this.updateLoadingStatus.next(false);
        },
        complete: () => {
          this.updateLoadingStatus.next(false);
        },
      });
  }

  removeProductFromWishList(userId: string, productId: string): void {
    this.updateLoadingStatus.next(true);
    this.categoriesDataStorageService
      .removeProductFromWishlist(userId, productId)
      .subscribe({
        next: (res) => {
          this.toastr.showSuccess('Product removed from the wishlist!', '', {
            toastClass: 'success-toast',
            timeOut: 3000,
            extendedTimeOut: 1000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
          });
          const index = this.wishedProducts.indexOf(productId);

          this.wishedProducts.splice(index, 1);

          this.updateWishedProducts.next(this.wishedProducts.slice());
        },
        error: (err) => {
          if (!err.status)
            this.toastr.showError('Server failed!', '', {
              toastClass: 'error-toast',
              timeOut: 3000,
              extendedTimeOut: 1000,
              positionClass: 'toast-top-right',
              preventDuplicates: true,
            });
          else
            this.toastr.showError(err.error.message, '', {
              toastClass: 'error-toast',
              timeOut: 3000,
              extendedTimeOut: 1000,
              positionClass: 'toast-top-right',
              preventDuplicates: true,
            });
          this.updateLoadingStatus.next(false);
        },
        complete: () => {
          this.updateLoadingStatus.next(false);
        },
      });
  }
}
