import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { ProductsDataStorageService } from './products-dataStorage.service';
import { ToastService } from '../toast.service';

import { Product } from '../new-product/product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  products: Product[] = [];
  wishedProducts: string[] = [];
  updateProducts = new Subject<Product[]>();
  updateProductsLoadingStatus = new Subject<boolean>();
  updateWishedProducts = new Subject<string[]>();

  constructor(
    private productDataStorageService: ProductsDataStorageService,
    private toastr: ToastService
  ) {}

  getProducts(): void {
    this.productDataStorageService.fetchProducts().subscribe({
      next: (responseData) => {
        this.products = responseData.products;

        this.updateProducts.next(this.products.slice());
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
    this.productDataStorageService
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
    this.updateProductsLoadingStatus.next(true);
    this.productDataStorageService
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
          this.updateProductsLoadingStatus.next(false);
        },
        complete: () => {
          this.updateProductsLoadingStatus.next(false);
        },
      });
  }

  removeProductFromWishList(userId: string, productId: string): void {
    this.productDataStorageService
      .removeProductFromWishlist(userId, productId)
      .subscribe({
        next: (res) => {
          this.toastr.showSuccess('Account removed from the wishlist!', '', {
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
