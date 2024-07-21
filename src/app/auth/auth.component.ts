import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

import { LoadSpinner } from '../shared/load-spinner/load-spinner.component';

import { AuthService } from './auth.service';

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

  constructor(private authService: AuthService) {}

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
