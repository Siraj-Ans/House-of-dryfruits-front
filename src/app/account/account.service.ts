import { Injectable } from '@angular/core';

import { AccountDataStorageService } from './account-dataStorage.service';
import { AccountDetails } from './AccountDetails.model';
import { ToastService } from '../toast.service';
import { ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  updatedAccountDetails = new ReplaySubject<AccountDetails>(0);

  constructor(
    private accountDataStorageService: AccountDataStorageService,
    private toastr: ToastService
  ) {}

  createAccountDetails(accountDetails: AccountDetails): void {
    this.accountDataStorageService
      .saveAccountDetails(accountDetails)
      .subscribe({
        next: (res) => {
          console.log(res);
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
        },
        complete: () => {},
      });
  }

  updateAccountDetails(accountDetails: AccountDetails): void {
    this.accountDataStorageService
      .updateAccountDetails(accountDetails)
      .subscribe({
        next: (res) => {
          this.getAccountDetails(accountDetails.id!);
        },
      });
  }

  getAccountDetails(userId: string): void {
    this.accountDataStorageService.fetchAccountDetails(userId).subscribe({
      next: (res) => {
        this.updatedAccountDetails.next(res.accountDetails);
      },
      error: () => {},
      complete: () => {},
    });
  }
}
