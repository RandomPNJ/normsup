import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedinGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    return this.authService.isLoggedIn('USER')
    .pipe(
      map(res => {

        if(res['authentified'] === false && route.routeConfig.path === 'login') {
          // Not connected but wants to access login page
          return true;
        } else if(res['authentified'] === false && route.routeConfig.path !== 'login') {
          // Not connected but doesn't want to access login, so we redirect to login
          this.router.navigate(['/login']);
          return false;
        } else if(res['authentified'] && res['user']) {
          // Connected, we check if type is USER

          if(route.routeConfig.path === 'login') {
            // If connected and wanted to go to login, redirect to dashboard main

            this.router.navigate(['/dashboard/main']);
            return true;
          } else if(res['user'].role && route.data.roles) {
            // Checks role before accessing page

            let accepted = false;
            for(const role of route.data.roles) {
              if(role === res['user'].role.toUpperCase()) {
                accepted = true;
                break;
              }
            }

            if(accepted) {
              return accepted;
            } else {
              // Not allowed to go to this page
              this.router.navigate(['dashboard', 'main']);
            }
          }
          else {
            return true;
          }
        } else {
          return false;
        }
      }),
      catchError(err => {
        this.router.navigate(['login']);
        return throwError(err);
      })
    )
  }
}
