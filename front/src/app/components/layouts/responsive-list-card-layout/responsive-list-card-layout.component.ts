import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-layout-reponsive-list-card',
  templateUrl: './responsive-list-card-layout.component.html',
  styleUrls: ['./responsive-list-card-layout.component.scss']
})
export class ResponsiveListCardLayoutComponent {

  @Input() withBorder = false;

}
