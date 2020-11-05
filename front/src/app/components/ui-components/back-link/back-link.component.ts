import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-ui-back-link',
  templateUrl: './back-link.component.html',
  styleUrls: ['./back-link.component.scss']
})
export class BackLinkComponent {

  @Input() label: string;
  @Input() link: string;

}
