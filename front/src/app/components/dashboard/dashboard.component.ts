import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import { NotifService } from 'src/app/services/notif.service';
import { BrowserStorageService } from 'src/app/services/storageService';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  authorized: Boolean = false;
  sidebarVisible: Boolean = true;
  user: any;

  navLinks = [];

  constructor(
    private httpService: HttpService,
    private authService: AuthService,
    private bsService: BrowserStorageService,
    private cookieService: CookieService,
    private router: Router,
    private notifService: NotifService,
    private activatedRoute: ActivatedRoute) {
    this.httpService.get('/api/users/current')
      .subscribe(res => {
        console.log('[DashboardComponent] currentUser res', res);
        if (res && res.body && res.body['authentified'] && res.body['user']) {
          this.authorized = true;
          this.user = res.body['user'];

          if (this.activatedRoute.snapshot['_routerState'].url.indexOf('/backoffice') !== -1) {
            this.initBackOfficeMenu();
          } else {
            this.initOtherMenu();
          }
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

  initBackOfficeMenu() {
    this.navLinks = [
      {
        id: 'clients',
        navLink: '/backoffice/client',
        logoLink: '../../../assets/img/menu-dashboard.svg',
        label: 'Clients'
      },
      {
        id: 'users',
        navLink: '/backoffice/users',
        logoLink: '../../../assets/img/menu-suppliers.svg',
        label: 'Utilisateurs'
      },
      {
        id: 'suppliers',
        navLink: '/backoffice/suppliers',
        logoLink: '../../../assets/img/menu-groups.svg',
        label: 'Utilisateurs (fournisseurs)'
      },
      {
        id: 'document',
        navLink: '/backoffice/documents',
        logoLink: '../../../assets/img/menu-groups.svg',
        label: 'Documents'
      }
    ];
  }

  initOtherMenu() {
    this.navLinks = [
      {
        id: 'dashboard',
        navLink: '/dashboard/main',
        logoLink: '../../../assets/img/menu-dashboard.svg',
        label: 'Tableau de bord'
      },
      {
        id: 'supplier',
        navLink: '/dashboard/supplier',
        logoLink: '../../../assets/img/menu-suppliers.svg',
        label: 'Fournisseurs'
      },
      {
        id: 'groups',
        navLink: '/dashboard/groups',
        logoLink: '../../../assets/img/menu-groups.svg',
        label: 'Groupes'
      },
      // {
      //   id: 'stats',
      //   navLink: '/dashboard/stats',
      //   logoLink: '../../../assets/img/menu-stats.svg',
      //   label: 'Statistiques'
      // },
      {
        id: 'export',
        navLink: '/dashboard/export',
        logoLink: '../../../assets/img/menu-exports.svg',
        label: 'Exports'
      }
    ];
  }
}

