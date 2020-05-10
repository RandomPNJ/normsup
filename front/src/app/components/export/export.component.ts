import { Component, OnInit, ViewChild, ElementRef, ViewChildren } from '@angular/core';
import { DaterangepickerConfig, DaterangePickerComponent } from 'ng2-daterangepicker';
import { HttpService } from 'src/app/services/http.service';
import { find, filter, remove } from 'lodash';
import { debounceTime, distinctUntilChanged, map, tap, switchMap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})

export class ExportComponent implements OnInit {

  @ViewChildren('daterangepicker1') startDatePicker: DaterangePickerComponent;
  @ViewChildren('daterangepicker2') endDatePicker: DaterangePickerComponent;
  

  exportType: any = {
    group: false,
    supplier: false
  };

  dateRange: any = {
    startDate: null,
    endDate: null
  };

  showWrongDateOne: Boolean = false;
  showWrongDateTwo: Boolean = false;

  settingsDP1 = {
    locale: { format: 'DD-MM-YYYY', cancelLabel: 'Annuler' },
    singleDatePicker: true,
    alwaysShowCalendars: false,
    opens: 'right',
    drops: 'down',
    autoUpdateInput: false,
    autoApply: true
  };

  settingsDP2 = {
    locale: { format: 'DD-MM-YYYY', cancelLabel: 'Annuler' },
    singleDatePicker: true,
    alwaysShowCalendars: false,
    opens: 'right',
    drops: 'down',
    autoUpdateInput: false,
    autoApply: true
  };

  supplierSelected: any;
  searching: Boolean = false;
  searchFailed: Boolean = false;
  firstGroupLoad: Boolean = true;
  groups: any;
  documents: Array<any> = [
    // { name: 'Choisir document', value: undefined, available: false },
    { name: 'KBIS', value: 'kbis', available: true},
    { name: 'LNTE', value: 'lnte', available: true},
    { name: 'URSSAF', value: 'urssaf', available: true},
  ];
  documentChosen: any;
  groupChosen: any;
  groupsChosen: Array<any> = [];
  suppliersChosen: Array<any> = [];
  documentsToRequest: Array<string> = [];

  searchSupplier = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.httpService.get('/api/suppliers', new HttpParams().set('search', term)).pipe(
          tap(() => this.searchFailed = false),
          map(response => response.body['items']),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    );


  formatter = (x: any) => x.denomination;
  formatter2 = (x: any) => x.denomination;

  constructor(
    private dateRangeConf: DaterangepickerConfig,
    private httpService: HttpService
  ) {
  }

  ngOnInit() {

    // Load groups
  }

  addDocumentType() {
    if(this.documentChosen !== undefined && this.documentChosen.value !== undefined) {
      console.log('this.documentChosen = ', this.documentChosen);
      this.documentsToRequest.push(this.documentChosen.value);
      this.documents.map(obj => {
        if(obj.value === this.documentChosen.value) {
          obj.available = false;
          // break;
        }
      });
      this.documentChosen = '';
    }
  }


  selectGroup(checked) {
    if(checked === true) {
      this.exportType.supplier = false;
    }
    if(this.firstGroupLoad === true) {
      this.httpService
        .get('/api/suppliers/groups')
        .subscribe(res => {
          this.groups = res.body['items'];
          this.firstGroupLoad = false;
        })
      ;
    }
  }

  selectSupplier(checked) {
    if(checked === true) {
      this.exportType.group = false;
    }
  }

  choseGroup(value) {
    if(this.suppliersChosen.length > 0) {
      this.suppliersChosen = [];
    }

    if(find(this.groupsChosen, o => { return o.name === value.name; }) === undefined) {
      this.groupsChosen.push(value);
    }
  }

  choseSupplier(rt) {
    if(typeof this.supplierSelected === 'string') {
      return;
    }
    if(this.groupsChosen.length > 0) {
      this.groupsChosen = [];
    }

    if(find(this.suppliersChosen, o => { return o.name === this.supplierSelected.name; }) === undefined) {
      this.suppliersChosen.push(this.supplierSelected);
    }
    this.supplierSelected = {};
  }

