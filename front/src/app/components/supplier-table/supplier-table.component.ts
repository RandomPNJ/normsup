import { AfterViewInit, EventEmitter, Component, OnInit, ViewChild, Input, Output, ChangeDetectorRef, ViewChildren } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { HttpService } from 'src/app/services/http.service';

import * as $ from 'jquery';
import 'datatables.net';

@Component({
  selector: 'app-supplier-table',
  templateUrl: './supplier-table.component.html',
  styleUrls: ['./supplier-table.component.scss']
})
export class SupplierTableComponent implements OnInit, AfterViewInit {

  // supplierNmb = 7;
  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
  itemsToDisplay: Array<any> = [];
  data: Array<any>;
  @Output() suppInfo = new EventEmitter<string>();
  items: Array<any> = [];
  dtElement: DataTableDirective;
  dataTable: any;
  tableParams =  {
    order: {col: 0, dir: 'asc'},
    length: 9,
    start: 0
  };
  dtOptions: DataTables.Settings = {};
  groupSelect: String;
  myTable: Boolean = false;

  constructor(private httpService: HttpService, private chRef: ChangeDetectorRef) { }

  ngOnInit() {
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
      lengthMenu: [10, 25, 50, -1],
      searchDelay: 4500,
      ordering: false,
      searching: false,
      responsive: true,
      // pageLength: 10,
      serverSide: true,
      processing: true,
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
              previous:   'Précedent'
          },
      },
      ajax: (dataTablesParameters: any, callback: any) => {
        this.compareParams(dataTablesParameters);
        // that.tableParams = dataTablesParameters;
        // if()
        console.log('tableParams', that.tableParams);
        that.httpService
          .get('http://localhost:8091/api/supplier', dataTablesParameters)
          .subscribe(resp => {
            that.data = resp.body['items'];
            // that.itemsToDisplay = that.itemsToDisplay.concat(that.data);
            that.itemsToDisplay = that.data.slice(that.tableParams.start, that.tableParams.start + that.tableParams.length);

            that.myTable = true;
            callback({
              recordsTotal: that.data.length,
              recordsFiltered: that.data.length,
              data: []
            });
          });
      },
      preDrawCallback: function(settings) {
        that.tableParams.start = settings._iDisplayStart;
        that.tableParams.length = settings._iDisplayLength;
      },
      // drawCallback: function() {

      // },
      // columnDefs: [
      //   {
      //     targets: 0,
      //     data: 'denom',
      //     render: function(data, type, row, meta) {
      //       return '<div class="content-cont"><span>' + data + '</span></div>';
      //     }
      //   },
      //   {
      //     targets: 1,
      //     data: 'groupName',
      //     render: function(data, type, row, meta) {
      //       return '<div class="content-cont"><span>' + data + '</span></div>';
      //     }
      //   },
      //   {
      //     targets: 2,
      //     data: 'siret',
      //     render: function(data, type, row, meta) {
      //       return '<div class="content-cont"><span>' + data + '</span></div>';
      //     }
      //   },
      //   {
      //     targets: 3,
      //     data: null,
      //     render: function(data, type, row, meta) {
      //       return '<div class="content-cont"> <div> <span [ngClass]="'+ data.country +'!= \'\' ? \'flag-icon-\' +'+ data.country +': \'\'" class="flag-icon flag-icon-squared"></span> <span class="localisation">' + data.loc + '</span> </div> </div>';
      //     }
      //   },
      //   {
      //     targets: 4,
      //     data: null,
      //     render: function(data, type, row, meta) {
      //       return '<div class="badge-container content-cont container"> <div class="row" style="margin-bottom: 0px;"> <div style="padding-right: 5px;" class="doc-cont col-6"> <i style="display: block;" [ngClass]="{\'invalid-doc\': !'+data.urssaf+'}" class="fas fa-file-alt doc-icn"></i> <span [ngClass]="{\'badge-red\': !'+data.urssaf+'}" class="badge badge-style fix-middle">Légal</span> </div><div class="doc-cont col-6"> <i style="display: block;" [ngClass]="{\'invalid-doc\': !'+data.kbis+'}" class="fas fa-file-alt doc-icn"></i> <span [ngClass]="{\'badge-red\': !'+data.kbis+'}" class="badge badge-style fix-middle">Complémentaire</span> </div> </div> </div>';
      //     }
      //   },
      //   {
      //     targets: 5,
      //     data: null,
      //     render: function(data, type, row, meta) {
      //       return '<div id="util-btns" class="badge-container content-cont"> <span (click)="delete(item)" class="glyphicon glyphicon-trash fix-middle" aria-hidden="true"></span> </div>';
      //     }
      //   }
      // ],
      columns: [
        {
          title: 'Name',
          data: 'denom',
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
    this.tableParams = datatableParams;
  }
  filterByGroup(): void {
    console.log(this.dtElement);
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }
  edit(item) {
    console.log(item);
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
    this.suppInfo.emit(item);
  }

}
