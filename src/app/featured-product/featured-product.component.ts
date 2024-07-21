import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FeaturedProductService } from './featured-product.service';
import { Setting } from '../shared/Setting.model';
import { Product } from '../new-product/product.model';

@Component({
  selector: 'app-featured-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured-product.component.html',
})
export class FeaturedComponent implements OnInit {
  featuredProduct: Product | undefined;

  constructor(private featuredProductService: FeaturedProductService) {}

  ngOnInit(): void {
    this.featuredProductService.getFeaturedProduct();

    this.featuredProductService.updateFeaturedProduct.subscribe(
      (featuredProduct) => {
        this.featuredProduct = featuredProduct;
      }
    );
  }
}
