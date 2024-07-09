import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NewProductsService } from '../new-product/new-product.service';
import { HeaderService } from './header.serice';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  cartItemsCount: undefined | number;

  constructor(
    private headerService: HeaderService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('cart')) {
        const cartItems = JSON.parse(localStorage.getItem('cart')!);

        this.cartItemsCount = cartItems.length;
      }
    }

    this.headerService.updateCartItemsCount.subscribe((count) => {
      this.cartItemsCount = count;
    });
  }
}
