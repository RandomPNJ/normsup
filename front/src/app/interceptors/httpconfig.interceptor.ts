
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

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(private notifService: NotifService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if(request.url.indexOf('data.opendatasoft.com') === -1 ) {
            if(!request.headers.has('Content-Type')) {
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
                if (event instanceof HttpResponse) {
                    console.log('event--->>>', event);
                    // this.errorDialogService.openDialog(event);
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                let data = {};
                data = {
                    reason: error && error.error && error.error.reason ? error.error.reason : '',
                    status: error.status
                };
                // this.errorDialogService.openDialog(data);
                return throwError(error);
            }));
    }
}