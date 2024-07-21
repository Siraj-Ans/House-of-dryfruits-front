import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

import { WishListDataStorageService } from './wishlist-dataStorage.service';
import { ToastService } from '../../toast.service';

import { WishedProduct } from '../../shared/WishedProduct.model';

@Injectable({
  providedIn: 'root',
})
export class WishListService {
  wishedProducts: WishedProduct[] = [];
  updateLoadingStatus = new ReplaySubject<boolean>(0);
  updateWishedProducts = new Subject<WishedProduct[]>();

  constructor(
    private wishListDataStorageService: WishListDataStorageService,
    private toastr: ToastService
  ) {}

  getWishedProducts(userId: string): void {
    this.updateLoadingStatus.next(true);
    this.wishListDataStorageService.fetchWishedProducts(userId).subscribe({
      next: (res) => {
        this.wishedProducts = res.wishedProducts;
        this.updateWishedProducts.next(res.wishedProducts);
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

  removeProductFromWishList(
    userId: string,
    productId: string,
    index: number
  ): void {
    this.updateLoadingStatus.next(true);
    this.wishListDataStorageService
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
