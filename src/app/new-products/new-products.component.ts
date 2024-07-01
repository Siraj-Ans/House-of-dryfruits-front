import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { NewProductsService } from './new-products.service';
import { Product } from './product.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-products.component.html',
})
export class NewProducts implements OnInit, OnDestroy {
  newProducts: Product[] = [];
  cartItems: string[] = [];
  newProductsSubsctiption: undefined | Subscription;

  constructor(
    private newProductsService: NewProductsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem('cart');

      console.log(JSON.parse(data!));
    }
    this.newProductsService.getNewProducts();

    this.newProductsSubsctiption =
      this.newProductsService.updateNewProducts.subscribe((newProducts) => {
        this.newProducts = newProducts;
        console.log('newProducts: ', this.newProducts);
      });
  }

  onAddToCart(id: string): void {
    this.cartItems.push(id);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    }
  }

  ngOnDestroy(): void {
    this.newProductsSubsctiption?.unsubscribe();
  }
}
