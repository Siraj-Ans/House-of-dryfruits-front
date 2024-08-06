import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SaveQuery } from './ContactUsRes.model';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment.development';

const BACKEND_URL = environment.apiUrl + '/contact/';

@Injectable({
  providedIn: 'root',
})
export class ContactUsDataStorageService {
  constructor(private http: HttpClient) {}

  saveQuery(
    userName: string,
    emailAddress: string,
    message: string
  ): Observable<{
    message: string;
  }> {
    return this.http.post<SaveQuery>(BACKEND_URL + 'contact-us', {
      userName: userName,
      emailAddress: emailAddress,
      message: message,
    });
  }
}
