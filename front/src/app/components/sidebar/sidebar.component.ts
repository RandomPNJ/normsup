import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivationEnd, ActivationStart, NavigationStart, ResolveStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  user;
  showHeader;
  isLoggedIn: Subscription;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLogged.subscribe(res => {
      if(res !== false && res.data) {
        this.user = res.data;
      }
      this.showHeader = !!res;
    });
  }

}
