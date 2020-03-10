import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Configuration } from '../config/environment';
import { Observable, throwError } from 'rxjs';
import { BrowserStorageService } from './storageService';
import { NotifService } from './notif.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})


export class UploadService {


  headers = new HttpHeaders({
    'Content-Type': 'multipart/form-data'
  });
  refreshTokenTrials = 0;

  constructor(
    private _http: HttpClient,
    private bsService: BrowserStorageService,
    private _router: Router,
    private notifService: NotifService
  ) { }


  public post<t>(actionUrl: string, body?: any): Observable<HttpResponse<t>> {
    return this._http.post<t>(Configuration.serverUrl + actionUrl, body, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${this.bsService.getLocalStorage('token')}`
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
    const refreshTok = this.bsService.getLocalStorage('refreshToken');
    return this.post('/api/auth/refresh_token', {refreshToken: refreshTok})
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
    this.bsService.setLocalStorage('token', data['token']);
    this.bsService.setLocalStorage('refreshToken', data['refreshToken']);
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
