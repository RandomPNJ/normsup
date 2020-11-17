import { Component, OnInit, Output, EventEmitter, ViewChildren } from '@angular/core';
import { DaterangepickerConfig, DaterangePickerComponent } from 'ng2-daterangepicker';
import { HttpService } from 'src/app/services/http.service';
import { HttpParams } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-backoffice-document-table',
  templateUrl: './backoffice-document-table.component.html',
  styleUrls: ['./backoffice-document-table.component.scss']
})
export class BackofficeDocumentTableComponent implements OnInit {

  @ViewChildren('daterangepicker1') startDatePicker: DaterangePickerComponent;
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
    firstDraw: Boolean = true;
    settingsDP1 = {
      locale: { format: 'DD-MM-YYYY', cancelLabel: 'Annuler' },
      singleDatePicker: true,
      alwaysShowCalendars: false,
      opens: 'right',
      drops: 'up',
      autoUpdateInput: false,
      autoApply: true
    };

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
              .get('/api/admin/documents', that.tableParams)
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
                console.log('[BackofficeClientTableComponent] /api/admin/clients err', err);
              });
          } else if(action === 'redraw') {
            that.itemsToDisplay = that.items.slice(that.tableParams.start, that.tableParams.start + that.tableParams.length);
            callback({
              recordsTotal: that.items.length, // grand total avant filtre
              recordsFiltered: that.items.length, // Nb d'onglet pagination
              data: []
            });
          }
        },
        columns: [
          {
            title: 'Dénomination',
          },
          {
            title: 'Date de création',
          },
          {
            title: 'Date de péremption',
          },
          {
            title: 'Consulter',
          },
          {
            title: 'Action',
          }
        ]
      };
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
        if(this.items.length <= datatableParams.start) {
          action = 'query';
        } else {
          action = 'redraw';
        }
      }

      if(this.tableParams.search !== datatableParams.search.value) {
        // this.data.length = 0;
        this.tableParams.search = datatableParams.search.value;
        // this.recount(this.tableParams.search);
        action = 'query';
      }
      if(this.tableParams.length !== datatableParams.length) {
        this.tableParams.length = datatableParams.length;
        action = 'redraw';
      }
      return action;
  
    }

    selectedDate(e, index) {
      console.log('selectedDate e', e.start.toDate());
      console.log('selectedDate index', index);
      this.items[this.tableParams.start + index].validityDate = e.start.format('DD-MM-YYYYTHH:mm:ss.SSS');
      this.itemsToDisplay[index].validityDate = e.start.format('DD-MM-YYYYTHH:mm:ss.SSS');
      console.log('this.itemsToDisplay :', this.itemsToDisplay);
      // console.log('selectedDate e', e);
    }
  
    closeDatePicker(e) {
      
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
