import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { OrderService } from '../account/orders/order.service';

import { Order } from '../account/orders/Order.model';
import { User } from '../account/User.model';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './tracking.component.html',
})
export class TrackingComponent implements OnInit {
  orderRes$: Observable<{ message: string; order: Order }> | undefined;
  order: Order | undefined;
  user: User | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();

    this.orderRes$ = this.activatedRoute.data.pipe(
      map((data) => {
        this.order = data['order'].order;

        console.log('order: ', this.order);
        return data['order'];
      })
    );

    this.orderService.updateOrder.subscribe((order) => {
      this.order = order;
    });
  }
}
