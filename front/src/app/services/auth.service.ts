import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Configuration } from '../config/environment';
import { BrowserStorageService } from 'src/app/services/storageService';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService implements OnInit {

  public isLogged: BehaviorSubject<any>;

  constructor(private http: HttpClient, private bsService: BrowserStorageService) {
    this.isLogged  = new BehaviorSubject<any>(this.isLoggedIn());
   }

  ngOnInit() {
    // this.isLogged  = new BehaviorSubject<any>(this.isLoggedIn());
  }
  public login(username: String, password: String): Observable<any> {
    const body = {};
    body['username'] = username;
    body['password'] = password;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http
      .post(Configuration.serverUrl + '/api/auth/login', body, {headers: headers})
      .pipe(map((response: any) => {
        this.isLogged.next(response);
        return response;
      })
    );
  }

  public isLoggedIn(): any {
    let loggedUser = this.bsService.getLocalStorage('current_user');
    console.log('logged', loggedUser);
    loggedUser = JSON.parse(loggedUser);
    if(loggedUser && loggedUser.username) {
      // I do this to preserve data coherency, as API return user in data property
      return { data : loggedUser };
    } else {
      return false;
    }
  }

}
