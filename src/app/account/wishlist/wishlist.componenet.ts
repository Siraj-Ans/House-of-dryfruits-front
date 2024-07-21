import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

import { BarSpinner } from '../../shared/bar-spinner/bar-spinner.component';

import { WishListService } from './wishlist.service';
import { ToastService } from '../../toast.service';
import { HeaderService } from '../../header/header.serice';
import { AuthService } from '../../auth/auth.service';

import { User } from '../User.model';
import { WishedProduct } from '../../shared/WishedProduct.model';
import { Product } from '../../new-product/product.model';
import { CartItem } from '../../shared/CartItem.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, MatIconModule, BarSpinner],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
  animations: [
    trigger('showHideIcons', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('hidden => visible', animate('0.5s')),
      transition('visible => hidden', animate('0.5s')),
    ]),
  ],
})
export class WishListComponent implements OnInit, OnDestroy {
  state = 'hidden';
  iconsShowing = new Set<string>();
  user: User | undefined;
  cartItems: CartItem[] = [];
  loading = false;
  wishedProducts: WishedProduct[] = [];
  updateLoadingStatusSubscription: Subscription | undefined;
  updateWishedProductsSubscription: Subscription | undefined;

  constructor(
    private wishListService: WishListService,
    private toastr: ToastService,
    private headerService: HeaderService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.wishListService.getWishedProducts(this.user!.id);

    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('cart')) {
        this.cartItems = JSON.parse(localStorage.getItem('cart')!);
      }
    }

    this.updateLoadingStatusSubscription =
      this.wishListService.updateLoadingStatus.subscribe((status) => {
        this.loading = status;
      });

    this.updateWishedProductsSubscription =
      this.wishListService.updateWishedProducts.subscribe((wishedProducts) => {
        this.wishedProducts = wishedProducts;
      });
  }

  onViewProduct(id: string): void {
    this.router.navigate(['products/' + id]);
  }

  onRemoveFromWhishlist(wishedProductId: string, index: number): void {
    this.wishListService.removeProductFromWishList(
      this.user!.id,
      wishedProductId,
      index
    );
  }

  onMouseLeave(productId: string): void {
    this.state = 'hidden';
    this.iconsShowing.delete(productId);
  }

  onMouseEnter(productId: string): void {
    this.state = 'visible';
    this.iconsShowing.add(productId);
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

  ngOnDestroy(): void {
    this.updateLoadingStatusSubscription?.unsubscribe();
    this.updateWishedProductsSubscription?.unsubscribe();
  }
}
