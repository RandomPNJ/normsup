import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DaterangepickerConfig } from 'ng2-daterangepicker';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  @ViewChild('daterangepicker1') startDatePicker: ElementRef;
  @ViewChild('daterangepicker2') endDatePicker: ElementRef;

  exportType: any = {
    group: false,
    supplier: false
  }

  groups: any;

  constructor(
    private dateRangeConf: DaterangepickerConfig,
  ) { 
    this.dateRangeConf.settings = {
      locale: { format: 'DD/MM/YYYY', cancelLabel: 'Annuler' },
      singleDatePicker: true,
      alwaysShowCalendars: false,
      opens: 'right',
      drops: 'down'
    };
  }

  ngOnInit() {
    this.groups = [
      { id: 1, denomination: 'Group one'},
      { id: 2, denomination: 'Group two'},
      { id: 3, denomination: 'Group three'},
      { id: 4, denomination: 'Group four'},
    ]
  }

  closeDatePicker() {

  }

  selectedDate() {

  }

  clear() {

  }

}
