import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { FeaturedProductService } from './featured-product.service';
import { ToastService } from '../toast.service';
import { HeaderService } from '../header/header.serice';

import { Product } from '../new-product/product.model';
import { CartItem } from '../shared/CartItem.model';

@Component({
  selector: 'app-featured-product',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './featured-product.component.html',
})
export class FeaturedComponent implements OnInit {
  featuredProduct: Product | null | undefined;
  cartItems: CartItem[] = [];

  constructor(
    private featuredProductService: FeaturedProductService,
    private toastr: ToastService,
    private router: Router,
    private headerService: HeaderService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.featuredProductService.getFeaturedProduct();

    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('cart')) {
        this.cartItems = JSON.parse(localStorage.getItem('cart')!);
      }
    }

    this.featuredProductService.updateFeaturedProduct.subscribe(
      (featuredProduct) => {
        this.featuredProduct = featuredProduct;
      }
    );
  }

  onAddToCart(product: Product): void {
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('cart')) {
        this.cartItems = JSON.parse(localStorage.getItem('cart')!);
      } else {
        this.cartItems = [];
      }
    }

    const check = this.cartItems.filter(
      (cartItem) => cartItem.product == product.id
    );

    if (check.length > 0) {
      this.toastr.showWarning('Product already exists in the cart!', '', {
        toastClass: 'warning-toast',
        timeOut: 3000,
        extendedTimeOut: 1000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
      });
      return;
    }

    const cartItem = new CartItem(product.id, 1, product.priceInPKR);

    this.cartItems.push(cartItem);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
      this.headerService.updateCartItemsCount.next(this.cartItems.length);
      this.toastr.showSuccess('Product added to the cart!', '', {
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
}
