import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { CancelOrder, FetchOrders } from './OrdersRes.model';

@Injectable({
  providedIn: 'root',
})
export class OrderDataStorageService {
  constructor(private http: HttpClient) {}

  cancelOrder(
    orderId: string,
    userId: string,
    trackingId: string
  ): Observable<{
    message: string;
  }> {
    return this.http.post<CancelOrder>(
      'http://localhost:3000/api/orders/cancelOrder',
      {
        orderId: orderId,
        userId: userId,
        trackingId: trackingId,
      }
    );
  }

  fetchOrders(userId: string): Observable<{
    message: string;
    orders: {
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
      trackingId: string;
      address2?: string;
    }[];
  }> {
    console.log(userId);
    return this.http
      .get<FetchOrders>('http://localhost:3000/api/orders/fetchOrders', {
        params: new HttpParams().append('userId', userId),
      })
      .pipe(
        map((res) => {
          return {
            message: res.message,
            orders: res.orders.map((order) => {
              return {
                id: order._id,
                user: order.user,
                emailAddress: order.emailAddress,
                country: order.country,
                phoneNumber: order.phoneNumber,
                firstName: order.firstName,
                lastName: order.lastName,
                city: order.city,
                postalCode: order.postalCode,
                address1: order.address1,
                paymentMethod: order.paymentMethod,
                productInfo: order.productInfo,
                createdAt: new Date(order.createdAt).toLocaleDateString(
                  'en-us',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  }
                ),
                updatedAt: order.updatedAt,
                trackingId: order.trackingId,
                address2: order.address2,
              };
            }),
          };
        })
      );
  }
}
