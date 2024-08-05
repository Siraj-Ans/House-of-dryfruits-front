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
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

import { LoadSpinner } from '../shared/load-spinner/load-spinner.component';
import { BarSpinner } from '../shared/bar-spinner/bar-spinner.component';

import { NewProductsService } from './new-product.service';
import { HeaderService } from '../header/header.serice';
import { ToastService } from '../toast.service';
import { AuthService } from '../auth/auth.service';

import { Product } from './product.model';
import { User } from '../account/User.model';
import { CartItem } from '../shared/CartItem.model';

@Component({
  selector: 'app-new-products',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, LoadSpinner, BarSpinner],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css',
  animations: [
    trigger('showHideIcons', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('hidden => visible', animate('0.5s')),
      transition('visible => hidden', animate('0.5s')),
    ]),
  ],
})
export class NewProduct implements OnInit, OnDestroy {
  state = 'hidden';
  averageRating = 10;
  loading = false;
  iconsShowing = new Set<string>();
  newProducts: Product[] = [];
  cartItems: CartItem[] = [];
  user: User | undefined;
  wishedProducts: string[] = [];
  newProductsSubsctiption: Subscription | undefined;
  updatenewProductsLoadingStatusSubscription: Subscription | undefined;
  updateWishedProductSubscription: Subscription | undefined;

  constructor(
    private newProductsService: NewProductsService,
    private headerService: HeaderService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();

    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('cart')) {
        this.cartItems = JSON.parse(localStorage.getItem('cart')!);
      }
    }

    this.newProductsService.getNewProducts();

    this.updatenewProductsLoadingStatusSubscription =
      this.newProductsService.updateNewProductsLoadingStatus.subscribe(
        (status) => {
          this.loading = status;
        }
      );

    this.newProductsSubsctiption =
      this.newProductsService.updateNewProducts.subscribe((newProducts) => {
        this.newProducts = newProducts;

        if (this.authService.getIsAuthenticated())
          this.newProductsService.getWishedProducts(
            this.user!.id,
            this.newProducts.map((np) => np.id)
          );
      });

    this.updateWishedProductSubscription =
      this.newProductsService.updateWishedProducts.subscribe(
        (wishedProducts) => {
          this.wishedProducts = wishedProducts;
        }
      );
  }

  onAddToWhishlist(productId: string): void {
    if (!this.authService.getIsAuthenticated())
      return this.toastr.showError(
        'Login first to add products to wishlist.',
        '',
        {
          toastClass: 'error-toast',
          timeOut: 3000,
          extendedTimeOut: 1000,
          positionClass: 'toast-top-right',
          preventDuplicates: true,
        }
      );
    this.newProductsService.addProductToWishList(productId, this.user!.id);
  }

  onRemoveFromWhishlist(productId: string): void {
    this.newProductsService.removeProductFromWishList(this.user!.id, productId);
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

  onViewProduct(id: string): void {
    this.router.navigate(['products/' + id]);
  }

  ngOnDestroy(): void {
    this.newProductsSubsctiption?.unsubscribe();
    this.updateWishedProductSubscription?.unsubscribe();
    this.updatenewProductsLoadingStatusSubscription?.unsubscribe();
  }
}
