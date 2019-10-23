import { Component, OnInit } from '@angular/core';
import { BrowserStorageService } from 'src/app/services/storageService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-flyover',
  templateUrl: './profile-flyover.component.html',
  styleUrls: ['./profile-flyover.component.scss']
})
export class ProfileFlyoverComponent implements OnInit {


  user = {
    name: 'Yassin',
    lastname: 'El Fahim',
    client: 1
  };

  profileIcon: String = '../../../assets/img/alarm.png';
  usersIcon: String = '../../../assets/img/alarm.png';
  reportingIcon: String = '../../../assets/img/alarm.png';
  contactIcon: String = '../../../assets/img/alarm.png';
  signOutLogo: String = '../../../assets/img/alarm.png';

  dropdownMenu: Boolean = false;

  constructor(private bsStorage: BrowserStorageService, private router: Router) { }

  ngOnInit() {
  }

  dropDown() {
    this.dropdownMenu = !this.dropdownMenu;
  }

  logOut() {
    this.bsStorage.clearLocalStorage();
    this.router.navigate(['/login']);
  }
}
