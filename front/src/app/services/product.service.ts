import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from './http.service';
import { Product } from '../models/Product';
import { BrowserStorageService } from 'src/app/services/storageService';
import { Configuration } from '../config/environment';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { Observable, ObservableInput, throwError, Subject } from 'rxjs';
import Tools from './tools';
// Mock import
import { Mock_Product as mock } from '../models/mock_product';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
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

  getProducts(params): Observable<any> {
    this.getToken();
    console.log(this.httpOptions);
      return this.http.get(Configuration.serverUrl + '/api/product?' + params, this.httpOptions)
      .pipe(map((response: Response) => {
        console.log('Res ', response);
        return response;
      }), catchError(this.handleError));
  }

  putData(idNum, url, data) {
    this.getToken();
    console.log(this.httpOptions);
    return this.http.put(Configuration.serverUrl + url + idNum, data, this.httpOptions)
        .pipe(map((response: Response) => {
         return response;
        }), catchError(this.handleError));
  }

  postData(url, data) {
    this.getToken();
    console.log(this.httpOptions);
    return this.http.post(Configuration.serverUrl + url, data , this.httpOptions)
        .pipe(map((response: Response) => {
         return response;
        }), catchError(this.handleError));
  }


  getMockProducts(params) {
    return this.http
    .get('src/app/models/dapji3.json')
    .pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  postLoginData(url,  data) {
    return this.http.post(Configuration.serverUrl + url , data, {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    })
    .pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  private extractData(res: Response) {
    const body = res;
    console.log('response ');
    console.log(body);
    return body || {};
}

// Private Service method to handle erronous response
  private handleError(error: any) {
  console.log('ERROR in HANDLE ERROR ', error);
    const errMsg = (error.error.message) ? error.error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return throwError(errMsg);
}
}
