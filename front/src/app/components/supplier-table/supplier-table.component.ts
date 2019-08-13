import { AfterViewInit, EventEmitter, Component, OnInit, ViewChild, Input, Output, ChangeDetectorRef, TemplateRef, ViewChildren } from '@angular/core';
import { cloneDeep } from 'lodash';
import { DataTableDirective } from 'angular-datatables';
import { HttpService } from 'src/app/services/http.service';
// import {Configuration} from '../../../../config/environment.local';

import 'datatables.net';

@Component({
  selector: 'app-supplier-table',
  templateUrl: './supplier-table.component.html',
  styleUrls: ['./supplier-table.component.scss']
})
export class SupplierTableComponent implements OnInit {

  // supplierNmb = 7;
  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
  itemsToDisplay: Array<any> = [];
  data: Array<any> = [];
  @Output() infoModal = new EventEmitter<string>();
  items: Array<any> = [];
  dtElement: DataTableDirective;
  dataTable: any;
  tableParams: any = {
    start: 0,
    length: 9
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
      searching: true,
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
        const action = this.compareParams(dataTablesParameters);
        // that.tableParams = dataTablesParameters;
        // if()
        console.log('tableParams', dataTablesParameters);
        dataTablesParameters.company = 'Fakeclient';
        if(action === 'query') {
          that.httpService
            .get('/api/supplier', dataTablesParameters)
            .subscribe(resp => {
              console.log(resp);
              that.data = that.data.concat(resp.body['items']);
              that.itemsToDisplay = that.data.slice(that.tableParams.start, that.tableParams.start + that.tableParams.length);
  
              that.myTable = true;
              callback({
                recordsTotal: that.data.length,
                recordsFiltered: that.data.length,
                data: []
              });
            });
        } else if(action === 'redraw') {
          that.itemsToDisplay = that.data.slice(that.tableParams.start, that.tableParams.start + that.tableParams.length);
        }
      },
      preDrawCallback: function(settings) {
        that.tableParams.start = settings._iDisplayStart;
        that.tableParams.length = settings._iDisplayLength;
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
    if(!this.tableParams.start) {
      this.tableParams = cloneDeep(datatableParams);
      return 'query';
    }
    if(this.tableParams.start !== datatableParams.start && this.data.length <= datatableParams.start) {
      this.tableParams = cloneDeep(datatableParams);
      return 'query';
    } else if(this.tableParams.search !== datatableParams.search.value) {
      this.tableParams = cloneDeep(datatableParams);
      return 'query';
    } else if(this.tableParams.length !== datatableParams.length) {
      this.tableParams = cloneDeep(datatableParams);

      return 'query';
    }
    this.tableParams = cloneDeep(datatableParams);
    return 'redraw';
    // if(this.tableParams.order.col != datatableParams.order.col) {

    // }

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
    const data: any = {data: item, type: 'Supplier'};
    this.infoModal.emit(item);
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
