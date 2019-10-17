import { Component, OnInit, ViewChild, Output, EventEmitter, TemplateRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { FileUploader } from 'ng2-file-upload';
import { HttpService } from 'src/app/services/http.service';
import { BrowserStorageService } from 'src/app/services/storageService';

@Component({
  selector: 'app-legal-doc-modal',
  templateUrl: './legal-doc-modal.component.html',
  styleUrls: ['./legal-doc-modal.component.scss'],
})
export class LegalDocModalComponent implements OnInit {

  @Output() addDocModal = new EventEmitter<string>();
  @Output() hideModal = new EventEmitter<string>();
  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
  @ViewChild('addDocModal') addModalRef: TemplateRef<any>;

  public uploader: FileUploader = new FileUploader({ 
    url: 'http://localhost:8080/api/documents/upload', 
    removeAfterUpload: true, 
    autoUpload: true,
    itemAlias: 'fileLegal',
    authTokenHeader: 'Authorization',
    authToken: `Bearer ${this.bsService.getLocalStorage('token')}`
  });
  public hasBaseDropZoneOver: Boolean = false;
  private category: String = 'test';
  itemsToDisplay: Array<any> = [];
  data: Array<any> = [];
  dtElement: DataTableDirective;
  dataTable: any;
  currentState: String = 'false';
  hideFirst = 0;
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

  constructor(private httpService: HttpService, private bsService: BrowserStorageService) {
    
  }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false;};
    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('category' , this.category);
    };
    this.uploader.uploadAll();
    this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
      if(response){
        console.log("response"+JSON.stringify(response));
      }
    }
    const that = this;
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
            .get('/api/documents', dataTablesParameters)
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

  addDoc() {
    const data: any = {data: this.addModalRef, type: 'AddDoc'};
    this.addDocModal.emit(data);
  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
}
