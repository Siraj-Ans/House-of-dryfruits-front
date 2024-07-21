import { AsyncPipe, CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { map, Observable, Subscription } from 'rxjs';

import { ProductService } from './product.service';
import { HeaderService } from '../header/header.serice';
import { ToastService } from '../toast.service';

import { Product } from '../new-product/product.model';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, AsyncPipe, MatIconModule, RouterModule],
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit, OnDestroy {
  productRes$: Observable<{ message: string; product: Product }> | undefined;
  product: Product | undefined;
  selectedImage: string | undefined;
  cartItems: string[] = [];
  productSubscription: Subscription | undefined;
  selectedImageStyle = {
    boxShadow: '0px 4px 15px -5px rgba(6, 81, 237, 0.5)',
    backGround: 'black',
  };

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('cart')) {
        const cartItems = JSON.parse(localStorage.getItem('cart')!);

        this.cartItems = cartItems;
      }
    }

    this.productRes$ = this.activatedRoute.data.pipe(
      map((data) => {
        this.selectedImage = data['product'].product.productImages[0];
        this.product = data['product'].product;
        return data['product'];
      })
    );

    this.productSubscription = this.productService.updateProduct.subscribe(
      (product) => {
        this.product = product;
      }
    );
  }

  onSelectImage(selectedImage: string): void {
    this.selectedImage = selectedImage;
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

  onViewProduct(id: string): void {
    this.router.navigate(['products/' + id]);
  }

  onBack(): void {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  ngOnDestroy(): void {
    this.productSubscription?.unsubscribe();
  }
}
