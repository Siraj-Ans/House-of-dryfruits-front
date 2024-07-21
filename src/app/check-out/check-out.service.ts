import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { CheckOutDataStorageService } from './check-out-dataStorage.service';
import { ToastService } from '../toast.service';

import { AccountDetails } from '../account/AccountDetails.model';
import { Product } from '../new-product/product.model';
import { Order } from '../shared/Order.model';

@Injectable({
  providedIn: 'root',
})
export class CheckOutService {
  updateProducts = new Subject<Product[]>();
  updateLoadingStatus = new Subject<boolean>();
  updateAccountDetails = new Subject<AccountDetails>();

  constructor(
    private checkoutDataStorageService: CheckOutDataStorageService,
    private toastr: ToastService
  ) {}

  getAccountDetails(userId: string): void {
    this.checkoutDataStorageService.fetchAccountDetails(userId).subscribe({
      next: (res) => {
        this.updateAccountDetails.next(res.accountDetails);
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

  getCheckedOutProducts(productIds: string[]): void {
    this.checkoutDataStorageService
      .fetchCheckedOutProducts(productIds)
      .subscribe({
        next: (res) => {
          this.updateProducts.next(res.products);
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

  createdOrder(order: Order): Observable<{
    message: string;
    order: {
      id: string;
      user: string;
      emailAddress: string;
      country: string;
      phoneNumber: string;
      firstName: string;
      lastName: string;
      city: string;
      postalCode: number;
      address1: string;
      paymentMethod: string;
      productInfo: {
        productName: string;
        quantity: number;
        productsTotal: number;
      }[];
      createdAt: string;
      updatedAt: string;
      address2?: string;
    };
  }> {
    return this.checkoutDataStorageService.createOrder(order);
  }
}
