import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FeaturedComponent } from '../featured-product/featured-product.component';
import { NewProducts } from '../new-products/new-products.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FeaturedComponent, NewProducts],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
