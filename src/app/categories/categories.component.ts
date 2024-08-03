import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Subscription } from 'rxjs';

import { BarSpinner } from '../shared/bar-spinner/bar-spinner.component';

import { CategoriesService } from './categories.service';
import { ToastService } from '../toast.service';
import { HeaderService } from '../header/header.serice';
import { AuthService } from '../auth/auth.service';

import { Category } from './category.model';
import { CategoryProduct } from './CategoryProduct.model';
import { User } from '../account/User.model';
import { CartItem } from '../shared/CartItem.model';
import { Product } from '../new-product/product.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, BarSpinner],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
  animations: [
    trigger('showHideIcons', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('hidden => visible', animate('0.5s')),
      transition('visible => hidden', animate('0.5s')),
    ]),
  ],
})
export class CategoriesComponent implements OnInit, OnDestroy {
  state = 'hidden';
  iconsShowing = new Set<string>();
  loading = false;
  user: User | undefined;
  categoriesProducts: CategoryProduct[] = [];
  wishedProducts: string[] = [];
  cartItems: CartItem[] = [];
  slider: HTMLElement | null = null;
  sliders: any = [];
  defaultTransform = 0;
  updateLoadingStatusSubscription: Subscription | undefined;
  updateWishedProductSubscription: Subscription | undefined;

  constructor(
    private categoriesService: CategoriesService,
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
    this.categoriesService.updateLoadingStatus.next(true);

    this.categoriesService.getCategories().subscribe({
      next: (res) => {
        const mainCategories = res.categories.filter(
          (category) => !category.parent
        );

        for (const mainCat of mainCategories) {
          const childCategories = res.categories
            .filter((category) => category.parent?.id === mainCat.id)
            .map((category) => category.id);

          const allCategoryIds = [mainCat.id, ...childCategories!];

          this.categoriesService.updateLoadingStatus.next(true);
          this.categoriesService
            .getCategoriesProducts(JSON.stringify(allCategoryIds))
            .subscribe({
              next: (res) => {
                if (this.authService.getIsAuthenticated())
                  this.categoriesService.getWishedProducts(
                    this.user!.id,
                    res.categoriesProducts.map((np) => np.id)
                  );

                if (res.categoriesProducts.length > 0)
                  this.categoriesProducts.push({
                    category: mainCat,
                    categoriesProducts: res.categoriesProducts,
                  });
              },
              error: (err) => {
                if (!err.status)
                  this.toastr.showError('Server failed!', '', {
                    toastClass: 'error-toast',
                    timeOut: 3000,
                    extendedTimeOut: 1000,
                    positionClass: 'toast-top-right',
                    preventDuplicates: true,
                  });
                else
                  this.toastr.showError(err.error.message, '', {
                    toastClass: 'error-toast',
                    timeOut: 3000,
                    extendedTimeOut: 1000,
                    positionClass: 'toast-top-right',
                    preventDuplicates: true,
                  });
              },
              complete: () => {},
            });
        }
        this.categoriesService.updateLoadingStatus.next(false);
      },
      error: (err) => {
        console.log(err);
        if (!err.status)
          this.toastr.showError('Server failed!', '', {
            toastClass: 'error-toast',
            timeOut: 3000,
            extendedTimeOut: 1000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
          });
        else
          this.toastr.showError(err.error.message, '', {
            toastClass: 'error-toast',
            timeOut: 3000,
            extendedTimeOut: 1000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
          });
        this.categoriesService.updateLoadingStatus.next(false);
      },
      complete: () => {
        this.categoriesService.updateLoadingStatus.next(false);
      },
    });

    this.defaultTransform = 0;

    this.updateLoadingStatusSubscription =
      this.categoriesService.updateLoadingStatus.subscribe((status) => {
        this.loading = status;
      });

    this.updateWishedProductSubscription =
      this.categoriesService.updateWishedProducts.subscribe(
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
    this.categoriesService.addProductToWishList(productId, this.user!.id);
  }

  onRemoveFromWhishlist(productId: string): void {
    this.categoriesService.removeProductFromWishList(this.user!.id, productId);
  }

  onMouseLeave(productId: string): void {
    this.state = 'hidden';
    this.iconsShowing.delete(productId);
  }

  onMouseEnter(productId: string): void {
    this.state = 'visible';
    this.iconsShowing.add(productId);
  }

  goNext(el: HTMLDivElement) {
    const currentSlider = this.sliders[el.id];

    this.defaultTransform = this.defaultTransform - 398;
    if (Math.abs(this.defaultTransform) >= currentSlider!.scrollWidth / 1.7)
      this.defaultTransform = 0;

    currentSlider!.style.transform =
      'translateX(' + this.defaultTransform + 'px)';
  }

  goPrev(el: HTMLDivElement) {
    const currentSlider = this.sliders[el.id];

    if (Math.abs(this.defaultTransform) === 0) this.defaultTransform = 0;
    else this.defaultTransform = this.defaultTransform + 398;
    currentSlider!.style.transform =
      'translateX(' + this.defaultTransform + 'px)';
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

  onViewProduct(productID: string): void {
    this.router.navigate(['products/', productID]);
  }

  onShowCategory(category: Category): void {
    this.categoriesService.updateCategory.next(category);
    this.router.navigate(['categories/', category.id]);
  }

  ngOnDestroy(): void {
    this.updateWishedProductSubscription?.unsubscribe();
    this.updateLoadingStatusSubscription?.unsubscribe();
  }
}
