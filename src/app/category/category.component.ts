import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';

import { DropDownDirective } from '../shared/toggle-dropdown.directive';

import { CategoryService } from './category.service';

import { Category } from '../categories/category.model';
import { Product } from '../new-product/product.model';

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
})
export class CategoryComponent implements OnInit, OnDestroy {
  categoryRes$: Observable<{ message: string; category: Category }> | undefined;
  category: Category | undefined;
  categoryProducts: Product[] = [];
  updatedCategorySubscription: Subscription | undefined;
  updateCategoryProductsSubscription: Subscription | undefined;
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
    private router: Router
  ) {}

  ngOnInit(): void {
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
        }
      );
  }

  onAddToCart(productId: string): void {}

  onViewProduct(productID: string): void {
    this.router.navigate(['products/', productID]);
  }

  ngOnDestroy(): void {
    this.updateCategoryProductsSubscription?.unsubscribe();
    this.updatedCategorySubscription?.unsubscribe();
  }
}
