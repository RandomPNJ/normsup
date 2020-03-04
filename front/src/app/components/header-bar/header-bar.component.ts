import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivationEnd, ActivationStart, NavigationStart, ResolveStart } from '@angular/router';
import { BrowserStorageService } from 'src/app/services/storageService';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})

export class HeaderBarComponent implements OnInit {
  logoImg;
  title;
  xceedLogo = '../../../assets/img/Logo_XCEED_color.svg';
  signOutLogo = '../../../assets/img/sign-out2-icn_black.svg';
  addIcon = '../../../assets/img/Add2-icn_black.svg';
  profileIcon = '';
  usersIcon = '';
  reportingIcon = '';
  contactIcon = '';
  user;
  showHeader;
  isLogout: Boolean = false;
  dropdownSecondBtn = 'Add data';

  isLoggedIn: Subscription;
  profileSub: Subscription;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private bsService: BrowserStorageService,
    private authService: AuthService,
    private settingsService: SettingsService) {
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLogged.subscribe(res => {
      console.log('res =', res);
      if(res !== false && res.data) {
        this.user = res.data;
      }
      this.showHeader = !!res;
      console.log('showHeader ', this.showHeader)
    });
    this.profileSub = this.settingsService.profileModif.subscribe(res => {
      console.log('user res uno =', res);
      console.log('user res uno2 =', typeof res);
      if(res && res.name) {
        console.log('user res dos =', res);
        this.user = res;
      }
    });
  }

  secondBtn(route) {
    if (route && route !== '') {
      this.router.navigate([route]);
    }
  }

  backToLogin() {
    // this.router.navigate(['login']);
    console.log(this.route.url);
  }

  redirect(route){
    if(route) {
      this.router.navigate([route]);
    }
  }

  dropbox() {
    if(this.isLogout === true) {
      this.isLogout = false;
    } else {
      this.isLogout = true;
    }
  }

  closeDropdown() {
    this.isLogout = false;
  }

  logOut() {
    this.bsService.clearLocalStorage();
    this.showHeader = false;
    this.router.navigate(['/logout']);
  }

  getHeaderStyle() {
    return 'whiteHeader';
  }
}
