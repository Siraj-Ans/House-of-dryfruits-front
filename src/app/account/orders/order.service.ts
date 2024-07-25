import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

import { OrderDataStorageService } from './order-dataStorage.service';
import { ToastService } from '../../toast.service';

import { Order } from '../orders/Order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  orders: Order[] = [];
  updateOrder = new Subject<Order>();
  updateOrders = new Subject<Order[]>();
  updateLoadingStatus = new ReplaySubject<boolean>(0);

  constructor(
    private orderDataStorageService: OrderDataStorageService,
    private toastr: ToastService
  ) {}

  cancelOrder(orderId: string, userId: string, index: number): void {
    this.orderDataStorageService.cancelOrder(orderId, userId).subscribe({
      next: (res) => {
        this.getOrders(userId);
        this.orders.splice(index, 1);
        this.updateOrders.next(this.orders.slice());
        this.toastr.showSuccess('Order canceled!', '', {
          toastClass: 'success-toast',
          timeOut: 3000,
          extendedTimeOut: 1000,
          positionClass: 'toast-top-right',
          preventDuplicates: true,
        });
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

  getOrders(userId: string): void {
    this.updateLoadingStatus.next(true);
    this.orderDataStorageService.fetchOrders(userId).subscribe({
      next: (res) => {
        this.orders = res.orders;
        this.updateOrders.next(res.orders);
        this.updateLoadingStatus.next(false);
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

  getorder(orderId: string, userId: string): void {
    this.orderDataStorageService.fetchOrder(userId, orderId).subscribe({
      next: (res) => {
        this.updateOrder.next(res.order);
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
