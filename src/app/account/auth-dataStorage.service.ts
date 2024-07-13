import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { user } from '@angular/fire/auth';
import { error } from 'console';

@Injectable({ providedIn: 'root' })
export class AuthDataStorageService {
  constructor(private http: HttpClient) {}

  login(emailAdress: string, password: string): void {
    this.http
      .post('http://localhost:3000/api/user/login', {
        emailAdress: emailAdress,
        password: password,
      })
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: () => {},
        complete: () => {},
      });
  }

  signup(userName: string, emailAdress: string, password: string): void {
    console.log(userName, emailAdress, password);
    this.http
      .post('http://localhost:3000/api/user/signup', {
        userName: userName,
        emailAdress: emailAdress,
        password: password,
      })
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: () => {},
        complete: () => {},
      });
  }
}
