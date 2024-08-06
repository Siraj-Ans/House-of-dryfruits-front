import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { ToastService } from '../toast.service';
import { AuthService } from '../auth/auth.service';
import { ContactUsService } from './contact-us.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css',
})
export class ContactUsComponent {
  constructor(
    private contactUsService: ContactUsService,
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

    this.contactUsService.saveQuery(
      contactUsForm.value.userName,
      contactUsForm.value.emailAddress,
      contactUsForm.value.message
    );
  }
}
