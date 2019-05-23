import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-supplier-table',
  templateUrl: './supplier-table.component.html',
  styleUrls: ['./supplier-table.component.scss']
})
export class SupplierTableComponent implements OnInit {

  // supplierNmb = 7;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  @Input() itemsToDisplay: Array<any>;
  groupSelect: String;
  dtOptions: DataTables.Settings = {};
  first = true;

  constructor() { }

  ngOnInit() {
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

}
