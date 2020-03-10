import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DaterangepickerConfig } from 'ng2-daterangepicker';
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

  @ViewChild('daterangepicker1') startDatePicker: ElementRef;
  @ViewChild('daterangepicker2') endDatePicker: ElementRef;

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
        this.httpService.get('/api/supplier', new HttpParams().set('search', term)).pipe(
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
    this.dateRangeConf.settings = {
      locale: { format: 'DD/MM/YYYY', cancelLabel: 'Annuler' },
      singleDatePicker: true,
      alwaysShowCalendars: false,
      opens: 'right',
      drops: 'down'
    };
  }

  ngOnInit() {

    // Load groups
  }

  addDocumentType() {
    console.log('this', this.documentChosen);
    if(this.documentChosen !== undefined && this.documentChosen.value !== undefined) {
      console.log('this.documentChosen = ', this.documentChosen);
      this.documentsToRequest.push(this.documentChosen.value);
      this.documents.map(obj => {
        if(obj.value === this.documentChosen.value) {
          obj.available = false;
          // break;
        }
      });
      this.documentChosen = this.documents[0];
    }
  }


  selectGroup(checked) {
    if(checked === true) {
      this.exportType.supplier = false;
    }
    if(this.firstGroupLoad === true) {
      this.httpService
        .get('/api/supplier/groups')
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
    if(type === 'start') {
      if(!this.dateRange.endDate) {
        this.dateRange.startDate = moment(e.start).format('DD-MM-YYYY');
        this.showWrongDateOne = false;
      } else if(this.dateRange.endDate && moment(e.start).isBefore(moment(this.dateRange.endDate, 'DD-MM-YYYY'))) {
        this.dateRange.startDate = moment(e.start).format('DD-MM-YYYY');
        this.showWrongDateOne = false;
      } else {
        this.showWrongDateOne = true;
      }
    }
    if(type === 'end') {
      if(!this.dateRange.startDate) {
        this.dateRange.endDate = moment(e.start).format('DD-MM-YYYY');
        this.showWrongDateTwo = false;
      } else if(this.dateRange.startDate && moment(e.start).isAfter(moment(this.dateRange.startDate, 'DD-MM-YYYY'))) {
        this.dateRange.endDate = moment(e.start).format('DD-MM-YYYY');
        this.showWrongDateTwo = false;
      } else {
        this.showWrongDateTwo = true;
      }
      this.dateRange.endDate = moment(e.start).format('DD-MM-YYYY');
    }

    console.log('Daterange', this.dateRange);
  }

  closeDatePicker(e, type) {
    if(type === 'start' && !this.dateRange.startDate) {
      this.dateRange.startDate = moment(e.start).format('DD-MM-YYYY');
    }
    if(type === 'end' && !this.dateRange.endDate) {
      this.dateRange.endDate = moment(e.start).format('DD-MM-YYYY');
    }
  }

  removeGroup(group) {
    remove(this.groupsChosen, group);
  }

  removeSupplier(supplier) {
    remove(this.suppliersChosen, supplier);
  }

  clear() {

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
