import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { BarSpinner } from '../shared/bar-spinner/bar-spinner.component';

import { AuthService } from '../auth/auth.service';
import { AccountService } from './account.service';

import { AccountDetails } from './AccountDetails.model';
import { User } from './User.model';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    RouterModule,
    ReactiveFormsModule,
    BarSpinner,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent implements OnInit, OnDestroy {
  user: User | undefined;
  loading = false;
  accountDetailsForm!: FormGroup;
  accountDetails: AccountDetails | undefined;
  updateAccountDetailsSubscription: Subscription | undefined;
  updateUserSubscription: Subscription | undefined;
  updateLoadingStatusSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.accountDetailsForm = this.fb.group({
      emailAddress: [null, [Validators.required, Validators.email]],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      city: [null, Validators.required],
      postalCode: [null, Validators.required],
      address1: [null, Validators.required],
      address2: [null],
    });

    this.user = this.authService.getUser();
    this.accountService.getAccountDetails(this.user!.id);

    this.updateUserSubscription = this.authService.updateUser.subscribe(
      (user) => {
        this.user = user;
        this.accountService.getAccountDetails(this.user.id);
      }
    );

    this.updateAccountDetailsSubscription =
      this.accountService.updatedAccountDetails.subscribe((accountDetails) => {
        if (!accountDetails) this.accountDetails = undefined;
        else {
          this.accountDetails = accountDetails;
          this.accountDetailsForm.setValue({
            emailAddress: this.accountDetails.emailAddress,
            firstName: this.accountDetails.firstName,
            lastName: this.accountDetails.lastName,
            phoneNumber: this.accountDetails.phoneNumber,
            city: this.accountDetails.city,
            postalCode: this.accountDetails.postalCode,
            address1: this.accountDetails.address1,
            address2: this.accountDetails.address2
              ? this.accountDetails.address2
              : null,
          });
        }
      });

    this.updateLoadingStatusSubscription =
      this.accountService.updateLoadingStatus.subscribe((status) => {
        this.loading = status;
      });
  }

  onLogout(): void {
    this.authService.logOut();
  }

  onUpdate(): void {
    if (this.accountDetailsForm.invalid) return;

    let accountDetails = undefined;

    if (!this.accountDetailsForm.value.address2)
      accountDetails = new AccountDetails(
        this.user!.id,
        this.accountDetailsForm.value.emailAddress,
        this.accountDetailsForm.value.firstName,
        this.accountDetailsForm.value.lastName,
        this.accountDetailsForm.value.phoneNumber,
        this.accountDetailsForm.value.city,
        +this.accountDetailsForm.value.postalCode,
        this.accountDetailsForm.value.address1
      );
    else
      accountDetails = new AccountDetails(
        this.user!.id,
        this.accountDetailsForm.value.emailAddress,
        this.accountDetailsForm.value.firstName,
        this.accountDetailsForm.value.lastName,
        this.accountDetailsForm.value.phoneNumber,
        this.accountDetailsForm.value.city,
        +this.accountDetailsForm.value.postalCode,
        this.accountDetailsForm.value.address1,
        this.accountDetailsForm.value.address2
      );

    this.accountService.updateAccountDetails(accountDetails);
  }

  onSave(): void {
    if (this.accountDetailsForm.invalid) return;

    let accountDetails = undefined;

    if (!this.accountDetailsForm.value.address2)
      accountDetails = new AccountDetails(
        this.user!.id,
        this.accountDetailsForm.value.emailAddress,
        this.accountDetailsForm.value.firstName,
        this.accountDetailsForm.value.lastName,
        this.accountDetailsForm.value.phoneNumber,
        this.accountDetailsForm.value.city,
        +this.accountDetailsForm.value.postalCode,
        this.accountDetailsForm.value.address1
      );
    else
      accountDetails = new AccountDetails(
        this.user!.id,
        this.accountDetailsForm.value.emailAddress,
        this.accountDetailsForm.value.firstName,
        this.accountDetailsForm.value.lastName,
        this.accountDetailsForm.value.phoneNumber,
        this.accountDetailsForm.value.city,
        +this.accountDetailsForm.value.postalCode,
        this.accountDetailsForm.value.address1,
        this.accountDetailsForm.value.address2
      );
    this.accountService.createAccountDetails(accountDetails);
  }

  ngOnDestroy(): void {
    this.updateAccountDetailsSubscription?.unsubscribe();
    this.updateUserSubscription?.unsubscribe();
    this.updateLoadingStatusSubscription?.unsubscribe();
  }
}
