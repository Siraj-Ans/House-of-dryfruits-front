import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

import { DropDownDirective } from '../shared/toggle-dropdown.directive';

import { CategoryService } from './category.service';

import { Category } from '../categories/category.model';
import { Product } from '../new-product/product.model';
import { User } from '../account/User.model';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    DropDownDirective,
    FormsModule,
    AsyncPipe,
  ],
  templateUrl: './category.component.html',
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
export class CategoryComponent implements OnInit, OnDestroy {
  state = 'hidden';
  iconsShowing = new Set<string>();
  categoryRes$: Observable<{ message: string; category: Category }> | undefined;
  category: Category | undefined;
  categoryProducts: Product[] = [];
  user: User | undefined;
  wishedProducts: string[] = [];
  updatedCategorySubscription: Subscription | undefined;
  updateCategoryProductsSubscription: Subscription | undefined;
  updateLoadingStatusSubscription: Subscription | undefined;
  updateWishedProductSubscription: Subscription | undefined;
  foods = [
    { value: 'All', viewValue: 'All' },
    { value: 'price, lowest first', viewValue: 'price, lowest first' },
    { value: 'price, highest first', viewValue: 'price, highest first' },
    { value: 'oldest first', viewValue: 'oldest first' },
    { value: 'oldest first', viewValue: 'oldest first' },
  ];

  constructor(
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();

    this.categoryRes$ = this.activatedRoute.data.pipe(
      map((data) => {
        this.category = data['category'].category;
        const categoryId = data['category'].category.id;
        this.categoryService.getCategoryProducts(categoryId);
        return data['product'];
      })
    );

    this.updatedCategorySubscription =
      this.categoryService.udatedCategoryProducts.subscribe(
        (categoryProducts) => {
          this.categoryProducts = categoryProducts;

          if (this.authService.getIsAuthenticated())
            this.categoryService.getWishedProducts(
              this.user!.id,
              this.categoryProducts.map((np) => np.id)
            );
        }
      );

    this.updateWishedProductSubscription =
      this.categoryService.updateWishedProducts.subscribe((wishedProducts) => {
        this.wishedProducts = wishedProducts;
      });
  }

  onAddToWhishlist(productId: string): void {
    this.categoryService.addProductToWishList(productId, this.user!.id);
  }

  onRemoveFromWhishlist(productId: string): void {
    this.categoryService.removeProductFromWishList(this.user!.id, productId);
  }

  onMouseLeave(productId: string): void {
    this.state = 'hidden';
    this.iconsShowing.delete(productId);
  }

  onMouseEnter(productId: string): void {
    this.state = 'visible';
    this.iconsShowing.add(productId);
  }

  onAddToCart(productId: string): void {}

  onViewProduct(productID: string): void {
    this.router.navigate(['products/', productID]);
  }

  ngOnDestroy(): void {
    this.updateCategoryProductsSubscription?.unsubscribe();
    this.updatedCategorySubscription?.unsubscribe();
    this.updateWishedProductSubscription?.unsubscribe();
    this.updateLoadingStatusSubscription?.unsubscribe();
  }
}
