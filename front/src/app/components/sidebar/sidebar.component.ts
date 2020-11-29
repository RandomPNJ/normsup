import {Component, Input, OnInit} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() topMenuNavLinks = [];
  @Input() defaultLinkImgCircle;
  @Input() withHelpBottomMenu = false;

  withHelp = true;

  user;
  showHeader;
  isLoggedIn: Subscription;
  isBackoffice: Boolean = false;

  displayHelp = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit() {
    if (this.router.url.indexOf('/backoffice') !== -1) {
      this.isBackoffice = true;
    }
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)).subscribe(() => {
        if (this.activatedRoute.snapshot['_routerState'].url.indexOf('/backoffice') !== -1) {
          this.isBackoffice = true;
        } else {
          this.isBackoffice = false;
        }
      });
    this.isLoggedIn = this.authService.isLogged.subscribe(res => {
      if (res !== false && res.data) {
        this.user = res.data;
      }
      this.showHeader = !!res;
    });
  }

}
