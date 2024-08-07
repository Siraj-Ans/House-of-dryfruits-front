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
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { FormsModule } from '@angular/forms';

import { BarSpinner } from '../shared/bar-spinner/bar-spinner.component';

import { ProductsService } from './products.service';
import { HeaderService } from '../header/header.serice';
import { ToastService } from '../toast.service';
import { AuthService } from '../auth/auth.service';

import { Product } from '../new-product/product.model';
import { User } from '../account/User.model';
import { CartItem } from '../shared/CartItem.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatPaginatorModule,
    RouterModule,
    BarSpinner,
    FormsModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
  animations: [
    trigger('showHideIcons', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('hidden => visible', animate('0.5s')),
      transition('visible => hidden', animate('0.5s')),
    ]),
  ],
})
export class ProductsComponent implements OnInit, OnDestroy {
  state = 'hidden';
  loading = false;
  products: Product[] = [];
  totalProducts = 0;
  pageSize = 20;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10, 20, 30, 40, 50];
  iconsShowing = new Set<string>();
  cartItems: CartItem[] = [];
  wishedProducts: string[] = [];
  user: User | undefined;
  updateProductsSubscription: Subscription | undefined;
  updateProductsLoadingStatusSubscription: Subscription | undefined;
  updateWishedProductSubscription: Subscription | undefined;
  updateProductsCountSubscription: Subscription | undefined;

  constructor(
    private productsService: ProductsService,
    private toastr: ToastService,
    private router: Router,
    private headerService: HeaderService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();

    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('cart')) {
        this.cartItems = JSON.parse(localStorage.getItem('cart')!);
      }
    }

    this.productsService.getProducts(this.pageSize, this.currentPage);

    this.updateProductsCountSubscription =
      this.productsService.updateProductsCount.subscribe((count) => {
        this.totalProducts = count;
      });

    this.updateProductsSubscription =
      this.productsService.updateProducts.subscribe((products) => {
        this.products = products;

        if (this.authService.getIsAuthenticated())
          this.productsService.getWishedProducts(
            this.user!.id,
            this.products.map((np) => np.id)
          );
      });

    this.updateProductsLoadingStatusSubscription =
      this.productsService.updateProductsLoadingStatus.subscribe((status) => {
        this.loading = status;
      });

    this.updateWishedProductSubscription =
      this.productsService.updateWishedProducts.subscribe((wishedProducts) => {
        this.wishedProducts = wishedProducts;
      });
  }

  onChangedPage(pageData: PageEvent): void {
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    this.productsService.getProducts(this.pageSize, this.currentPage);
  }

  onRemoveFromWhishlist(productId: string): void {
    this.productsService.removeProductFromWishList(this.user!.id, productId);
  }

  onMouseLeave(productId: string): void {
    this.state = 'hidden';
    this.iconsShowing.delete(productId);
  }

  onMouseEnter(productId: string): void {
    this.state = 'visible';
    this.iconsShowing.add(productId);
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
    this.productsService.addProductToWishList(productId, this.user!.id);
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

  onViewProduct(productId: string): void {
    this.router.navigate(['products/' + productId]);
  }

  ngOnDestroy(): void {
    this.updateProductsSubscription?.unsubscribe();
    this.updateWishedProductSubscription?.unsubscribe();
    this.updateProductsLoadingStatusSubscription?.unsubscribe();
    this.updateProductsCountSubscription?.unsubscribe();
  }
}
