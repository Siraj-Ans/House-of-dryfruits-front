import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

import { CartDataStorageService } from './cart-dataStorage.service';
import { ToastService } from '../toast.service';

import { Product } from '../new-product/product.model';
import { CartItem } from '../shared/CartItem.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  cartItemProducts: Product[] = [];
  updateCheckedOutProducts = new ReplaySubject<CartItem[]>(0);
  updateCartItemsLoadingStatus = new ReplaySubject<boolean>(0);
  updateShippingFee = new Subject<number>();
  updateCartItems = new Subject<Product[]>();

  constructor(
    private cartDataStorageService: CartDataStorageService,
    private toastr: ToastService
  ) {}

  getCartItemProducts(cartItemIds: string[]): void {
    this.updateCartItemsLoadingStatus.next(true);
    this.cartDataStorageService.fetchCartItemProducts(cartItemIds).subscribe({
      next: (res) => {
        this.cartItemProducts = res.products;
        this.updateCartItems.next(this.cartItemProducts.slice());
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
        this.updateCartItemsLoadingStatus.next(false);
      },
      complete: () => {
        this.updateCartItemsLoadingStatus.next(false);
      },
    });
  }

  getShippingFee(): void {
    this.cartDataStorageService.fetchShippingFee().subscribe({
      next: (res) => {
        this.updateShippingFee.next(+res.shippingFee);
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

  checkedOutProducts(cartItems: CartItem[]): void {
    this.updateCheckedOutProducts.next(cartItems);
  }
}
