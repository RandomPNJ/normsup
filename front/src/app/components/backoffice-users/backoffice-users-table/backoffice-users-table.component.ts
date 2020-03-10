import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { HttpParams } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-backoffice-users-table',
  templateUrl: './backoffice-users-table.component.html',
  styleUrls: ['./backoffice-users-table.component.scss']
})
export class BackofficeUsersTableComponent implements OnInit {
  
    @Output() modifyUser = new EventEmitter<string>();
    loggedUser = {
      username: 'lob123',
      email: 'yass.elf@gmail.com',
      name: 'El Fahim',
      lastname: 'Yassin',
      role: 'Admin',
      id: '0',
      organisation: 1,
      client: 1,
      createdBy: 'GOD'
    };
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
      { name: 'Admin', value: 'admin'},
      { name: 'Utilisateur', value: 'user'},
      { name: 'Invité', value: 'guest'},
    ];
    dataSize: any = 0;
  
    constructor(private httpService: HttpService) { }
  
    ngOnInit() {
      const that = this;
      // $.fn['dataTable'].ext.search.push((settings, itemsToDisplay, dataIndex) => {
      //   const groupName = itemsToDisplay[1] || ''; // use data for the id column
      //   if(!this.groupSelect) {
      //     this.groupSelect = '';
      //   }
      //   if (this.groupSelect === groupName || this.groupSelect === '') {
      //     // console.log('data === ' + itemsToDisplay[0] + ' group ==== ' + itemsToDisplay[1]);
      //     return true;
      //   }
      //   return false;
      // });
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
          console.log('tableParams', dataTablesParameters);
            that.httpService
              .get('/api/admin/users', dataTablesParameters)
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
                console.log('/api/users err', err);
              });
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
            title: 'Organisation',
          },
          {
            title: 'Rôle',
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
  