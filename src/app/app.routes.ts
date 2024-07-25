import { Routes } from '@angular/router';

import { CategoriesComponent } from './categories/categories.component';
import { AccountComponent } from './account/account.component';
import { CartComponent } from './cart/cart.component';
import { ProductsComponent } from './products/products.component';
import { HomeComponent } from './home/home.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { ProductComponent } from './product/product.component';
import { CategoryComponent } from './category/category.component';
import { AuthComponent } from './auth/auth.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { OrdersComponent } from './account/orders/orders.component';
import { WishListComponent } from './account/wishlist/wishlist.componenet';
import { TrackingComponent } from './tracking/tracking.component';

import { productResolver } from './product/product.resolver';
import { categoryResolver } from './category/category.resolver';
import { OrderResolver } from './tracking/order.resolver';

import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
  { path: 'categories', component: CategoriesComponent },
  {
    path: 'orders/:id',
    component: TrackingComponent,
    canActivate: [authGuard],
    resolve: { order: OrderResolver },
  },
  {
    path: 'categories/:id',
    component: CategoryComponent,
    resolve: { category: categoryResolver },
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'orders',
        component: OrdersComponent,
      },
      {
        path: 'wishlist',
        component: WishListComponent,
      },
    ],
  },
  { path: 'auth', component: AuthComponent },
  { path: 'cart', component: CartComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'check-out', component: CheckOutComponent, canActivate: [authGuard] },
  {
    path: 'products/:id',
    component: ProductComponent,
    resolve: { product: productResolver },
  },
  { path: '', component: HomeComponent },
  { path: '**', component: PageNotFoundComponent },
];
