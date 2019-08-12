import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-legal-doc-modal',
  templateUrl: './legal-doc-modal.component.html',
  styleUrls: ['./legal-doc-modal.component.scss']
})
export class LegalDocModalComponent implements OnInit {

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
  itemsToDisplay: Array<any> = [];
  data: Array<any> = [];
  dtElement: DataTableDirective;
  dataTable: any;
  tableParams: any = {
    start: 0,
    length: 9
  };
  dtOptions: DataTables.Settings = {};
  myTable: Boolean = false;

  itemPluralMapping = {
    'documents': {
      '=0': 'n\'avez aucun document',
      '=1': 'un document',
      'other': '# documents'
    }
  };

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
      searchDelay: 4500,
      ordering: false,
      searching: false,
      responsive: true,
      pageLength: 100,
      info: false,
      lengthChange: false,
      serverSide: false,
      processing: false,
      paging: false,
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
        console.log('tableParams', dataTablesParameters);
        dataTablesParameters.company = 'Fakeclient';
        // if(action === 'query') {
          that.httpService
            .get('http://localhost:8091/api/documents', dataTablesParameters)
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
        // } else if(action === 'redraw') {
        //   that.itemsToDisplay = that.data.slice(that.tableParams.start, that.tableParams.start + that.tableParams.length);
        // }
      },
      preDrawCallback: function(settings) {
        that.tableParams.start = settings._iDisplayStart;
        that.tableParams.length = settings._iDisplayLength;
      },
      columns: [
        {
          title: 'Fichiers',
          data: 'filename',
          searchable: true
        },
        {
          title: 'Statut',
          data: 'status',
          searchable: true
        },
        {
          title: 'Date de validité',
          data: 'expirationdate',
          searchable: true
        },
      ]
    };
  }

}
