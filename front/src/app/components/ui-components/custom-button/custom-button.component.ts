import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-ui-custom-button',
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.scss']
})
export class CustomButtonComponent implements OnInit {

  @Input() label = '';
  @Input() size = 'medium';
  @Input() textColor = 'blue';
  @Input() borderColor = 'blue';
  @Input() buttonColor = 'white';

  @Output() clickEvent = new EventEmitter();

  customClasses = '';

  ngOnInit() {
    const sizeClass = this.initSizeClass();
    const btnColorClass = this.initButtonColorClass();
    const textColorClass = this.initTextColorClass();
    const borderColorClass = this.initBorderColorClass();
    this.customClasses = [sizeClass, btnColorClass, textColorClass, borderColorClass].join(' ');
  }

  initSizeClass() {
    if ('small' === this.size) {
      return 'size-small';
    } else if ('large' === this.size) {
      return 'size-large';
    } else {
      return 'size-medium';
    }
  }

  onBtnClickEvent() {
    this.clickEvent.emit();
  }

  private initButtonColorClass() {
    if ('white' === this.buttonColor) {
      return 'btn-color-white';
    }
    return 'btn-color-white';
  }

  private initTextColorClass() {
    if ('blue' === this.buttonColor) {
      return 'text-color-blue';
    }
    return 'text-color-blue';
  }

  private initBorderColorClass() {
    if ('blue' === this.buttonColor) {
      return 'border-color-blue';
    }
    return 'border-color-blue';
  }


}
