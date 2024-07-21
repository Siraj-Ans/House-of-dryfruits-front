import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { FeaturedProductDataStorageService } from './featured-product-dataStorage.service';
import { ToastService } from '../toast.service';

import { Product } from '../new-product/product.model';

@Injectable({
  providedIn: 'root',
})
export class FeaturedProductService {
  updateFeaturedProduct = new Subject<Product>();
  updateLoadingStatus = new Subject<boolean>();

  constructor(
    private featuredProductDataStorageService: FeaturedProductDataStorageService,
    private toastr: ToastService
  ) {}

  getFeaturedProduct(): void {
    this.updateLoadingStatus.next(true);
    this.featuredProductDataStorageService.fetchFeaturedProduct().subscribe({
      next: (res) => {
        this.updateFeaturedProduct.next(res.featuredProduct);
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
        this.updateLoadingStatus.next(false);
      },
      complete: () => {
        this.updateLoadingStatus.next(false);
      },
    });
  }
}
