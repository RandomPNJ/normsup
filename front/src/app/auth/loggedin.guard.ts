import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedinGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const res = this.authService.isLoggedIn();
    if(res === false) {
      this.router.navigate(['/login']);
      return false;
    } else if(route.data.roles && res.role) {
      let accepted = false;
      for(const role of route.data.roles) {
        if(role === res.role.toUppercase()) {
          accepted = true;
          break;
        }
      }
      if(accepted) {
        return accepted;
      } else {
        this.router.navigate(['/']);
        return accepted;
      }
    } else {
      return true;
    }
  }
}