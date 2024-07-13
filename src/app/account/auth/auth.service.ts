import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';

import { AuthDataStorageService } from './auth-dataStorage.service';

import { User } from '../User.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  updateAuthMode = new Subject<string>();
  updateUser = new ReplaySubject<User>();
  private token: undefined | null | string;
  private isAuthenticated = false;
  private timerExpiration: any;

  constructor(
    private authDataStorageService: AuthDataStorageService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(emailAddress: string, password: string): void {
    this.authDataStorageService.login(emailAddress, password).subscribe({
      next: (res) => {
        this.token = res.token;
        this.isAuthenticated = true;

        const now = new Date();
        const expiresInDuration = res.expiresIn;
        const expirationDate = new Date(
          now.getTime() + expiresInDuration * 1000
        );

        this.saveAuthData(res.token, expirationDate);
        this.setTokenTimer(expiresInDuration * 1000);

        const decodedToken: {
          exp: number;
          iat: number;
          id: string;
          userName: string;
          emailAddress: string;
        } = jwtDecode(res.token);

        const user = new User(
          decodedToken.id,
          decodedToken.userName,
          decodedToken.emailAddress
        );
        this.updateUser.next(user);

        this.router.navigate(['account']);
      },
      error: () => {},
      complete: () => {},
    });
  }

  signup(userName: string, email: string, password: string): void {
    this.authDataStorageService.signup(userName, email, password).subscribe({
      next: (res) => {
        this.updateAuthMode.next('login');
      },
      error: () => {},
      complete: () => {},
    });
  }

  private removeAuthData(): void {
    this.token = null;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('expiresIn');
    }
  }

  logOut(): void {
    this.removeAuthData();
    this.isAuthenticated = false;
    clearTimeout(this.timerExpiration);

    this.router.navigate(['account/auth']);
  }

  private setTokenTimer(expiresInDuration: number): void {
    this.timerExpiration = setTimeout(() => {
      this.logOut();
    }, expiresInDuration);
  }

  private saveAuthData(token: string, expirationDate: Date): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      localStorage.setItem('expiresIn', expirationDate.toISOString());
    }
  }

  autoAuth(): void {
    const authInfo = this.getAuthData();

    if (authInfo) {
      const now = new Date();
      const expirationDate = new Date(authInfo.expiresIn);
      const isInFuture = expirationDate.getTime() - now.getTime();

      if (isInFuture) {
        this.token = authInfo.token;
        this.isAuthenticated = true;

        const decodedToken: {
          exp: number;
          iat: number;
          id: string;
          userName: string;
          emailAddress: string;
        } = jwtDecode(this.token);

        const user = new User(
          decodedToken.id,
          decodedToken.userName,
          decodedToken.emailAddress
        );
        this.updateUser.next(user);

        this.setTokenTimer(isInFuture);
      }
    }
  }

  getAuthData(): undefined | { token: string; expiresIn: string } {
    let token = null;
    let expiresIn = null;

    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token');
      expiresIn = localStorage.getItem('expiresIn');
    }

    if (!token || !expiresIn) return;

    return {
      token: token,
      expiresIn: expiresIn,
    };
  }

  getAuthToken(): undefined | null | string {
    return this.token;
  }
}
