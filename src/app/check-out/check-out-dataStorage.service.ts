import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  CreateOrderResponse,
  FetchAccountDetails,
  FetchCheckedOutProducts,
} from './CheckOutRes.model';
import { Order } from '../shared/Order.model';

@Injectable({
  providedIn: 'root',
})
export class CheckOutDataStorageService {
  constructor(private http: HttpClient) {}

  fetchAccountDetails(userId: string): Observable<{
    message: string;
    accountDetails: {
      id: string;
      userId: string;
      emailAddress: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      city: string;
      postalCode: number;
      address1: string;
      address2: string;
    };
  }> {
    return this.http
      .get<FetchAccountDetails>(
        'http://localhost:3000/api/account/fetchAccountDetails',
        {
          params: new HttpParams().set('userId', userId),
        }
      )
      .pipe(
        map((res) => {
          return {
            message: res.message,
            accountDetails: {
              id: res.accountDetails._id,
              userId: res.accountDetails.user,
              emailAddress: res.accountDetails.emailAddress,
              firstName: res.accountDetails.firstName,
              lastName: res.accountDetails.lastName,
              phoneNumber: res.accountDetails.phoneNumber,
              city: res.accountDetails.city,
              postalCode: res.accountDetails.postalCode,
              address1: res.accountDetails.address1,
              address2: res.accountDetails.address2,
            },
          };
        })
      );
  }

  fetchCheckedOutProducts(productIds: string[]): Observable<{
    message: string;
    products: {
      id: string;
      productName: string;
      productCategory: {
        id: string;
        categoryName: string;
        properties: { property: string; values: string[] }[];
      };
      productImages: string[];
      description: string;
      priceInPKR: number;
    }[];
  }> {
    return this.http
      .get<FetchCheckedOutProducts>(
        'http://localhost:3000/api/products/fetchCartProducts',
        {
          params: new HttpParams().set(
            'productIds',
            JSON.stringify(productIds)
          ),
        }
      )
      .pipe(
        map((res) => {
          return {
            message: res.message,
            products: res.products.map((product) => {
              return {
                id: product._id,
                productName: product.productName,
                productCategory: {
                  id: product.productCategory._id,
                  categoryName: product.productCategory.categoryName,
                  properties: product.productCategory.properties,
                },
                productImages: product.productImages,
                description: product.description,
                priceInPKR: product.priceInPKR,
              };
            }),
          };
        })
      );
  }

  createOrder(order: Order): Observable<{
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
    return this.http
      .post<CreateOrderResponse>(
        'http://localhost:3000/api/orders/createOrder',
        order
      )
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
              createdAt: res.order.createdAt,
              updatedAt: res.order.updatedAt,
              address2: res.order.address2,
            },
          };
        })
      );
  }
}