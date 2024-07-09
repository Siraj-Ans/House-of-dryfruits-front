import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ProductsService } from './products.service';
import { HeaderService } from '../header/header.serice';

import { Product } from '../new-product/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  cartItems: string[] = [];
  productSubscription: Subscription | undefined;

  constructor(
    private productsService: ProductsService,
    private toastrService: ToastrService,
    private router: Router,
    private headerService: HeaderService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('cart')) {
        const cartItems = JSON.parse(localStorage.getItem('cart')!);

        this.cartItems = cartItems;
      }
    }

    this.productsService.getProducts();

    this.productSubscription = this.productsService.updateProducts.subscribe(
      (products) => {
        this.products = products;
      }
    );
  }

  onAddToCart(productId: string): void {
    if (this.cartItems.includes(productId)) {
      this.toastrService.warning('Product already exists in the cart!', '', {
        toastClass: 'warning-toast',
      });
      return;
    }

    this.cartItems.push(productId);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
      this.headerService.updateCartItemsCount.next(this.cartItems.length);
    }
  }

  onViewProduct(id: string): void {
    this.router.navigate(['/product/' + id]);
  }

  ngOnDestroy(): void {
    this.productSubscription?.unsubscribe();
  }
}
