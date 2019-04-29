import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  isLogout = false;
  dropdownSecondBtn = 'Add data';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  secondBtn() {
    if (this.router.url.includes('/dataEntry')) {
      this.router.navigate(['search']);
    } else {
      this.router.navigate(['dataEntry']);
    }
  }

  backToLogin() {
    this.router.navigate(['login']);
  }

  dropbox() {
    if (this.isLogout) {
      this.isLogout = false;
    } else {
      this.isLogout = true;
    }
  }

  closeDropDown() {
    this.isLogout = false;
  }

  getHeaderStyle() {
    // if (this.router.url.includes('/dataEntry')) {
    //   return 'whiteHeader';
    // } else if (this.router.url.includes('/search')) {
    //   return 'whiteHeader';
    // } else if (this.router.url.includes('/results')) {
    //   this.xceedLogo = '../../../assets/img/Logo_XCEED_white.svg';
    //   this.logoImg = '../../../assets/img/Renault_logo-white.svg';
    //   this.signOutLogo = '../../../assets/img/sign-out-icn.svg';
    //   this.addIcon = '../../../assets/img/Add-icn.svg';
    //   return 'blueHeader';
    // }
    return 'blueHeader';
  }
}
