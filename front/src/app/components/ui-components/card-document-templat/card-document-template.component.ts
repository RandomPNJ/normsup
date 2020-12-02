import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-ui-card-document-template',
  templateUrl: './card-document-template.component.html',
  styleUrls: ['./card-document-template.component.scss']
})
export class CardDocumentTemplateComponent implements OnInit {

  NB_DAYS_FOR_STATUS_EXPIRED_SOON = 30;

  @Input() withBorder = false;
  @Input() document;
  @Input() noBoxShadow = false;

  status;

  hover = false;

  @Output() clickViewBtnEvent = new EventEmitter();
  @Output() clickDropOffBtnEvent = new EventEmitter();

  onclickCardBtnEvent(document) {
    this.clickViewBtnEvent.emit(document);
  }

  getExpirationStatus(expirationDate) {
    if(expirationDate) {
      console.log('moment expirationDate :', moment(expirationDate));
      const nbDays = moment(expirationDate, 'YYYY-MM-DD HH:mm:ss').diff(moment(), 'days');
      console.log('nbDays :', nbDays);
      if(nbDays < 0) {
        return 'EXPIRED';
      } else if (nbDays <= this.NB_DAYS_FOR_STATUS_EXPIRED_SOON) {
        return 'EXPIRED_SOON';
      }
      return 'UP_TO_DATE';
    }
    return 'NOT_EXIST';
  }

  ngOnInit(): void {
    console.log('this.document.validityDate', this.document.validityDate);
    this.status = this.getExpirationStatus(this.document.validityDate);
  }

  onClickDropOffBtnEvent(document) {
    this.clickDropOffBtnEvent.emit(document);
  }

}
