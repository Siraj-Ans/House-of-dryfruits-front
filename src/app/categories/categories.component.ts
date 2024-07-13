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

import { CategoriesService } from './categories.service';
import { ToastService } from '../toast.service';
import { HeaderService } from '../header/header.serice';

import { Category } from './category.model';
import { CategoryProduct } from './CategoryProduct.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit, OnDestroy {
  categoriesProducts: CategoryProduct[] = [];
  cartItems: string[] = [];

  slider: HTMLElement | null = null;
  sliders: any = [];
  defaultTransform = 0;

  constructor(
    private categoriesService: CategoriesService,
    private toastService: ToastService,
    private router: Router,
    private headerService: HeaderService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
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

          this.categoriesService
            .getCategoriesProducts(JSON.stringify(allCategoryIds))
            .subscribe({
              next: (res) => {
                this.categoriesProducts.push({
                  category: mainCat,
                  categoriesProducts: res.categoriesProducts,
                });
              },
            });
        }
      },
      error: () => {},
      complete: () => {},
    });

    if (isPlatformBrowser(this.platformId)) {
      this.sliders = document.getElementsByClassName('slider');

      this.cartItems = JSON.parse(localStorage.getItem('cart')!);
    }

    this.defaultTransform = 0;
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

  onViewProduct(productID: string): void {
    this.router.navigate(['products/', productID]);
  }

  onShowCategory(category: Category): void {
    this.categoriesService.updateCategory.next(category);
    this.router.navigate(['/categories/', category.id]);
  }

  ngOnDestroy(): void {}
}
