import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

import { LoadSpinner } from '../shared/load-spinner/load-spinner.component';

import { AuthService } from './auth.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, LoadSpinner],
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit, OnDestroy {
  mode = 'login';

  loading = false;
  updateModeSubscription: Subscription | undefined;
  updateLoadingStatusSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private toastr: ToastService) {}

  ngOnInit(): void {
    this.updateModeSubscription = this.authService.updateAuthMode.subscribe(
      (mode) => {
        this.mode = mode;
      }
    );

    this.authService.updateLoadingStatus.subscribe((status) => {
      this.loading = status;
    });
  }

  signup(authForm: NgForm): void {
    this.authService.signup(
      authForm.value.userName,
      authForm.value.emailAddress,
      authForm.value.password
    );
  }

  login(authForm: NgForm): void {
    this.authService.login(
      authForm.value.emailAddress,
      authForm.value.password
    );
  }

  onForgotPassword(): void {
    this.mode = 'forgotPassword';
  }

  onChangePassword(authForm: NgForm): void {
    if (authForm.invalid) return;

    if (authForm.value.newPassword !== authForm.value.confirmPassword)
      return this.toastr.showError('Password dosent match!', '', {
        toastClass: 'error-toast',
        timeOut: 3000,
        extendedTimeOut: 1000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
      });

    this.authService
      .changePassword(
        authForm.value.emailAddress,
        authForm.value.previousPassword,
        authForm.value.newPassword
      )
      .subscribe({
        next: (res) => {
          this.mode = 'login';
          this.toastr.showSuccess('Password Updated!', '', {
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
        complete: () => {},
      });
  }

  onAuth(authForm: NgForm): void {
    if (this.mode === 'login') this.login(authForm);
    else this.signup(authForm);
  }

  onChangeMode(): void {
    if (this.mode == 'signup') this.mode = 'login';
    else this.mode = 'signup';
  }

  ngOnDestroy(): void {
    this.updateModeSubscription?.unsubscribe();
    this.updateLoadingStatusSubscription?.unsubscribe();
  }
}
