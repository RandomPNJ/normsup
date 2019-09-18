import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from './http.service';
import { Product } from '../models/Product';
import { BrowserStorageService } from 'src/app/services/storageService';
import { Configuration } from '../config/environment';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { Observable, ObservableInput, throwError, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  apiToken = '';
  private httpOptions = {};
  constructor(private httpService: HttpService, private http: HttpClient,
    private bsService: BrowserStorageService) { }


  getToken() {
    if (this.bsService.getLocalStorage('token')) {
      this.apiToken = this.bsService.getLocalStorage('token');
    } else {
      this.apiToken = '';
    }
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-Access-token': this.apiToken
      })
    };
  }

  updateAlertSettings(url, data) {
    // this.getToken();
    console.log('here', Configuration.serverUrl + url);
    return this.httpService.post(Configuration.serverUrl + url, data)
        .pipe(map((response: Response) => {
          console.log('reso');
         return response;
        }), catchError(this.handleError));
  }

  // Private Service method to handle erronous response
  private handleError(error: any) {
    console.log('ERROR in HANDLE ERROR ', error);
      const errMsg = (error.error.message) ? error.error.message :
          error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      return throwError(errMsg);
  }

}
