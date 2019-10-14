import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-flyover',
  templateUrl: './profile-flyover.component.html',
  styleUrls: ['./profile-flyover.component.scss']
})
export class ProfileFlyoverComponent implements OnInit {


  user = {
    name: 'Yassin',
    lastname: 'El Fahim',
    mainOrg: 'SpaceX'
  };

  profileIcon: String = '../../../assets/img/alarm.png';
  usersIcon: String = '../../../assets/img/alarm.png';
  reportingIcon: String = '../../../assets/img/alarm.png';
  contactIcon: String = '../../../assets/img/alarm.png';
  signOutLogo: String = '../../../assets/img/alarm.png';

  dropdownMenu: Boolean = false;

  constructor() { }

  ngOnInit() {
  }

  dropDown() {
    this.dropdownMenu = !this.dropdownMenu;
  }

}
