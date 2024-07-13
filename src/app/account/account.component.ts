import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './account.component.html',
})
export class AccountComponent {
  mode = 'login';

  constructor(private authService: AuthService) {}

  signup(authForm: NgForm): void {
    console.log(authForm);
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

  onSignup(): void {
    this.mode = 'signup';
  }
}
