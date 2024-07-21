import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

import { AccountDataStorageService } from './account-dataStorage.service';
import { ToastService } from '../toast.service';

import { AccountDetails } from './AccountDetails.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  updatedAccountDetails = new ReplaySubject<AccountDetails | null>(0);
  updateLoadingStatus = new Subject<boolean>();

  constructor(
    private accountDataStorageService: AccountDataStorageService,
    private toastr: ToastService
  ) {}

  createAccountDetails(accountDetails: AccountDetails): void {
    this.updateLoadingStatus.next(true);
    this.accountDataStorageService
      .saveAccountDetails(accountDetails)
      .subscribe({
        next: (res) => {
          this.toastr.showSuccess('Account details saved!', '', {
            toastClass: 'success-toast',
            timeOut: 3000,
            extendedTimeOut: 1000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
          });
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
          this.updateLoadingStatus.next(false);
        },
        complete: () => {
          this.updateLoadingStatus.next(false);
        },
      });
  }

  updateAccountDetails(accountDetails: AccountDetails): void {
    this.updateLoadingStatus.next(true);
    this.accountDataStorageService
      .updateAccountDetails(accountDetails)
      .subscribe({
        next: (res) => {
          this.getAccountDetails(accountDetails.userId!);
          this.toastr.showSuccess('Account details upated!', '', {
            toastClass: 'success-toast',
            timeOut: 3000,
            extendedTimeOut: 1000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
          });
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
          this.updateLoadingStatus.next(false);
        },
        complete: () => {
          this.updateLoadingStatus.next(false);
        },
      });
  }

  getAccountDetails(userId: string): void {
    this.accountDataStorageService.fetchAccountDetails(userId).subscribe({
      next: (res) => {
        console.log(res);
        this.updatedAccountDetails.next(res.accountDetails);
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
        this.updateLoadingStatus.next(false);
      },
      complete: () => {
        this.updateLoadingStatus.next(false);
      },
    });
  }
}
