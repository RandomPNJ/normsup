import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-ui-list-card',
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.scss']
})
export class ListCardComponent {

  @Input() cards = [];
  @Input() btnCardLabel;

  @Output() clickCardBtnEvent = new EventEmitter();

  onclickCardBtnEvent(card) {
    this.clickCardBtnEvent.emit(card);
  }

}
