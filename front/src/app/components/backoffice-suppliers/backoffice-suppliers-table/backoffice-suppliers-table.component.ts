import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { HttpParams } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { cloneDeep } from 'lodash';
@Component({
  selector: 'app-backoffice-suppliers-table',
  templateUrl: './backoffice-suppliers-table.component.html',
  styleUrls: ['./backoffice-suppliers-table.component.scss']
})
export class BackofficeSuppliersTableComponent implements OnInit {
  
    @Output() modifyUser = new EventEmitter<string>();

    tableParams: any = {
      start: 0,
      length: 9
    };
    items = [
    ];
    myTable: Boolean = false;
    itemsToDisplay: Array<any> = [];
    dtOptions: DataTables.Settings = {};
    roles: Array<any> = [
      { name : ' ', value: ' '},
      { name: 'Administrateur', value: 'admin'},
      { name: 'Utilisateur', value: 'user'},
      { name: 'Invité', value: 'guest'},
    ];
    dataSize: any = 0;
  
    constructor(private httpService: HttpService) { }
  
    ngOnInit() {
      const that = this;
      this.dtOptions = {
        lengthMenu: [10, 25, 50, -1],
        searchDelay: 4500,
        ordering: false,
        searching: false,
        responsive: true,
        paging: false,
        info: false,
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
          console.log(' suppliers tableParams', dataTablesParameters);
          if(action === 'query') {
            that.httpService
              .get('/api/admin/suppliers/users', that.tableParams)
              .subscribe(resp => {
                that.items = that.items.concat(resp.body['items']);
                that.itemsToDisplay = that.items.slice(that.tableParams.start, that.tableParams.start + that.tableParams.length);
                that.dataSize = that.items.length;
  
                that.myTable = true;
                callback({
                  recordsTotal: that.items.length,
                  recordsFiltered: that.items.length,
                  data: []
                });
              }, err => {
                console.log('[BackofficeSuppliersTableComponent] /api/suppliers err', err);
              });
          }
        },
        preDrawCallback: function(settings) {
          that.tableParams.start = settings._iDisplayStart;
          that.tableParams.length = settings._iDisplayLength;
        },
        columns: [
          {
            title: 'Nom',
          },
          {
            title: 'Email',
          },
          {
            title: 'Client',
          },
          {
            title: 'Organisation',
          },
          {
            title: 'Action'
          }
        ]
      };
    }
  
    compareParams(datatableParams) {
      // TODO : Ordering with multiple columns
      if(!this.tableParams.start) {
        this.tableParams = cloneDeep(datatableParams);
        return 'query';
      }
      if(this.tableParams.start !== datatableParams.start && this.items.length <= datatableParams.start) {
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
    delete(item) {
  
    }
  
    edit(item) {
      if(item) {
        this.modifyUser.emit(item);
      }
    }
    assign(item) {
      console.log('Item = ', item);
    }
  }
  