import { Injectable } from '@angular/core';
import { ProductDataStorageService } from './product-dataStorage.service';
import { Product } from '../new-product/product.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  product: Product | undefined;
  updateProduct = new Subject<Product>();

  constructor(private productDataStorageService: ProductDataStorageService) {}

  getProduct(id: string): void {
    this.productDataStorageService.fetchProduct(id).subscribe({
      next: (responseData) => {
        this.product = responseData.product;

        this.updateProduct.next(this.product);
      },
      error: (err) => {
        console.log('[product] err: ', err);
      },
      complete: () => {
        console.log('Product req completed successfully!');
      },
    });
  }
}
