import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DaterangepickerConfig } from 'ng2-daterangepicker';
import { HttpService } from 'src/app/services/http.service';
import { find } from 'lodash'
import { debounceTime, distinctUntilChanged, map, tap, switchMap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
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

  searching: Boolean = false;
  searchFailed: Boolean = false;
  firstGroupLoad: Boolean = true;
  groups: any;
  documents: Array<any> = [
    { name: 'Choisir document', value: undefined, available: false },
    { name: 'KBIS', value: 'kbis', available: true},
    { name: 'LNTE', value: 'lnte', available: true},
    { name: 'URSSAF', value: 'urssaf', available: true},
  ];
  documentChosen: any;
  groupsChosen: Array<any> = [];
  suppliersChosen: Array<any> = [];
  documentsToRequest: Array<string> = [];

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.httpService.get('/api/supplier', new HttpParams().set('search', term)).pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    );

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
    if(this.documentChosen.value !== undefined) {
      console.log('this.documentChosen = ', this.documentChosen);
      this.documentsToRequest.push(this.documentChosen);
      this.documents.map(obj => {
        if(obj.value === this.documentChosen.value) {
          obj.available = false;
          // break;
        }
      });
      this.documentChosen = this.documents[0];
      console.log('this.documents', this.documents)
    }
    console.log('this.documentsToRequest = ', this.documentsToRequest);
  }

  closeDatePicker() {

  }

  selectGroup(checked) {
    if(checked === true && this.firstGroupLoad === true) {
      this.httpService
        .get('/api/supplier/groups')
        .subscribe(res => {
          this.groups = res.body['items'];
          this.firstGroupLoad = false;
          console.log('this.groups', this.groups)
        })
      ;
      this.exportType.supplier = false;
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

  choseSuppliers(value) {
    if(this.groupsChosen.length > 0) {
      this.groupsChosen = [];
    }

    if(find(this.suppliersChosen, o => { return o.name === value.name; }) === undefined) {
      this.suppliersChosen.push(value);
    }
  }

  selectedDate() {

  }

  clear() {

  }

}
