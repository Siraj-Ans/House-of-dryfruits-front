import { Injectable } from '@angular/core';

import { AuthDataStorageService } from './auth-dataStorage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private authDataStorageService: AuthDataStorageService) {}

  login(email: string, password: string): void {
    this.authDataStorageService.login(email, password);
  }

  signup(userName: string, email: string, password: string): void {
    this.authDataStorageService.signup(userName, email, password);
  }
}
