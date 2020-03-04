import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackofficeGuard implements CanActivate {
  
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

}
