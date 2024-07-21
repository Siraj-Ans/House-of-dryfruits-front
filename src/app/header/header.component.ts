import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderService } from './header.serice';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartItemsCount: undefined | number;
  updatedCartItemsCountSubscription: Subscription | undefined;

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

  ngOnDestroy(): void {
    this.updatedCartItemsCountSubscription?.unsubscribe();
  }
}
