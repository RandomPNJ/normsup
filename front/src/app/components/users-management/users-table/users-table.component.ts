import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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

  @Output() modifyUser = new EventEmitter<string>();
  loggedUser = {
    username: 'lob123',
    email: 'yass.elf@gmail.com',
    name: 'El Fahim',
    lastname: 'Yassin',
    role: 'Admin',
    id: '0',
    organisation: 'SpaceX',
    main_org: 'SpaceX',
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
        // if(action === 'query') {
          that.httpService
            .get('/api/users', dataTablesParameters)
            .subscribe(resp => {
              console.log(resp);
              that.items = that.items.concat(resp.body['items']);
              that.itemsToDisplay = that.items.slice(that.tableParams.start, that.tableParams.start + that.tableParams.length);

              that.myTable = true;
              callback({
                recordsTotal: that.items.length,
                recordsFiltered: that.items.length,
                data: []
              });
            });
        // } else if(action === 'redraw') {
        //   that.itemsToDisplay = that.items.slice(that.tableParams.start, that.tableParams.start + that.tableParams.length);
        // }
      },
      preDrawCallback: function(settings) {
        that.tableParams.start = settings._iDisplayStart;
        that.tableParams.length = settings._iDisplayLength;
      },
      columns: [
        null,
        {
          title: 'Email',
          data: 'email'
        },
        {
          title: 'Rôle',
          data: 'role'
        },
        null
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
