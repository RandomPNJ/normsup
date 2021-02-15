import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {AuthService} from '../../../services/auth.service';
import {BrowserStorageService} from '../../../services/storageService';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {NotifService} from '../../../services/notif.service';

@Component({
  selector: 'app-dashboard-supplier',
  templateUrl: './dashboard-supplier.component.html',
  styleUrls: ['./dashboard-supplier.component.scss']
})
export class DashboardSupplierComponent implements OnInit {

  authorized = false;
  sidebarVisible = true;
  user: any;

  constructor(
    private httpService: HttpService,
    private authService: AuthService,
    private bsService: BrowserStorageService,
    private cookieService: CookieService,
    private router: Router,
    private notificationService: NotifService) {

    this.httpService.get('/api/supplier/currentSupplier').subscribe(res => {

      if(this.isResValid(res)) {
        this.authorized = true;
        this.user = res.body['supplier'];
        console.log('Supplier user : ', this.user);
      } else {
        this.logOutUser();
      }

    }, (err) => {
      this.notificationService.error(err);
    });

  }

  ngOnInit(): void {}

  logOutUser() {
    this.bsService.clearLocalStorage();
    this.cookieService.delete('auth');
    this.cookieService.delete('refresh');
    this.router.navigate(['/supplier/login']);
    this.notificationService.error('Veuillez vous authentifier.');
  }

  private isResValid(res) {
    return res && res.body && res.body.authentified && res.body.supplier;
  }

}
