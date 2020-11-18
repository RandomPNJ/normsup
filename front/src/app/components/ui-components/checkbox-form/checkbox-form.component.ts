import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-ui-checkbox-form',
  templateUrl: './checkbox-form.component.html',
  styleUrls: ['./checkbox-form.component.scss']
})
export class CheckboxFormComponent {

  @Input() id: string;
  @Input() name: string;
  @Input() label;

  @Output() checkboxEvent = new EventEmitter();

  onCheckboxEvent(event) {
    this.checkboxEvent.emit(event);
  }

}
