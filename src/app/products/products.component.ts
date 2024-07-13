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

import { ProductsService } from './products.service';
import { HeaderService } from '../header/header.serice';
import { ToastService } from '../toast.service';
import { AuthService } from '../account/auth/auth.service';

import { Product } from '../new-product/product.model';
import { User } from '../account/User.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  cartItems: string[] = [];
  user: User | undefined;
  updateUserSubscription: Subscription | undefined;
  productSubscription: Subscription | undefined;

  constructor(
    private productsService: ProductsService,
    private toastService: ToastService,
    private router: Router,
    private headerService: HeaderService,
    private authService: AuthService,
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

    this.updateUserSubscription = this.authService.updateUser.subscribe(
      (user) => {
        this.user = user;
        console.log(this.user);
      }
    );

    this.productSubscription = this.productsService.updateProducts.subscribe(
      (products) => {
        this.products = products;
      }
    );
  }

  onAddToWhishlist(productId: string): void {
    this.productsService.addProductToWishList(productId, this.user!.id);
  }

  onRemoveFromWhishlist(productId: string): void {
    this.productsService.removeProductFromWishList(productId, this.user!.id);
  }

  onAddToCart(productId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('cart')) {
        const cartItems = JSON.parse(localStorage.getItem('cart')!);

        this.cartItems = cartItems;
      } else {
        this.cartItems = [];
      }
    }

    if (this.cartItems.includes(productId)) {
      this.toastService.showWarning('Product already exists in the cart!', '', {
        toastClass: 'warning-toast',
        timeOut: 3000,
        extendedTimeOut: 1000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
      });
      return;
    }

    this.cartItems.push(productId);

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

  onViewProduct(productId: string): void {
    this.router.navigate(['products/' + productId]);
  }

  ngOnDestroy(): void {
    this.productSubscription?.unsubscribe();
  }
}
