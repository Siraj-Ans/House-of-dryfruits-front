import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { OrderDataStorageService } from '../account/orders/order-dataStorage.service';
import { AuthService } from '../auth/auth.service';

export const OrderResolver: ResolveFn<Object> = (route, state) => {
  const orderId = route.paramMap.get('id');
  const userId = inject(AuthService).getUser()?.id;

  return inject(OrderDataStorageService).fetchOrder(userId!, orderId!);
};
