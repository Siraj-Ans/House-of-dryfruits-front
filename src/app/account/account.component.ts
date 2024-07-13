import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from './auth/auth.service';
import { AccountDetails } from './AccountDetails.model';
import { AccountService } from './account.service';

import { User } from './User.model';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RouterModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent implements OnInit {
  user: User | undefined;
  accountDetails: AccountDetails | undefined;
  updateUserSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.authService.updateUser.subscribe((user) => {
      this.user = user;
      this.accountService.getAccountDetails(this.user.id);
    });

    this.accountService.updatedAccountDetails.subscribe((accountDetails) => {
      this.accountDetails = accountDetails;
      console.log('accountDetails: ', this.accountDetails);
    });
  }

  onLogout(): void {
    this.authService.logOut();
  }

  onUpdate(accountDetailsForm: NgForm): void {
    const accountDetails = new AccountDetails(
      this.user!.id,
      accountDetailsForm.value.emailAddress,
      accountDetailsForm.value.phoneNumber,
      accountDetailsForm.value.city,
      +accountDetailsForm.value.postalCode,
      accountDetailsForm.value.address1,
      accountDetailsForm.value.address2,
      this.accountDetails?.id
    );

    this.accountService.updateAccountDetails(accountDetails);
  }

  onSave(accountDetailsForm: NgForm): void {
    const accountDetails = new AccountDetails(
      this.user!.id,
      accountDetailsForm.value.emailAddress,
      accountDetailsForm.value.phoneNumber,
      accountDetailsForm.value.city,
      +accountDetailsForm.value.postalCode,
      accountDetailsForm.value.address1,
      accountDetailsForm.value.address2,
      this.accountDetails?.id
    );

    this.accountService.createAccountDetails(accountDetails);
  }
}
