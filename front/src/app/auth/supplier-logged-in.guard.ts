import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {Observable, throwError} from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SupplierLoggedInGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    return this.authService.isLoggedIn('SUPPLIER')
      .pipe(
        map(res => {
          const isAuthentified = res['authentified'];
          console.log(res);
          if (isAuthentified) {
            return true;
          } else {
            this.redirectToLogin();
            return false;
          }
        }),
        catchError(err => {
          this.redirectToLogin();
          return throwError(err);
        })
      );
  }

  private redirectToLogin() {
    this.router.navigate(['supplier/login']);
  }

}
