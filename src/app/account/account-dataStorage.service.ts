import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { AccountDetails } from './AccountDetails.model';
import {
  FetchAccountDetails,
  SaveAccountDetails,
  UpdateAccountDetailsResponse,
} from './AccountDetailsRes.model';

import { environment } from '../../environments/environment.development';

const BACKEND_URL = environment.apiUrl + '/account/';

@Injectable({
  providedIn: 'root',
})
export class AccountDataStorageService {
  constructor(private http: HttpClient) {}

  saveAccountDetails(accountDetails: AccountDetails): Observable<{
    message: string;
    accountDetails: {
      userId: string;
      id: string;
      emailAddress: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      postalCode: number;
      city: string;
      address1: string;
      address2: string;
    };
  }> {
    return this.http
      .post<SaveAccountDetails>(
        'https://house-of-dryfruits-backend.onrender.com/api/account/saveAccountDetails',
        accountDetails
      )
      .pipe(
        map((res) => {
          return {
            message: res.message,
            accountDetails: {
              id: res.accountDetails._id,
              userId: res.accountDetails.userId,
              emailAddress: res.accountDetails.emailAddress,
              firstName: res.accountDetails.firstName,
              lastName: res.accountDetails.lastName,
              phoneNumber: res.accountDetails.phoneNumber,
              city: res.accountDetails.city,
              postalCode: res.accountDetails.postalCode,
              address1: res.accountDetails.address1,
              address2: res.accountDetails.address2,
            },
          };
        })
      );
  }

  fetchAccountDetails(userId: string): Observable<{
    message: string;
    accountDetails: {
      id: string;
      userId: string;
      emailAddress: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      city: string;
      postalCode: number;
      address1: string;
      address2: string;
    } | null;
  }> {
    return this.http
      .get<FetchAccountDetails>(
        'https://house-of-dryfruits-backend.onrender.com/api/account/fetchAccountDetails',
        {
          params: new HttpParams().set('userId', userId),
        }
      )
      .pipe(
        map((res) => {
          return {
            message: res.message,
            accountDetails: res.accountDetails
              ? {
                  id: res.accountDetails._id,
                  userId: res.accountDetails.userId,
                  emailAddress: res.accountDetails.emailAddress,
                  firstName: res.accountDetails.firstName,
                  lastName: res.accountDetails.lastName,
                  phoneNumber: res.accountDetails.phoneNumber,
                  city: res.accountDetails.city,
                  postalCode: res.accountDetails.postalCode,
                  address1: res.accountDetails.address1,
                  address2: res.accountDetails.address2,
                }
              : null,
          };
        })
      );
  }

  updateAccountDetails(accountDetails: AccountDetails): Observable<{
    message: string;
  }> {
    return this.http.post<UpdateAccountDetailsResponse>(
      'https://house-of-dryfruits-backend.onrender.com/api/account/updateAccountDetails',
      accountDetails
    );
  }
}
