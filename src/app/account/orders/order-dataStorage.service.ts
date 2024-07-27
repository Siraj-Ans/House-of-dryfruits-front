import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  CancelOrderResponse,
  FetchOrderResponse,
  FetchOrdersResponse,
} from './OrdersRes.model';

import { environment } from '../../../environments/environment.development';

const BACKEND_URL = environment.apiUrl + '/orders/';

@Injectable({
  providedIn: 'root',
})
export class OrderDataStorageService {
  constructor(private http: HttpClient) {}

  cancelOrder(
    orderId: string,
    userId: string
  ): Observable<{
    message: string;
  }> {
    return this.http.post<CancelOrderResponse>(
      'https://house-of-dryfruits-backend.onrender.com/api/orders/cancelOrder',
      {
        orderId: orderId,
        userId: userId,
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
      paid: boolean;
      fullfilled: string;
      createdAt: string;
      updatedAt: string;
      trackingId: string;
      address2?: string;
    }[];
  }> {
    return this.http
      .get<FetchOrdersResponse>(BACKEND_URL + 'fetchOrders', {
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
                paid: order.paid,
                fullfilled: order.fullfilled,
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

  fetchOrder(
    userId: string,
    orderId: string
  ): Observable<{
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
      paid: boolean;
      fullfilled: string;
      createdAt: string;
      updatedAt: string;
      trackingId: string;
      address2?: string;
    };
  }> {
    return this.http
      .get<FetchOrderResponse>(BACKEND_URL + 'fetchOrder', {
        params: new HttpParams()
          .append('userId', userId)
          .append('orderId', orderId),
      })
      .pipe(
        map((res) => {
          return {
            message: res.message,
            order: {
              id: res.order._id,
              user: res.order.user,
              emailAddress: res.order.emailAddress,
              country: res.order.country,
              phoneNumber: res.order.phoneNumber,
              firstName: res.order.firstName,
              lastName: res.order.lastName,
              city: res.order.city,
              postalCode: res.order.postalCode,
              address1: res.order.address1,
              paymentMethod: res.order.paymentMethod,
              productInfo: res.order.productInfo,
              paid: res.order.paid,
              fullfilled: res.order.fullfilled,
              createdAt: new Date(res.order.createdAt).toLocaleDateString(
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
              updatedAt: res.order.updatedAt,
              trackingId: res.order.trackingId,
              address2: res.order.address2,
            },
          };
        })
      );
  }
}
