
import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NotifService } from '../services/notif.service';
import { BrowserStorageService } from '../services/storageService';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(private notifService: NotifService, private bsService: BrowserStorageService,
        private cookieService: CookieService, private router: Router) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if(request.url.indexOf('data.opendatasoft.com') === -1 ) {
            if(!request.headers.has('Content-Type') && request.url.indexOf('/api/documents/upload') === -1 && request.url.indexOf('/api/users/upload') === -1 && request.url.indexOf('/api/documents/export') === -1) {
                request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
            }
    
            // console.log('[HttpConfigInterceptor] request', request)
            // if(request.url.indexOf('localhost') !== -1 || request.url.indexOf('api.normsup') !== -1) {
                request = request.clone({
                    withCredentials: true,
                });
            // }
            // console.log('[HttpConfigInterceptor] request.withCredentials', request.withCredentials)
            request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
        }

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {    
                if(event instanceof HttpResponse) {
                    // console.log('event--->>>', event);
                    // this.errorDialogService.openDialog(event);
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                console.log('intercept error error', error);
                if(error.error && error.error.message && error.error.message.indexOf('User is not authentified') !== -1) {
                    // this.logOutUser();
                }
                // let data = {};
                // data = {
                //     reason: error && error.error && error.error.reason ? error.error.reason : '',
                //     status: error.status
                // };
                // this.errorDialogService.openDialog(data);
                return throwError(error);
            }));
    }


    logOutUser() {
        this.bsService.clearLocalStorage();
        this.cookieService.delete('auth');
        this.cookieService.delete('supplier');
        this.cookieService.delete('refresh');
        this.router.navigate(['login']);
        this.notifService.error('Veuillez vous authentifier.');
    }
}