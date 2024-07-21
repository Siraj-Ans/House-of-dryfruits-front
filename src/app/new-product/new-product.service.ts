import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

import { NewProductsDataStorageService } from './new-product-dataStorage.service';
import { ToastService } from '../toast.service';

import { Product } from './product.model';

@Injectable({ providedIn: 'root' })
export class NewProductsService {
  newProducts: Product[] = [];
  wishedProducts: string[] = [];
  updateNewProductsLoadingStatus = new ReplaySubject<boolean>(0);
  updateWishedProducts = new Subject<string[]>();
  updateNewProducts = new ReplaySubject<Product[]>(1, 1000);

  constructor(
    private newProductsDataStorageService: NewProductsDataStorageService,
    private toastr: ToastService
  ) {}

  getNewProducts(): void {
    this.newProductsDataStorageService.fetchNewProducts().subscribe({
      next: (res) => {
        this.newProducts = res.products;
        this.updateNewProducts.next(this.newProducts.slice());
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

  addProductToWishList(productId: string, userId: string): void {
    this.newProductsDataStorageService
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
        },
        complete: () => {},
      });
  }

  getWishedProducts(userId: string, newProducts: string[]): void {
    this.updateNewProductsLoadingStatus.next(true);
    this.newProductsDataStorageService
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
          this.updateNewProductsLoadingStatus.next(false);
        },
        complete: () => {
          this.updateNewProductsLoadingStatus.next(false);
        },
      });
  }

  removeProductFromWishList(userId: string, productId: string): void {
    this.newProductsDataStorageService
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
        },
        complete: () => {},
      });
  }
}
