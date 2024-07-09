import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';

import { NewProductsService } from './new-product.service';
import { HeaderService } from '../header/header.serice';

import { Product } from './product.model';

@Component({
  selector: 'app-new-products',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css',
})
export class NewProduct implements OnInit, OnDestroy {
  newProducts: Product[] = [];
  cartItems: string[] = [];
  newProductsSubsctiption: undefined | Subscription;

  constructor(
    private newProductsService: NewProductsService,
    private toastrService: ToastrService,
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
    this.newProductsService.getNewProducts();

    this.newProductsSubsctiption =
      this.newProductsService.updateNewProducts.subscribe((newProducts) => {
        this.newProducts = newProducts;
      });
  }

  onAddToCart(id: string): void {
    if (this.cartItems.includes(id)) {
      this.toastrService.warning('Product already exists in the cart!', '', {
        toastClass: 'warning-toast',
      });
      return;
    }

    this.cartItems.push(id);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
      this.headerService.updateCartItemsCount.next(this.cartItems.length);
    }
  }

  ngOnDestroy(): void {
    this.newProductsSubsctiption?.unsubscribe();
  }
}
