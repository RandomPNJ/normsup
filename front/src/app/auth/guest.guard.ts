import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isLoggedIn('SUPPLIER').pipe(
      map(res => {
        res['data'] ? res['data'].role = res['data'].type : '';
        console.log('res', res);
        console.log('route.routeConfig.path', route.routeConfig.path);
        console.log('route.firstChild.url[0].path', route.firstChild.url[0].path);

        if(res['authentified'] === false && route.routeConfig.path === 'supplier') {
          // Not connected but wants to access supplier part of the platform

          if(route.firstChild && route.firstChild.url && route.firstChild.url[0] && route.firstChild.url[0].path && route.firstChild.url[0].path === 'login') {
            // Not connected but wants to access login page of the supplier part of the platform

            return true;
          } else {
            // Not connected but wants to access login page of the supplier part of the platform
            // so we redirect to supplier login

            this.router.navigate(['supplier', 'login']);
            return false;
          }
        } else if(res['authentified'] === true && route.routeConfig.path === 'supplier') {
          // Connected, we check if type is USER

          if(route.firstChild && route.firstChild.url && route.firstChild.url[0] && route.firstChild.url[0].path && route.firstChild.url[0].path === 'login') {
            // If connected and wanted to go to login, redirect to dashboard main

            this.router.navigate(['supplier', 'upload']);
          } else {
            return true;
          }
        } else {
          console.log('five');
          // this.router.navigate(['supplier', 'login']);
          return false;
        }
      })
    )

  }
}
