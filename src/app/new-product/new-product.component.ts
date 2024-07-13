import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

import { NewProductsService } from './new-product.service';
import { HeaderService } from '../header/header.serice';
import { ToastService } from '../toast.service';

import { Product } from './product.model';

@Component({
  selector: 'app-new-products',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './new-product.component.html',
})
export class NewProduct implements OnInit, OnDestroy {
  newProducts: Product[] = [];
  cartItems: string[] = [];
  newProductsSubsctiption: undefined | Subscription;

  constructor(
    private newProductsService: NewProductsService,
    private toastService: ToastService,
    private headerService: HeaderService,
    private router: Router,
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
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('cart')) {
        const cartItems = JSON.parse(localStorage.getItem('cart')!);

        this.cartItems = cartItems;
      } else {
        this.cartItems = [];
      }
    }

    if (this.cartItems.includes(id)) {
      this.toastService.showWarning('Product already exists in the cart!', '', {
        toastClass: 'warning-toast',
        timeOut: 3000,
        extendedTimeOut: 1000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
      });
      return;
    }

    this.cartItems.push(id);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
      this.headerService.updateCartItemsCount.next(this.cartItems.length);
      this.toastService.showSuccess('Product added to the cart!', '', {
        toastClass: 'success-toast',
        timeOut: 3000,
        extendedTimeOut: 1000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
      });
    }
  }

  onViewProduct(id: string): void {
    this.router.navigate(['products/' + id]);
  }

  ngOnDestroy(): void {
    this.newProductsSubsctiption?.unsubscribe();
  }
}
