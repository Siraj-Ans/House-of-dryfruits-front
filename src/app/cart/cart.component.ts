import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { CartService } from './cart.service';
import { HeaderService } from '../header/header.serice';

import { Product } from '../new-product/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cartItemProducts: Product[] = [];
  selectedQuantityQuantity: number | undefined;

  constructor(
    private cartService: CartService,
    private headerService: HeaderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('cart')) {
        const cartItemIds = JSON.parse(localStorage.getItem('cart')!);

        this.cartService.getCartItemProducts(cartItemIds);
      }
    }

    this.cartService.updateCartItems.subscribe((cartItemProducts) => {
      this.cartItemProducts = cartItemProducts;
    });
  }

  onClearCart(): void {
    this.cartService.updateCartItems.next([]);
    this.headerService.updateCartItemsCount.next(0);
    localStorage.removeItem('cart');
  }

  onCheckOut(): void {
    this.router.navigate(['check-out']);
  }

  onBack(): void {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }
}
