import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logout-page',
  templateUrl: './logout-page.component.html',
  styleUrls: ['./logout-page.component.scss']
})
export class LogoutPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      window.location.href = 'http://www.normsup.com';
    }, 3000)
  }

}
