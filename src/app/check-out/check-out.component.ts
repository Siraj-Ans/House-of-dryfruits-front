import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { BarSpinner } from '../shared/bar-spinner/bar-spinner.component';

import { CheckOutService } from './check-out.service';
import { AuthService } from '../auth/auth.service';
import { CartService } from '../cart/cart.service';
import { HeaderService } from '../header/header.serice';
import { ToastService } from '../toast.service';

import { AccountDetails } from '../account/AccountDetails.model';
import { User } from '../account/User.model';
import { Product } from '../new-product/product.model';
import { CartItem } from '../shared/CartItem.model';
import { Order } from '../shared/Order.model';

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    BarSpinner,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './check-out.component.css',
})
export class CheckOutComponent implements OnInit, OnDestroy {
  isChecked = false;
  checkoutSuccess = false;
  user: User | undefined;
  loading = false;
  products: Product[] = [];
  cartItems: CartItem[] = [];
  checkOutForm!: FormGroup;
  accountDetails: AccountDetails | undefined;
  updateAccountDetailsSubscription: Subscription | undefined;
  updateCheckedOutProductsSubscription: Subscription | undefined;
  updateProductsSubscription: Subscription | undefined;
  updateLoadingStatusSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private checkOutService: CheckOutService,
    private authService: AuthService,
    private cartService: CartService,
    private headerService: HeaderService,
    private toastr: ToastService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.checkOutForm = this.fb.group({
      emailAddress: [null, [Validators.required, Validators.email]],
      country: ['Pakistan', [Validators.required]],
      phoneNumber: [null, Validators.required],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      city: [null, Validators.required],
      postalCode: [null, Validators.required],
      address1: [null, Validators.required],
      address2: [null],
      paymentMethod: [null, Validators.required],
    });

    this.user = this.authService.getUser();
    this.checkOutService.getAccountDetails(this.user!.id);

    this.updateCheckedOutProductsSubscription =
      this.cartService.updateCheckedOutProducts.subscribe((cartItems) => {
        this.cartItems = cartItems;
        const productIds = cartItems.map((cartItem) => cartItem.product);

        this.checkOutService.getCheckedOutProducts(productIds);
      });

    this.updateProductsSubscription =
      this.checkOutService.updateProducts.subscribe((products) => {
        this.products = products;
      });

    this.updateAccountDetailsSubscription =
      this.checkOutService.updateAccountDetails.subscribe((accountDetails) => {
        this.accountDetails = accountDetails;

        this.checkOutForm.setValue({
          emailAddress: this.accountDetails.emailAddress,
          country: 'Pakistan',
          firstName: this.accountDetails.firstName,
          lastName: this.accountDetails.lastName,
          phoneNumber: this.accountDetails.phoneNumber,
          city: this.accountDetails.city,
          postalCode: this.accountDetails.postalCode,
          address1: this.accountDetails.address1,
          address2: this.accountDetails.address2
            ? this.accountDetails.address2
            : null,
          paymentMethod: 'COD',
        });

        this.isChecked = false;
      });

    this.updateLoadingStatusSubscription =
      this.checkOutService.updateLoadingStatus.subscribe((status) => {
        this.loading = status;
      });
  }

  onCheckOut(): void {
    if (this.checkOutForm.invalid) return;

    let productInfo: {
      productName: string;
      quantity: number;
      productsTotal: number;
    }[] = [];

    this.cartItems.forEach((cartItem, index) => {
      productInfo.push({
        productName: this.products[index].productName,
        quantity: cartItem.quanity,
        productsTotal: cartItem.total,
      });
    });

    let order;

    if (this.checkOutForm.value.address2 === '')
      order = new Order(
        this.user!.id,
        this.checkOutForm.value.emailAddress,
        this.checkOutForm.value.country,
        this.checkOutForm.value.phoneNumber,
        this.checkOutForm.value.firstName,
        this.checkOutForm.value.lastName,
        this.checkOutForm.value.city,
        this.checkOutForm.value.postalCode,
        this.checkOutForm.value.address1,
        this.checkOutForm.value.paymentMethod,
        productInfo,
        false,
        'pending',
        false
      );
    else
      order = new Order(
        this.user!.id,
        this.checkOutForm.value.emailAddress,
        this.checkOutForm.value.country,
        this.checkOutForm.value.phoneNumber,
        this.checkOutForm.value.firstName,
        this.checkOutForm.value.lastName,
        this.checkOutForm.value.city,
        this.checkOutForm.value.postalCode,
        this.checkOutForm.value.address1,
        this.checkOutForm.value.paymentMethod,
        productInfo,
        false,
        'pending',
        false,
        this.checkOutForm.value.address2
      );

    this.checkOutService.updateLoadingStatus.next(true);
    this.checkOutService.createdOrder(order).subscribe({
      next: (res) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('cart');
          this.headerService.updateCartItemsCount.next(0);
        }
        this.toastr.showSuccess('Order created!', '', {
          toastClass: 'success-toast',
          timeOut: 3000,
          extendedTimeOut: 1000,
          positionClass: 'toast-top-right',
          preventDuplicates: true,
        });
        this.products = [];
        this.cartItems = [];
        this.checkoutSuccess = true;
      },
      error: (err) => {
        if (!err.status)
          this.toastr.showError('Server failed!', '', {
            toastClass: 'error-toast',
            timeOut: 3000,
            extendedTimeOut: 1000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
          });
        else
          this.toastr.showError(err.error.message, '', {
            toastClass: 'error-toast',
            timeOut: 3000,
            extendedTimeOut: 1000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
          });
        this.checkOutService.updateLoadingStatus.next(false);
      },
      complete: () => {
        this.checkOutService.updateLoadingStatus.next(false);
      },
    });
  }

  onBankDeposit(): void {
    this.isChecked = true;
  }

  onCOD(): void {
    this.isChecked = false;
  }

  onBack(): void {
    this.router.navigate(['../cart'], { relativeTo: this.activatedRoute });
  }

  ngOnDestroy(): void {
    this.updateAccountDetailsSubscription?.unsubscribe();
    this.updateProductsSubscription?.unsubscribe();
    this.updateCheckedOutProductsSubscription?.unsubscribe();
    this.updateLoadingStatusSubscription?.unsubscribe();
  }
}
