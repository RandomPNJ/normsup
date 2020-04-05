import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { NotifService } from 'src/app/services/notif.service';
import { BrowserStorageService } from 'src/app/services/storageService';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  authorized: Boolean = false;
  sidebarVisible: Boolean = true;
  user: any;

  constructor(private httpService: HttpService, private authService: AuthService,
    private bsService: BrowserStorageService, private cookieService: CookieService, 
    private router: Router, private notifService: NotifService) { 
    this.httpService.get('/api/users/current')
      .subscribe(res => {
        console.log('currentUser res', res);
        if(res && res.body && res.body['authentified'] && res.body['user']) {
          this.authorized = true;
          this.user = res.body['user'];
        } else {
          this.logOutUser();
        }
      }, err => {
        // Disconnect user
        // this.authService.disconnectUser();
      })
    ;
  }

  ngOnInit() {
  }

  logOutUser() {
    this.bsService.clearLocalStorage();
    this.cookieService.delete('auth');
    this.cookieService.delete('refresh');
    this.router.navigate(['login']);
    this.notifService.error('Veuillez vous authentifier.');
}
}
