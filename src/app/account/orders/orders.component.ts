import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { BarSpinner } from '../../shared/bar-spinner/bar-spinner.component';

import { OrderService } from './order.service';
import { AuthService } from '../../auth/auth.service';

import { Order } from './Order.model';
import { User } from '../User.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, BarSpinner],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  user: User | undefined;
  loading = false;
  updateOrdersSubscription: Subscription | undefined;
  updateLoadingSubscription: Subscription | undefined;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.orderService.getOrders(this.user!.id);

    this.updateOrdersSubscription = this.orderService.updateOrders.subscribe(
      (orders) => {
        this.orders = orders;
      }
    );

    this.updateLoadingSubscription =
      this.orderService.updateLoadingStatus.subscribe((status) => {
        this.loading = status;
      });
  }

  onCancelOrder(orderId: string, trackingId: string, index: number): void {
    this.orderService.cancelOrder(orderId, this.user!.id, trackingId, index);
  }

  ngOnDestroy(): void {
    this.updateOrdersSubscription?.unsubscribe();
    this.updateLoadingSubscription?.unsubscribe();
  }
}
