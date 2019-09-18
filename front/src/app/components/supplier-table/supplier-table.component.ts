import { AfterViewInit, EventEmitter, Component, OnInit, ViewChild, Input, Output, ChangeDetectorRef,
        TemplateRef, ViewChildren } from '@angular/core';
import { cloneDeep } from 'lodash';
import { DataTableDirective } from 'angular-datatables';
import { HttpService } from 'src/app/services/http.service';
// import {Configuration} from '../../../../config/environment.local';

import 'datatables.net';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-supplier-table',
  templateUrl: './supplier-table.component.html',
  styleUrls: ['./supplier-table.component.scss']
})
export class SupplierTableComponent implements OnInit {

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
  itemsToDisplay: Array<any> = [];
  data: Array<any> = [];
  @Output() infoModal = new EventEmitter<string>();
  items: Array<any> = [];
  dtElement: DataTableDirective;
  dataTable: any;
  nbOfRows: any;
  firstDraw: Boolean = true;
  tableParams: any = {
    start: 0,
    length: 10,
    search: '',
  };
  dtOptions: DataTables.Settings = {};
  groupSelect: String;
  myTable: Boolean = false;

  constructor(private httpService: HttpService, private chRef: ChangeDetectorRef) { }

  ngOnInit() {
    // First query to get the number of rows
    let firstQParams = new HttpParams();
    firstQParams = firstQParams.set('client', 'Fakeclient');
    this.httpService
      .get('/api/supplier/count', firstQParams)
      .subscribe(res => {
        this.nbOfRows = res.body['count'];
      })
    ;
    const that = this;
    $.fn['dataTable'].ext.search.push((settings, itemsToDisplay, dataIndex) => {
      const groupName = itemsToDisplay[1] || ''; // use data for the id column
      if(!this.groupSelect) {
        this.groupSelect = '';
      }
      if (this.groupSelect === groupName || this.groupSelect === '') {
        // console.log('data === ' + itemsToDisplay[0] + ' group ==== ' + itemsToDisplay[1]);
        return true;
      }
      return false;
    });
    this.dtOptions = {
      lengthMenu: [[10, 25, 50, -1], [10, 25, 50, 'Tout afficher']],
      searchDelay: 4500,
      ordering: false,
      searching: true,
      responsive: true,
      serverSide: true,
      // processing: true,
      language: {
          lengthMenu: 'Voir _MENU_ résultats par page',
          zeroRecords: 'Aucun résultat trouvé',
          info: 'Page _PAGE_ sur _PAGES_',
          infoEmpty: 'Aucun résultat disponible',
          search: 'Rechercher:',
          infoFiltered: '(filtré sur un total de _MAX_ résultats)',
          paginate: {
              first:      'Premier',
              last:       'Dernier',
              next:       'Suivant',
              previous:   'Précédent'
          },
      },
      ajax: (dataTablesParameters: any, callback: any) => {
        const action = this.compareParams(dataTablesParameters);
        // that.tableParams = dataTablesParameters;
        // if()
        console.log('tableParams', this.tableParams);
        this.tableParams.company = 'Fakeclient';
        if(action === 'query') {
          that.httpService
            .get('/api/supplier', this.tableParams)
            .subscribe(resp => {
              // console.log(resp);
              that.data = that.data.concat(resp.body['items']);
              that.itemsToDisplay = that.data.slice(that.tableParams.start, that.tableParams.start + that.tableParams.length);
              // console.log('length =', that.data);
              that.myTable = true;
              callback({
                recordsTotal: that.nbOfRows, // grand total avant filtre
                recordsFiltered: that.nbOfRows, // Nb d'onglet pagination
                data: []
              });
            });
        } else if(action === 'redraw') {
          that.itemsToDisplay = that.data.slice(that.tableParams.start, that.tableParams.start + that.tableParams.length);
          callback({
            recordsTotal: that.nbOfRows, // grand total avant filtre
            recordsFiltered: that.nbOfRows, // Nb d'onglet pagination
            data: []
          });
        }
      },
      preDrawCallback: function(settings) {
      },
      columns: [
        {
          title: 'Name',
          data: 'denomination',
          searchable: true
        },
        {
          title: 'Group',
          data: 'groupName',
          searchable: true
        },
        null,
        null,
        null,
        null
      ]
    };
  }

  ngAfterViewInit(): void {
    // this.dtElement.dtInstance.then((dtInstance: any) => {
    //   dtInstance.columns.adjust()
    //      .responsive.recalc();
    // });

  }

  compareParams(datatableParams) {
    // TODO : Ordering with multiple columns
    let action = 'none';

    if(this.firstDraw) {
      action = 'query';
      this.firstDraw = false;
      return action;
    }
    if(this.tableParams.start !== datatableParams.start) {
      this.tableParams.start = datatableParams.start;
      if(this.data.length <= datatableParams.start) {
        action = 'query';
      } else {
        action = 'redraw';
      }
    }
    if(this.tableParams.search !== datatableParams.search.value) {
      this.data.length = 0;
      this.tableParams.search = datatableParams.search.value;
      this.recount(this.tableParams.search);
      action = 'query';
    }
    if(this.tableParams.length !== datatableParams.length) {
      this.tableParams.length = datatableParams.length;
      action = 'query';
    }
    return action;

  }

  recount(search?: string) {
    const that = this;
    let firstQParams = new HttpParams();
    firstQParams = firstQParams.set('client', 'Fakeclient');
    if(search) {
      firstQParams = firstQParams.set('search', search);
    }
    return this.httpService
      .get('/api/supplier/count', firstQParams)
      .subscribe(res => {
        that.nbOfRows = res.body['count'];
      })
    ;
  }
  filterByGroup(): void {
    // console.log(this.dtElement);
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }
  edit(item) {
  }

  delete(item) {
    console.log(item);
  }

  // reload(dataInput?: any) {
  //   this.myTable = true;
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     // Destroy the table first
  //     dtInstance.destroy();
  //     // Call the dtTrigger to rerender again
  //     this.dtTrigger.next();
  //   });
  // }

  openSupplierInfo(item) {
    const data: any = {data: item, type: 'Supplier'};
    this.infoModal.emit(data);
  }

  openLegalDocModal(item) {
    if(item) {
      const data: any = {data: item, type: 'Legaldoc'};
      this.infoModal.emit(data);
    } else {
      return;
    }
  }

  openCompDocModal(item) {
    if(item) {
      // console.log(item);
      const data: any = {data: item, type: 'Compdoc'};
      this.infoModal.emit(data);
    } else {
      return;
    }
  }
}