  selectedDate(e, type) {
    // console.log('[selectedDate] event', e);
    // console.log('[selectedDate] type', type);
    console.log('endDatePicker', this.endDatePicker.datePicker);
    if(type === 'start') {
      if(!this.dateRange.endDate) {
        console.log('[selectedDate] here one');
        this.dateRange.startDate = moment(e.start).format('DD-MM-YYYY');
        this.showWrongDateOne = false;
      } else if(this.dateRange.endDate && moment(e.start).isSameOrBefore(moment(this.dateRange.endDate, 'DD-MM-YYYY'))) {
        console.log('[selectedDate] here two');
        this.dateRange.startDate = moment(e.start).format('DD-MM-YYYY');
        this.showWrongDateOne = false;
      } else {
        console.log('[selectedDate] here three');
        let v = moment(this.dateRange.endDate, 'DD-MM-YYYY').format('DD-MM-YYYY');
        this.dateRange.startDate = v;
        this.settingsDP1['startDate'] = v;
        this.showWrongDateOne = true;
      }
    }
    if(type === 'end') {
      if(!this.dateRange.startDate) {
        console.log('[selectedDate] here four');
        this.dateRange.endDate = moment(e.start).format('DD-MM-YYYY');
        this.showWrongDateTwo = false;
      } else if(this.dateRange.startDate && moment(e.start).isSameOrAfter(moment(this.dateRange.startDate, 'DD-MM-YYYY'))) {
        console.log('[selectedDate] here five');
        this.dateRange.endDate = moment(e.start).format('DD-MM-YYYY');
        this.showWrongDateTwo = false;
      } else {
        console.log('[selectedDate] here six');
        let v = moment(this.dateRange.startDate, 'DD-MM-YYYY').format('DD-MM-YYYY');
        this.dateRange.endDate = v;
        this.settingsDP1['startDate'] = v;
        this.showWrongDateTwo = true;
      }
    }

    console.log('Daterange', this.dateRange);
  }

  closeDatePicker(e, type) {
    if(type === 'start' && !this.dateRange.startDate) {
      console.log('close one');
      this.dateRange.startDate = moment(e.start).format('DD-MM-YYYY');
    }
    if(type === 'end' && !this.dateRange.endDate) {
      this.dateRange.endDate = moment(e.start).format('DD-MM-YYYY');
    }
  }

  calendarApplied(e) {
    console.log('calendarApplied', e);
  }

  removeGroup(group) {
    remove(this.groupsChosen, group);
  }

  removeSupplier(supplier) {
    remove(this.suppliersChosen, supplier);
  }

  removeDoc(doc) {
    remove(this.documentsToRequest, (v) => {
      console.log('v', v);
      return v === doc;
    });
    this.documents.forEach(d => {
      if(d.value === doc) {
        console.log('if ', d);
        d.available = true;
      }
    })
  }

  clear() {
    console.log('dateRange', this.dateRange);
  }

  export() {
    let length;
    const endRes = {
      startDate: this.dateRange.startDate,
      endDate: this.dateRange.endDate,
      type: '',
      values: '',
      docs: ''
    };

    if(this.documentsToRequest.length > 0) {
      endRes.docs = this.documentsToRequest.join(',');
    }

    if(this.exportType.group === true) {
      endRes.type = 'GROUP';
      length = this.groupsChosen.length;
      this.groupsChosen.forEach((res, i) => {
        if(i !== (length - 1)) {
          endRes.values += res.id + ','
        } else {
          endRes.values += res.id
        }
      });
    } else if(this.exportType.supplier === true) {
      endRes.type = 'SUPPLIER';
      length = this.suppliersChosen.length;
      this.suppliersChosen.forEach((res, i) => {
        if(i !== (length - 1)) {
          endRes.values += res.id + ','
        } else {
          endRes.values += res.id
        }
      });
    } else {
      // Todo: Gérer ce cas de figure
      return 'ERROR'
    }

    console.log('endRes', endRes)
    // this.httpService.get('/api/documents/export', endRes)

  }

}
