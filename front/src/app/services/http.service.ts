/*
 * Copyright IBM Corp. All Rights Reserved.
 * Unauthorized copying/modification of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Configuration } from '../config/environment';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { BrowserStorageService } from 'src/app/services/storageService';
import Tools from './tools';
import { Router } from '@angular/router';
import { reject } from 'q';


@Injectable({
  providedIn: 'root',
})

export class HttpService implements OnDestroy {

  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  public constructor(
    private _http: HttpClient,
    private bsService: BrowserStorageService,
    private _router: Router) {

  }

  ngOnDestroy(): void {
  }

  public get<t>(actionUrl: string, params?: HttpParams): Observable<HttpResponse<t>> {
    return this._http.get<t>(Configuration.serverUrl + actionUrl, {
      params: params,
      responseType: 'json',
      observe: 'response',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  public post<t>(actionUrl: string, body?: any): Observable<HttpResponse<t>> {
    return this._http.post<t>(Configuration.serverUrl + actionUrl, body, {
      headers: this.headers,
      responseType: 'json',
      observe: 'response'
    })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }




  private logoutIfAuthentFailed(err: HttpErrorResponse): void {
    if (err.status === 401) {
      this._router.navigateByUrl('/');
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}`);
    }

    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

}
