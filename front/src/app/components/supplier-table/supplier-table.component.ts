import { AfterViewInit, EventEmitter, Component, OnInit, ViewChild, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-supplier-table',
  templateUrl: './supplier-table.component.html',
  styleUrls: ['./supplier-table.component.scss']
})
export class SupplierTableComponent implements OnInit, AfterViewInit {

  // supplierNmb = 7;
  @ViewChild(DataTableDirective, {read: false})
  @Input() itemsToDisplay: Array<any>;
  @Output() suppInfo = new EventEmitter<string>();
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  groupSelect: String;

  constructor() { }

  ngOnInit() {
    // const that = this;
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
      stateSave: false,
      // lengthMenu: [10, 25, 50, -1],
      // serverSide: true,
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
              previous:   'Précedent'
          },
      },
      // ajax: (dataTablesParameters: any, callback) => {
      //   that.http
      //     .post<DataTablesResponse>(
      //       'https://angular-datatables-demo-server.herokuapp.com/',
      //       dataTablesParameters, {}
      //     ).subscribe(resp => {
      //       that.persons = resp.data;

      //       callback({
      //         recordsTotal: resp.recordsTotal,
      //         recordsFiltered: resp.recordsFiltered,
      //         data: []
      //       });
      //     });
      // },
      columns: [
        {
          title: 'Name',
          data: 'name'
        },
        {
          title: 'Group',
          data: 'groupName'
        },
        null,
        null,
        null,
        null
      ]
    };
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  filterByGroup(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }
  edit(item) {
    console.log(item);
  }

  delete(item) {
    console.log(item);
  }

  reload(dataInput: any) {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  openSupplierInfo(item) {
    this.suppInfo.emit(item);
  }

}
