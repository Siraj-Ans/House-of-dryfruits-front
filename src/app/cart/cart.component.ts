import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

import { BarSpinner } from '../shared/bar-spinner/bar-spinner.component';

import { CartService } from './cart.service';
import { HeaderService } from '../header/header.serice';
import { ToastService } from '../toast.service';

import { Product } from '../new-product/product.model';
import { CartItem } from '../shared/CartItem.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, BarSpinner, MatIconModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit, OnDestroy {
  cartItemProducts: Product[] = [];
  cartItems: CartItem[] = [];
  loading = false;
  subTotal = 0;
  shippingFee = 0;
  totalProducts = 0;
  total = 0;
  updateCartItemsLoadingStatusSubscription: Subscription | undefined;
  updateCartItemsSubscription: Subscription | undefined;
  updateShippingFeeSubscription: Subscription | undefined;

  constructor(
    private cartService: CartService,
    private headerService: HeaderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.cartService.getShippingFee();

    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('cart')) {
        this.cartItems = JSON.parse(localStorage.getItem('cart')!);

        const cartItemIds = this.cartItems.map((cartItem) => cartItem.product);

        this.cartService.getCartItemProducts(cartItemIds);

        this.cartItems.forEach((cartItem) => {
          this.totalProducts += cartItem.quanity;
          this.subTotal += cartItem.total;
        });

        const shipFee = this.shippingFee * this.totalProducts;

        this.subTotal = this.subTotal + shipFee;
      }
    }

    this.updateCartItemsLoadingStatusSubscription =
      this.cartService.updateCartItemsLoadingStatus.subscribe((status) => {
        this.loading = status;
      });

    this.updateShippingFeeSubscription =
      this.cartService.updateShippingFee.subscribe((shippingFee) => {
        this.shippingFee = shippingFee;
      });

    this.updateCartItemsSubscription =
      this.cartService.updateCartItems.subscribe((cartItemProducts) => {
        this.cartItemProducts = cartItemProducts;
      });
  }

  onDeletCartItem(cartItemProduct: Product, index: number): void {
    if (isPlatformBrowser(this.platformId)) {
      this.totalProducts -= this.cartItems[index].quanity;
      this.subTotal -= this.cartItems[index].total;
      this.cartItems.splice(index, 1);

      localStorage.removeItem('cart');
      localStorage.setItem('cart', JSON.stringify(this.cartItems));

      const cartItemIds = this.cartItems.map((cartItem) => cartItem.product);

      this.headerService.updateCartItemsCount.next(this.cartItems.length);
      this.cartService.getCartItemProducts(cartItemIds);
    }
  }

  onIncreaseQuantity(index: number) {
    this.cartItems[index].quanity++;

    this.cartItems[index].total += this.cartItemProducts[index].priceInPKR;
    this.subTotal += this.cartItemProducts[index].priceInPKR;
    this.totalProducts++;
  }

  onDecreaseQuantity(index: number) {
    if (this.cartItems[index].quanity > 1) {
      this.totalProducts--;
      this.cartItems[index].quanity--;
      this.cartItems[index].total -= this.cartItemProducts[index].priceInPKR;
      this.subTotal -= this.cartItemProducts[index].priceInPKR;
    }
  }

  onClearCart(): void {
    this.cartService.updateCartItems.next([]);
    this.headerService.updateCartItemsCount.next(0);
    localStorage.removeItem('cart');

    this.subTotal = 0;

    if (this.cartItems.length === 0)
      return this.toastr.showWarning('Cart is already cleared!', '', {
        toastClass: 'warning-toast',
        timeOut: 3000,
        extendedTimeOut: 1000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
      });

    this.toastr.showSuccess('Cart cleared!', '', {
      toastClass: 'success-toast',
      timeOut: 3000,
      extendedTimeOut: 1000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    });
  }

  onCheckOut(): void {
    this.cartService.checkedOutProducts(this.cartItems);
    this.router.navigate(['check-out']);
  }

  onUpdateCart(): void {
    console.log(this.cartItems);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('cart');
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    }

    this.toastr.showSuccess('Cart updated!', '', {
      toastClass: 'success-toast',
      timeOut: 3000,
      extendedTimeOut: 1000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    });
  }

  onBack(): void {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  ngOnDestroy(): void {
    this.updateCartItemsSubscription?.unsubscribe();
    this.updateShippingFeeSubscription?.unsubscribe();
    this.updateCartItemsLoadingStatusSubscription?.unsubscribe();
  }
}
