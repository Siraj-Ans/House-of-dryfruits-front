import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { CartDataStorageService } from './cart-dataStorage.service';

import { Product } from '../new-product/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  cartItemProducts: Product[] = [];
  updateCartItems = new Subject<Product[]>();

  constructor(private cartDataStorageService: CartDataStorageService) {}

  getCartItemProducts(cartItemIds: string[]): void {
    this.cartDataStorageService.fetchCartItemProducts(cartItemIds).subscribe({
      next: (res) => {
        this.cartItemProducts = res.products;
        this.updateCartItems.next(this.cartItemProducts.slice());
      },
      error: () => {},
      complete: () => {},
    });
  }
}
