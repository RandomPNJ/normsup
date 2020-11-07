import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Configuration } from '../config/environment';
import { BrowserStorageService } from 'src/app/services/storageService';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { NotifService } from './notif.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService implements OnInit {

  public isLogged: BehaviorSubject<any>;
  public isLoggedSupplier: BehaviorSubject<any>;
  public loginType: BehaviorSubject<any>;

  constructor(private http: HttpClient, private bsService: BrowserStorageService,
    private cookieService: CookieService, private router: Router, private notifService: NotifService) {
    this.isLogged  = new BehaviorSubject<any>(this.isLoggedIn('USER'));
    // this.isLoggedSupplier  = new BehaviorSubject<any>(this.isLoggedIn('SUPPLIER'));
    // this.loginType = new BehaviorSubject<any>(this.getUserType());
   }

  ngOnInit() {
  }

  public login(username: String, password: String, stayConnected: Boolean): Observable<any> {
    const body = {};
    body['username'] = username;
    body['password'] = password;
    body['stayConnected'] = stayConnected;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http
      .post(Configuration.serverUrl + '/api/auth/login', body, {headers: headers})
      .pipe(map((response: any) => {
        this.isLogged.next(response);
        console.log('[AuthService] Response login', response);
        return response;
      })
    );
  }

  public loginAsSupplier(username: String, password: String): Observable<any> {
    const body = {};
    body['username'] = username;
    body['password'] = password;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http
      .post(Configuration.serverUrl + '/api/auth/supplier-login', body, {headers: headers})
      .pipe(map((response: any) => {
        this.isLogged.next(response);
        return response;
      })
    );
  }

  public adminLogin(username: String, password: String, stayConnected: Boolean): Observable<any> {
    const body = {};
    body['username'] = username;
    body['password'] = password;
    body['stayConnected'] = stayConnected;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http
      .post(Configuration.serverUrl + '/api/auth/admin/login', body, {headers: headers})
      .pipe(map((response: any) => {
        this.isLogged.next(response);
        console.log('[AuthService] Response login', response);
        return response;
      })
    );
  }

  public isLoggedIn(type): any {
    if(type === 'SUPPLIER') {
      console.log('isLoggedIn SUPPLIER')
      return this.http
        .get(Configuration.serverUrl + '/api/supplier/currentSupplier')
        .pipe(map((response: any) => {
          console.log('[AuthService] Response getCurrentSupplierInfo', response);
          return response;
        }))
      ;
    } else if(type === 'USER') {
      return this.http
        .get(Configuration.serverUrl + '/api/users/current')
        .pipe(map((response: any) => {
          console.log('[AuthService] Response getCurrentUserInfo', response);
          return response;
        }))
      ;
    }
  }
  
  public getUserType(): any {
    return this.http
      .get(Configuration.serverUrl + '/api/auth/currentUser')
      .pipe(map((response: any) => {
        console.log('[AuthService] Response getUserType', response);
        if(response && response.type) {
          this.loginType.next(response.type);
        } else {
          this.loginType.next(null);
        }
        return response;
      })
    );
  }

  public resetPassword(email): any {
    let body = {email: email};
    return this.http
      .post(Configuration.serverUrl + '/api/auth/reset_password', body)
      .pipe(map((response: any) => {
        this.isLogged.next(response);
        console.log('[AuthService] Response resetPassword', response);
        return response;
      })
    );
  }

  public supplierResetPassword(email): any {
    let body = {email: email};
    return this.http
      .post(Configuration.serverUrl + '/api/auth/supplier_reset_password', body)
      .pipe(map((response: any) => {
        this.isLogged.next(response);
        console.log('[AuthService] Response resetPassword', response);
        return response;
      })
    );
  }
  
  public logOutUser() {
    this.bsService.clearLocalStorage();
    this.cookieService.delete('auth');
    this.cookieService.delete('refresh');
    this.router.navigate(['login']);
    this.notifService.error('Veuillez vous authentifier.');
  }

  public adminLogOut() {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http
      .post(Configuration.serverUrl + '/api/auth/admin/logout', {headers: headers})
      .pipe(map((response: any) => {
        this.router.navigate(['admin', 'login']);
      })
    );
  }
}
