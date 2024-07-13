import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { ProductsDataStorageService } from './products-dataStorage.service';

import { Product } from '../new-product/product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  products: Product[] = [];
  updateProducts = new Subject<Product[]>();

  constructor(private productDataStorageService: ProductsDataStorageService) {}

  getProducts(): void {
    this.productDataStorageService.fetchProducts().subscribe({
      next: (responseData) => {
        this.products = responseData.products;

        this.updateProducts.next(this.products.slice());
      },
      error: (err) => {
        console.log('[product] err: ', err);
      },
      complete: () => {},
    });
  }

  addProductToWishList(productid: string, userId: string): void {
    this.productDataStorageService.saveProductToWishList(productid, userId);
  }

  removeProductFromWishList(productId: string, userId: string): void {
    this.productDataStorageService.removeProductFromWishList(productId, userId);
  }
}
