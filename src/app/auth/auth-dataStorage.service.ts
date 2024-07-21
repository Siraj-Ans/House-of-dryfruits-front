import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { LoginUserResponse, SignUpUserResponse } from './AuthRes.model';

@Injectable({ providedIn: 'root' })
export class AuthDataStorageService {
  constructor(private http: HttpClient) {}

  login(
    emailAddress: string,
    password: string
  ): Observable<{
    message: string;
    user: {
      id: string;
      userName: string;
      emailAddress: string;
    };
    token: string;
    expiresIn: number;
  }> {
    return this.http
      .post<LoginUserResponse>('http://localhost:3000/api/user/login', {
        emailAddress: emailAddress,
        password: password,
      })
      .pipe(
        map((res) => {
          return {
            message: res.message,
            user: {
              id: res.user._id,
              userName: res.user.userName,
              emailAddress: res.user.emailAddress,
            },
            token: res.token,
            expiresIn: res.expiresIn,
          };
        })
      );
  }

  signup(
    userName: string,
    emailAddress: string,
    password: string
  ): Observable<{
    message: string;
    user: {
      id: string;
      userName: string;
      emailAddress: string;
    };
  }> {
    return this.http
      .post<SignUpUserResponse>('http://localhost:3000/api/user/signup', {
        userName: userName,
        emailAddress: emailAddress,
        password: password,
      })
      .pipe(
        map((res) => {
          return {
            message: res.message,
            user: {
              id: res.user._id,
              userName: res.user.userName,
              emailAddress: res.user.emailAddress,
            },
          };
        })
      );
  }
}
