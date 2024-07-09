import { Routes } from '@angular/router';

import { CategoryComponent } from './category/category.component';
import { AccountComponent } from './account/account.component';
import { CartComponent } from './cart/cart.component';
import { ProductsComponent } from './products/products.component';
import { HomeComponent } from './home/home.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { ProductComponent } from './product/product.component';
import { productResolver } from './product/product.resolver';

export const routes: Routes = [
  { path: 'categories', component: CategoryComponent },
  { path: 'account', component: AccountComponent },
  { path: 'cart', component: CartComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'check-out', component: CheckOutComponent },
  {
    path: 'product/:id',
    component: ProductComponent,
    resolve: { product: productResolver },
  },
  { path: '', component: HomeComponent },
];
