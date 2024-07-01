import { Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { AccountComponent } from './account/account.component';
import { CartComponent } from './cart/cart.component';
import { ProductComponent } from './product/product.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: 'categories', component: CategoryComponent },
  { path: 'account', component: AccountComponent },
  { path: 'cart', component: CartComponent },
  { path: 'products', component: ProductComponent },
  { path: '', component: HomeComponent },
];
