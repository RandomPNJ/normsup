import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';

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

  @ViewChild('inputElement') inputElement;

  onCheckboxEvent(event) {
    this.checkboxEvent.emit(event);
  }

  setCheckboxValue(value: boolean) {
    this.inputElement.nativeElement.checked = value;
  }

}
