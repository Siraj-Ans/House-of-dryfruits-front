import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

import { ProductDataStorageService } from './product-dataStorage.service';
import { ToastService } from '../toast.service';

import { Product } from '../new-product/product.model';
import { Review } from './Review.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  product: Product | undefined;
  updateReviews = new ReplaySubject<Review[]>(0);
  updateProduct = new Subject<Product>();
  updateReviewLoadingStatus = new Subject<boolean>();

  constructor(
    private productDataStorageService: ProductDataStorageService,
    private toastr: ToastService
  ) {}

  getProduct(productId: string): void {
    this.productDataStorageService.fetchProduct(productId).subscribe({
      next: (responseData) => {
        this.product = responseData.product;

        this.updateProduct.next(this.product);
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

  saveReview(
    title: string,
    comment: string,
    stars: number,
    productId: string
  ): void {
    this.updateReviewLoadingStatus.next(true);
    this.productDataStorageService
      .saveReview(title, comment, stars, productId)
      .subscribe({
        next: (res) => {
          this.getReviews(productId);
          this.toastr.showSuccess('Review sent!', '', {
            toastClass: 'success-toast',
            timeOut: 3000,
            extendedTimeOut: 1000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
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
          this.updateReviewLoadingStatus.next(false);
        },
        complete: () => {
          this.updateReviewLoadingStatus.next(false);
        },
      });
  }

  getReviews(productId: string): void {
    this.productDataStorageService.fetchReviews(productId).subscribe({
      next: (res) => {
        this.updateReviews.next(res.reviews);
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
}
