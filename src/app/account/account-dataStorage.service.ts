import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountDetails } from './AccountDetails.model';
import { map, Observable } from 'rxjs';
import {
  FetchAccountDetails,
  SaveAccountDetails,
  UpdateAccountDetailsResponse,
} from './AccountDetailsRes.model';

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
      phoneNumber: string;
      postalCode: number;
      city: string;
      address1: string;
      address2: string;
    };
  }> {
    return this.http
      .post<SaveAccountDetails>(
        'http://localhost:3000/api/account/saveAccountDetails',
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
      phoneNumber: string;
      city: string;
      postalCode: number;
      address1: string;
      address2: string;
    };
  }> {
    return this.http
      .get<FetchAccountDetails>(
        'http://localhost:3000/api/account/fetchAccountDetails',
        {
          params: new HttpParams().set('userId', userId),
        }
      )
      .pipe(
        map((res) => {
          return {
            message: res.message,
            accountDetails: {
              id: res.accountDetails._id,
              userId: res.accountDetails.userId,
              emailAddress: res.accountDetails.emailAddress,
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

  updateAccountDetails(accountDetails: AccountDetails): Observable<{
    message: string;
  }> {
    console.log(accountDetails);
    return this.http.post<UpdateAccountDetailsResponse>(
      'http://localhost:3000/api/account/updateAccountDetails',
      accountDetails
    );
  }
}
