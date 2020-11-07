import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-ui-card-template',
  templateUrl: './card-template.component.html',
  styleUrls: ['./card-template.component.scss']
})
export class CardTemplateComponent {

  @Input() headerTitle: string;
  @Input() templateBody;

}
