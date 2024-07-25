import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

import { BarSpinner } from '../../shared/bar-spinner/bar-spinner.component';

import { OrderService } from './order.service';
import { AuthService } from '../../auth/auth.service';

import { Order } from './Order.model';
import { User } from '../User.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, BarSpinner],
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
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.orderService.getOrders(this.user!.id);

    this.updateOrdersSubscription = this.orderService.updateOrders.subscribe(
      (orders) => {
        this.orders = orders;
        console.log(this.orders);
      }
    );

    this.updateLoadingSubscription =
      this.orderService.updateLoadingStatus.subscribe((status) => {
        this.loading = status;
      });
  }

  onTrackOrder(orderId: string): void {
    this.router.navigate(['/orders/', orderId]);
  }

  onCancelOrder(orderId: string, index: number): void {
    this.orderService.cancelOrder(orderId, this.user!.id, index);
  }

  ngOnDestroy(): void {
    this.updateOrdersSubscription?.unsubscribe();
    this.updateLoadingSubscription?.unsubscribe();
  }
}
