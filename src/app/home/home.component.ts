import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FeaturedComponent } from '../featured-product/featured-product.component';
import { NewProduct } from '../new-product/new-product.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FeaturedComponent, NewProduct],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
