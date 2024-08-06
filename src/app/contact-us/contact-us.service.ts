import { Injectable } from '@angular/core';

import { ContactUsDataStorageService } from './contact-us-dataStorage.service';
import { ToastService } from '../toast.service';

@Injectable({
  providedIn: 'root',
})
export class ContactUsService {
  constructor(
    private contactUsDataStorageService: ContactUsDataStorageService,
    private toastr: ToastService
  ) {}

  saveQuery(userName: string, emailAddress: string, message: string): void {
    this.contactUsDataStorageService
      .saveQuery(userName, emailAddress, message)
      .subscribe({
        next: (res) => {
          this.toastr.showSuccess('Query sent!', '', {
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
        },
      });
  }
}
