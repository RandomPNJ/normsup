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
import { NotifService } from './notif.service';


@Injectable({
  providedIn: 'root',
})

export class HttpService implements OnDestroy {

  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  refreshTokenTrials = 0;

  public constructor(
    private _http: HttpClient,
    private bsService: BrowserStorageService,
    private _router: Router,
    private notifService: NotifService) {

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
        catchError(this.handleError.bind(this))
      );
  }

  public post<t>(actionUrl: string, body?: any): Observable<HttpResponse<t>> {
    return this._http.post<t>(Configuration.serverUrl + actionUrl, body, {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'json',
      observe: 'response'
    })
      .pipe(
        // retry(1),
        catchError(this.handleError.bind(this))
      );
  }

  public uploadDocument<t>(actionUrl: string, body?: any): Observable<HttpResponse<t>> {
    return this._http.post<t>(Configuration.serverUrl + actionUrl, body, {
      headers: {
      },
      responseType: 'json',
      observe: 'response',
      // withCredentials: true
    })
      .pipe(
        // retry(1),
        catchError(this.handleError.bind(this))
      );
  }

  public getPicture<t>(actionUrl: string, params?: HttpParams): Observable<HttpResponse<t>> {
    return this._http.get<t>(Configuration.serverUrl + actionUrl, {
      observe: 'response',
      responseType: "blob" as 'json',
      headers: {
      }
    })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  public put<t>(actionUrl: string, body?: any): Observable<HttpResponse<t>> {
    return this._http.put<t>(Configuration.serverUrl + actionUrl, body, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'json',
        observe: 'response'
      })
      .pipe(
        // retry(1),
        catchError(this.handleError.bind(this))
      );
  }

  public delete<t>(actionUrl: string): Observable<HttpResponse<t>> {
    return this._http.delete<t>(Configuration.serverUrl + actionUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'json',
        observe: 'response'
      })
      .pipe(
        // retry(1),
        catchError(this.handleError.bind(this))
      );
  }

  public refreshToken() {
    // const refreshTok = this.bsService.getLocalStorage('refreshToken');
    return this.post('/api/auth/refresh_token')
      .subscribe(res => {
        this.setDataInBS({data: res.body['data'], token: res.body['token'], refreshToken: res.body['refreshToken']});
        this.notifService.error('Votre session a expirée, veuillez actualiser la page.');
        return throwError('retry');
      }, err => {
        if(this.refreshTokenTrials < 4) {
          this.refreshTokenTrials++;
        } else {
          this.notifService.error('Votre session a expirée, veuillez vous reconnecter.');
          return this.logoutUser();
        }
        if(err.msg && err.msg === 'User not found.') {
          this.logoutUser();
        }
        this.refreshToken();
      })
    ;
  }

  private logoutIfAuthentFailed(err: HttpErrorResponse): void {
    if (err.status === 401) {
      this._router.navigateByUrl('/');
    }
  }

  public logoutUser() {
    this.bsService.clearLocalStorage();
    this._router.navigate(['/login']);
    this.notifService.error('Votre session a expirée, veuillez vous reconnecter.');
  }

  public setDataInBS(data) {
    this.bsService.setLocalStorage('current_user', JSON.stringify(data['data']));
    // this.bsService.setLocalStorage('token', data['token']);
    // this.bsService.setLocalStorage('refreshToken', data['refreshToken']);
  }

  public handleError(error: HttpErrorResponse) {
    console.log('ero = ', error);
    if(error.error && error.error.reason === -1 && this.refreshTokenTrials < 4) {
      return this.refreshToken();
    } else if(error.error && error.error.reason === -1 && this.refreshTokenTrials >= 3){
      this.refreshTokenTrials = 0;
      this.logoutUser();
    }
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}`);
    }
    if(error.error) {
      return throwError(error.error);
    } else {
      return throwError(
        'Something bad happened; please try again later.');
    }
  }

}
