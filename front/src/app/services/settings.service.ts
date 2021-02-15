import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from './http.service';
import { Product } from '../models/Product';
import { BrowserStorageService } from 'src/app/services/storageService';
import { Configuration } from '../config/environment';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { Observable, ObservableInput, throwError, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  apiToken = '';
  private httpOptions = {};
  public profileModif: BehaviorSubject<any>;

  constructor(private httpService: HttpService, private http: HttpClient,
    private bsService: BrowserStorageService) { 
      this.profileModif  = new BehaviorSubject<any>(this.profileModification());
    }


  getToken() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
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

  public profileModification(): any {
    let loggedUser = this.bsService.getLocalStorage('current_user');
    loggedUser = JSON.parse(loggedUser);
    console.log('profileModification', loggedUser)
    if(loggedUser && loggedUser.username) {
      // I do this to preserve data coherency, as API return user in data property
      return loggedUser;
    } else {
      return false;
    }
  }

  public supplierProfileModification(): any {
    let loggedUser = this.bsService.getLocalStorage('current_supplier');
    loggedUser = JSON.parse(loggedUser);
    console.log('profileModification', loggedUser)
    if(loggedUser && loggedUser.username) {
      // I do this to preserve data coherency, as API return user in data property
      return loggedUser;
    } else {
      return false;
    }
  }
}
