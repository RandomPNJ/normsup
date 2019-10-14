import { Component } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'normsup-app';

  constructor() {
    setTheme('bs3');
  }
}
