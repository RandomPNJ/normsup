import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ActivationEnd, ActivationStart, NavigationStart, ResolveStart } from '@angular/router';
import { BrowserStorageService } from 'src/app/services/storageService';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SettingsService } from 'src/app/services/settings.service';
import { HttpService } from 'src/app/services/http.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})

export class HeaderBarComponent implements OnInit {
  @Input() currentUser: any;
  
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
  profilePic: any;
  isLoggedIn: Subscription;
  profileSub: Subscription;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private bsService: BrowserStorageService,
    private authService: AuthService,
    private httpService: HttpService,
    private cookieService: CookieService,
    private settingsService: SettingsService) {
  }

  ngOnInit() {
    console.log('this.currentUser', this.currentUser);
    this.httpService.getPicture('/api/users/picture')
      .subscribe(res => {
        return this.createImageFromBlob(<Blob>res.body);
      }, err => {
        return err;
        // console.log('/api/users/picture err', err);
      })
    ;
    this.profileSub = this.settingsService.profileModif.subscribe(res => {
      if(res && res.name) {
        this.currentUser = res;
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
    return this.httpService
      .post('/api/auth/logout')
      .subscribe(() => {
        this.cookieService.deleteAll('/', 'localhost');
        this.bsService.clearLocalStorage();
        this.router.navigate(['logout']);
        // this.cookieService.delete('auth', '/', 'localhost');
      }, err => {
        console.log('Could not disconnect err :', err);
        this.cookieService.deleteAll('/');
        this.bsService.clearLocalStorage();
        // this.router.navigate(['logout']);
      })
    ;
  }

  getHeaderStyle() {
    return 'whiteHeader';
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
       this.profilePic = reader.result; // here is the result you got from reader
    }, false);
 
    if (image) {
       reader.readAsDataURL(image);
    }
 }
}
