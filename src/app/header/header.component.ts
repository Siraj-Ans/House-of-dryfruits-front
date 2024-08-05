import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

import { HeaderService } from './header.serice';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  animations: [
    trigger('expandContent', [
      state('collapsed', style({ width: '0%', height: '0%' })),
      state('expanded', style({ width: '100%', height: '100%' })),
      transition('collapsed <=> expanded', animate('300ms ease-in-out')),
    ]),
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartItemsCount: undefined | number;
  isMenuOpen = false;
  state = 'collapsed';
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

  toggleIcon(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.state = this.isMenuOpen ? 'expanded' : 'collapsed';
  }

  ngOnDestroy(): void {
    this.updatedCartItemsCountSubscription?.unsubscribe();
  }
}
