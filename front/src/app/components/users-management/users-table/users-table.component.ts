import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { HttpParams } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit {

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
  @Output() modifyUser = new EventEmitter<string>();

  tableParams: any = {
    start: 0,
    length: 50
  };
  items = [
  ];
  reloadVar: Boolean = false;
  processing: Boolean = true;
  myTable: Boolean = false;
  itemsToDisplay: Array<any> = [];
  dtOptions: DataTables.Settings = {};
  roles: Array<any> = [
    { name: ' ', value: ' ' },
    { name: 'Administrateur', value: 'admin' },
    { name: 'Utilisateur', value: 'user' }
  ];
  dataSize: any = 0;

  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.httpService
      .get('/api/users/count')
      .subscribe(res => {
        this.dataSize = res.body['count'];
      })
    ;
    const that = this;
    this.dtOptions = {
      lengthMenu: [10, 25, 50, -1],
      searchDelay: 4500,
      ordering: false,
      searching: false,
      responsive: true,
      paging: true,
      info: false,
      // pageLength: 30,
      serverSide: true,
      processing: false,
      language: {
        lengthMenu: 'Voir _MENU_ résultats par page',
        zeroRecords: 'Aucun résultat trouvé',
        info: 'Page _PAGE_ sur _PAGES_',
        infoEmpty: 'Aucun résultat disponible',
        search: 'Rechercher:',
        infoFiltered: '(filtré sur un total de _MAX_ résultats)',
        paginate: {
          first: 'Premier',
          last: 'Dernier',
          next: 'Suivant',
          previous: 'Précedent'
        },
      },
      ajax: (dataTablesParameters: any, callback: any) => {
        that.processing = true;
        const action = this.compareParams(dataTablesParameters);
        console.log('action ===', action);
        if(action === 'query') {
          that.httpService
            .get('/api/users/management', this.tableParams)
            .subscribe(resp => {
              that.items = resp.body['items'];
              that.itemsToDisplay = that.items.slice(that.tableParams.start, that.tableParams.start + that.tableParams.length);
              // that.dataSize = that.items.length;
              that.reloadVar = false;
              that.myTable = true;
              that.processing = false;
              callback({
                recordsTotal: that.items.length,
                recordsFiltered: that.items.length,
                data: [],
                draw: 1,
              });
            }, err => {
              console.log('/api/users err', err);
            })
        } else if(action === 'length') {
          console.log('length');
          that.httpService
            .get('/api/users/management', this.tableParams)
            .subscribe(resp => {
              console.log('resp');
              if(resp.body['items'] && resp.body['items'].length > 0) {
                that.items = resp.body['items'];
                // that.dataSize = that.items.length;
                that.itemsToDisplay = that.items.slice(that.tableParams.start, that.tableParams.start + that.tableParams.length);
                that.myTable = true;
                that.processing = false;
                callback({
                  recordsTotal: that.items.length, // grand total avant filtre
                  recordsFiltered: that.items.length, // Nb d'onglet pagination
                  data: []
                });
                // this.suppliersData.emit(that.data.length);
              } else {
                that.items = [];
                that.itemsToDisplay = [];
                that.items.length = 0;
                that.myTable = true;
                that.processing = false;
                callback({
                  recordsTotal: 0, // grand total avant filtre
                  recordsFiltered: 0, // Nb d'onglet pagination
                  data: [],
                  draw: 1,
                });
              } 
            });
        } else if(action === 'redraw') {
          console.log('two');
          that.itemsToDisplay = that.items.slice(that.tableParams.start, that.tableParams.start + that.tableParams.length);
          that.processing = false;
          callback({
            recordsTotal: that.items.length, // grand total avant filtre
            recordsFiltered: that.items.length, // Nb d'onglet pagination
            data: [],
            draw: 1,
          });
        }
        
      },
      columns: [
        {
          title: 'Nom',
        },
        {
          title: 'Email',
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
    let action = 'none';
    if(this.tableParams.start !== datatableParams.start) {
      this.tableParams.start = datatableParams.start;
      if(this.items.length <= datatableParams.start) {
        action = 'query';
      } else {
        action = 'redraw';
      }
    }
    if(this.tableParams.search !== datatableParams.search.value) {
      this.items.length = 0;
      this.tableParams.search = datatableParams.search.value;
      action = 'query';
    }
    if(this.tableParams.length !== datatableParams.length) {
      this.tableParams.length = datatableParams.length;
      this.tableParams.start = 0;
      action = 'length';
    }
    console.log('compareParams : ', this.tableParams);
    return action;

  }

  reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      this.httpService
        .get('/api/users/management', this.tableParams)
        .subscribe(resp => {
          console.log(resp);
          if(resp.body && resp.body['items'] && resp.body['items'].length > 0) {
            this.items = resp.body['items'];
            this.itemsToDisplay = this.items.slice(this.tableParams.start, this.tableParams.start + this.tableParams.length);
          } else {
            this.items = [];
            this.itemsToDisplay = [];
            this.items.length = 0;
          }
          
        });
      this.httpService
        .get('/api/users/count')
        .subscribe(res => {
          this.dataSize = res.body['count'];
        })
      ;
      dtInstance.page('last');
      dtInstance.ajax.reload();
    });
  }

  delete(item) {

  }

  edit(item) {
    if (item) {
      this.modifyUser.emit(item);
    }
  }
  assign(item) {
    console.log('Item = ', item);
  }

  changeRole(val, item) {
    console.log('changeRole item', item);
    console.log('changeRole val', val);
    this.httpService.put('/api/users/modify/'+item.id+'/role', {rolename: val})
      .subscribe(res => {
        console.log('res', res);
      }, err => {
        console.log('Err', err);
      })
    ;
  }

  deleteSupplier(id, i) {

    return this.httpService.post('/api/users/delete/' + id)
      .subscribe(res => {
        console.log('res', res);
        if(res && res.body && res.body['statusCode'] && res.body['statusCode'] === 200) {
          this.items.splice(i, 1);
        }
      }, err => {
        console.log('Err', err);
      })
    ;
  }
}
