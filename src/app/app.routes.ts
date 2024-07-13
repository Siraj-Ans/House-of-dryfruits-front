import { Routes } from '@angular/router';

import { CategoriesComponent } from './categories/categories.component';
import { AccountComponent } from './account/account.component';
import { CartComponent } from './cart/cart.component';
import { ProductsComponent } from './products/products.component';
import { HomeComponent } from './home/home.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { ProductComponent } from './product/product.component';
import { CategoryComponent } from './category/category.component';

import { productResolver } from './product/product.resolver';
import { categoryResolver } from './category/category.resolver';

export const routes: Routes = [
  { path: 'categories', component: CategoriesComponent },
  {
    path: 'categories/:id',
    component: CategoryComponent,
    resolve: { category: categoryResolver },
  },
  { path: 'account', component: AccountComponent },
  { path: 'cart', component: CartComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'check-out', component: CheckOutComponent },
  {
    path: 'products/:id',
    component: ProductComponent,
    resolve: { product: productResolver },
  },
  { path: '', component: HomeComponent },
];
