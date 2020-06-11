import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { throwError, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.authService.isLoggedIn('SUPPLIER')
      .pipe(
        map(res => {
          res['data'] ? res['data'].role = res['data'].type : '';
          console.log('res', res);
          console.log('route', route);

          if(res['authentified'] === false && route.routeConfig.path === 'login') {
            // Not connected but wants to access supplier part of the platform

            // if(route.firstChild && route.firstChild.url && route.firstChild.url[0] && route.firstChild.url[0].path && route.firstChild.url[0].path === 'login') {
            //   // Not connected but wants to access login page of the supplier part of the platform
            //   console.log('GuestGuard one');
            //   return true;
            // } else {
              // Not connected but wants to access login page of the supplier part of the platform
              // so we redirect to supplier login
              // console.log('GuestGuard two');
              this.router.navigate(['supplier', 'login']);
              // return false;
            // }
          } else if(res['authentified'] === true && route.routeConfig.path === 'upload') {
            // Connected, we check if type is USER

            // if(route.firstChild && route.firstChild.url && route.firstChild.url[0] && route.firstChild.url[0].path && route.firstChild.url[0].path === 'login') {
            //   // If connected and wanted to go to login, redirect to dashboard main
            //   console.log('GuestGuard three');
            //   this.router.navigate(['supplier', 'upload']);
            // } else {
              console.log('GuestGuard four');
              return true;
            // }
          } else {
            console.log('GuestGuard five');
            this.router.navigate(['supplier', 'login']);
            return false;
          }
        }),
        catchError((err) => {
          this.router.navigate(['supplier', 'login']);
          return throwError(err);
        })
      )
    ;

  }
}
