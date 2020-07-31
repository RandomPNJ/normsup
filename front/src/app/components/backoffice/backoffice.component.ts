import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { NotifService } from 'src/app/services/notif.service';
import { BrowserStorageService } from 'src/app/services/storageService';

@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.component.html',
  styleUrls: ['./backoffice.component.scss']
})
export class BackofficeComponent implements OnInit {

  authorized: Boolean = false;
  sidebarVisible: Boolean = true;
  user: any;

  // Implement the admin checking

  constructor(private httpService: HttpService, private authService: AuthService,
    private bsService: BrowserStorageService, private cookieService: CookieService, 
    private router: Router, private notifService: NotifService) { 
    this.httpService.get('/api/admin/current')
      .subscribe(res => {
        console.log('[BackofficeComponent] currentAdmin res', res);
        if(res && res.body && res.body['authentified'] && res.body['user']) {
          this.authorized = true;
          this.user = res.body['user'];
        } else {
          this.logOutUser();
        }
      }, err => {
        console.error('[BackofficeComponent] currentAdmin err', err.reason);
        if(err.reason === -2) {
          this.authService.adminLogOut()
            .subscribe(res => {
              console.log('logout res', res);
            }, err => {
              console.error('logout err', err);
            });
        }
        // Disconnect user
      })
    ;
  }

  ngOnInit() {
  }

  logOutUser() {
    this.bsService.clearLocalStorage();
    this.cookieService.delete('auth');
    this.cookieService.delete('admin');
    this.cookieService.delete('refresh');
    this.router.navigate(['admin','login']);
    this.notifService.error('Veuillez vous authentifier.');
  }
}
