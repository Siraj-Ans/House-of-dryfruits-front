import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

import { CategoryDataStorageService } from './category-dataStorage.service';
import { ToastService } from '../toast.service';
import { Product } from '../new-product/product.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  wishedProducts: string[] = [];
  updatedLoadingStatus = new Subject<boolean>();
  updateWishedProducts = new Subject<string[]>();
  updateCategoryProducts = new ReplaySubject<Product[]>(0);

  constructor(
    private categoryDataStorageService: CategoryDataStorageService,
    private toastr: ToastService
  ) {}

  getCategoryProducts(categoryId: string): void {
    this.categoryDataStorageService
      .fetchCategoryProducts(categoryId)
      .subscribe({
        next: (res) => {
          this.updateCategoryProducts.next(res.categoryProducts);
        },
        error: (err) => {
          console.log(err);
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
        },
        complete: () => {},
      });
  }

  addProductToWishList(productId: string, userId: string): void {
    this.updatedLoadingStatus.next(true);
    this.categoryDataStorageService
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
        },
        complete: () => {},
      });
  }

  removeProductFromWishList(userId: string, productId: string): void {
    this.updatedLoadingStatus.next(true);
    this.categoryDataStorageService
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
          this.updatedLoadingStatus.next(false);
        },
        complete: () => {
          this.updatedLoadingStatus.next(false);
        },
      });
  }

  getOldestCategoryProducts(categoryId: string): void {
    this.categoryDataStorageService
      .getOldestCategoryProducts(categoryId)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.updateCategoryProducts.next(res.categoryProducts);
        },
        error: (err) => {
          console.log(err);
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
        },
        complete: () => {},
      });
  }

  getCategoryProductsByLowestPrice(categoryId: string): void {
    this.categoryDataStorageService
      .getCategoryProductsByLowestPrice(categoryId)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.updateCategoryProducts.next(res.categoryProducts);
        },
        error: (err) => {
          console.log(err);
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
        },
        complete: () => {},
      });
  }

  getCategoryProductsByHighestPrice(categoryId: string): void {
    this.categoryDataStorageService
      .getCategoryProductsByHighestPrice(categoryId)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.updateCategoryProducts.next(res.categoryProducts);
        },
        error: (err) => {
          console.log(err);
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
        },
        complete: () => {},
      });
  }
}
