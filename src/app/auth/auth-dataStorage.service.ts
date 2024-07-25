import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { LoginUserResponse, SignUpUserResponse } from './AuthRes.model';

import { environment } from '../../environments/environment.development';

const BACKEND_URL = environment.apiUrl + '/user/';

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
      .post<LoginUserResponse>(BACKEND_URL + 'login', {
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
      .post<SignUpUserResponse>(BACKEND_URL + 'signup', {
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
