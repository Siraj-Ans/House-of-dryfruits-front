import { Injectable } from '@angular/core';

import { NewProductsDataStorageService } from './new-products-dataStorage.service';
import { ReplaySubject, Subject } from 'rxjs';
import { Product } from './product.model';

@Injectable({ providedIn: 'root' })
export class NewProductsService {
  newProducts: Product[] = [];
  updateNewProducts = new ReplaySubject<Product[]>(1, 1000);

  constructor(
    private newProductsDataStorageService: NewProductsDataStorageService
  ) {}

  getNewProducts(): void {
    this.newProductsDataStorageService.getNewProducts().subscribe({
      next: (res) => {
        this.newProducts = res.products;
        this.updateNewProducts.next(this.newProducts.slice());
      },
      error: () => {},
      complete: () => {
        console.log('Completed!');
      },
    });
  }
}
