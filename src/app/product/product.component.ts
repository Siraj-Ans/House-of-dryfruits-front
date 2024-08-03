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
import { FormsModule, NgForm } from '@angular/forms';

import { BarSpinner } from '../shared/bar-spinner/bar-spinner.component';

import { ProductService } from './product.service';
import { HeaderService } from '../header/header.serice';
import { ToastService } from '../toast.service';
import { AuthService } from '../auth/auth.service';

import { Product } from '../new-product/product.model';
import { Review } from './Review.model';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    MatIconModule,
    RouterModule,
    FormsModule,
    BarSpinner,
  ],
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit, OnDestroy {
  reviews: Review[] = [];
  productRes$: Observable<{ message: string; product: Product }> | undefined;
  reviewValue = 0;
  reviewLoading = false;
  product: Product | undefined;
  reviewStars = [0, 1, 2, 3, 4];
  selectedImage: string | undefined;
  cartItems: string[] = [];
  selectedImageStyle = {
    boxShadow: '0px 4px 15px -5px rgba(6, 81, 237, 0.5)',
    backGround: 'black',
  };
  productSubscription: Subscription | undefined;
  updateReviewSubscription: Subscription | undefined;
  updateReviewLoadingStatusSubscription: Subscription | undefined;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastService,
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

    this.productService.updateReviews.subscribe((reviews) => {
      this.reviews = reviews;
    });

    this.productRes$ = this.activatedRoute.data.pipe(
      map((data) => {
        this.selectedImage = data['product'].product.productImages[0];
        this.product = data['product'].product;

        this.productService.getReviews(this.product!.id);
        return data['product'];
      })
    );

    this.productSubscription = this.productService.updateProduct.subscribe(
      (product) => {
        this.product = product;
      }
    );

    this.updateReviewLoadingStatusSubscription =
      this.productService.updateReviewLoadingStatus.subscribe((status) => {
        this.reviewLoading = status;
      });
  }

  onSaveReview(reviewForm: NgForm): void {
    if (!this.authService.getIsAuthenticated())
      return this.toastr.showError(
        'Please login first to save the review!',
        '',
        {
          toastClass: 'error-toast',
          timeOut: 3000,
          extendedTimeOut: 1000,
          positionClass: 'toast-top-right',
          preventDuplicates: true,
        }
      );

    this.productService.saveReview(
      reviewForm.value.title,
      reviewForm.value.comment,
      this.reviewValue,
      this.product!.id
    );
  }

  onChangeReview(i: number): void {
    this.reviewValue = i + 1;
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
    this.updateReviewSubscription?.unsubscribe();
    this.updateReviewLoadingStatusSubscription?.unsubscribe();
  }
}
