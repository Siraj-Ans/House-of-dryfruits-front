import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { ToastService } from '../toast.service';
import { AuthService } from '../auth/auth.service';

import { environment } from '../../environments/environment.development';

const BACKEND_URL = environment.apiUrl + '/contact/';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css',
})
export class ContactUsComponent {
  constructor(
    private http: HttpClient,
    private toastr: ToastService,
    private authService: AuthService
  ) {}

  onContact(contactUsForm: NgForm): void {
    if (!this.authService.getUser())
      return this.toastr.showError('Login to send query!', '', {
        toastClass: 'error-toast',
        timeOut: 3000,
        extendedTimeOut: 1000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
      });

    this.http
      .post(BACKEND_URL + 'contact-us', {
        userName: contactUsForm.value.userName,
        emailAddress: contactUsForm.value.emailAddress,
        message: contactUsForm.value.message,
      })
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
