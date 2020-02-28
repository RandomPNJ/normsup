import { Component } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { Chart } from 'chart.js';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationEnd, ActivatedRoute, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'normsup-app';


  sidebar: Number = 2;

  constructor(private router: Router) {
    this.router.events.subscribe((e) => {
        if (e instanceof NavigationEnd) {
            // Function you want to call here
            if(this.router && this.router.url) {
              if(this.router.url.startsWith('/upload')){
                this.sidebar = 1;
              }
            } else {
              this.sidebar = 0;
            }
        }
     });
     setTheme('bs3');
  }

}
