import { Component, OnInit, ViewChild, Output, EventEmitter, TemplateRef, Input } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { FileUploader } from 'ng2-file-upload';
import { HttpService } from 'src/app/services/http.service';
import { BrowserStorageService } from 'src/app/services/storageService';
import {Configuration} from '../../../config/environment';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-legal-doc-modal',
  templateUrl: './legal-doc-modal.component.html',
  styleUrls: ['./legal-doc-modal.component.scss'],
})
export class LegalDocModalComponent implements OnInit {

  @Output() addDocModal = new EventEmitter<string>();
  @Output() changeType = new EventEmitter<string>();
  @Output() hideModal = new EventEmitter<string>();
  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
  @ViewChild('addDocModal') addModalRef: TemplateRef<any>;
  @Input() docModalID;

  // USELESS ???
  public uploader: FileUploader = new FileUploader({ 
    url: Configuration.serverUrl + '/api/documents/upload', 
    removeAfterUpload: true, 
    autoUpload: false,
    authTokenHeader: 'Authorization',
    authToken: `Bearer ${this.bsService.getLocalStorage('token')}`
  });
  public hasBaseDropZoneOver: Boolean = false;
  public addDocState: Boolean = false;
  private category: String = '';
  private filename = '';
  private fileextension = '';
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
  doc: any;

  itemPluralMappingNum = {
    'documents': {
      '=0': '',
      '=1': '1',
      'other': '#'
    }
  };
  itemPluralMapping = {
    'documents': {
      '=0': 'Aucun Document',
      '=1': 'Document',
      'other': 'Documents'
    }
  };

  constructor(private httpService: HttpService, private bsService: BrowserStorageService) {
    
  }

  ngOnInit() {
    console.log('this.itemsToDisplay',this.itemsToDisplay);
    
    // this.uploader.onAfterAddingFile = (file) => { 
    //   file.withCredentials = false;
    //   //@ts-ignore
    //   this.fileextension = file.some.name.match(/(\.)(?!.*\.)(.)*/)[0];
    //   //@ts-ignore
    //   this.filename = file.some.name.match(/(.*)(\.)(?!.*\.)/)[0].substring(0, file.some.name.match(/(.*)(\.)(?!.*\.)/)[0].length - 1);
    // };
    // this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
    //   form.append('category' , this.category);
    //   form.append('filename' , this.filename + this.fileextension);
    // };
    // this.uploader.uploadAll();
    // this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
    //   if(response){
    //     console.log("response"+JSON.stringify(response));
    //   }
    // }
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
        // dataTablesParameters.company = 'Fakeclient';
        // if(action === 'query') {
          let params = new HttpParams().append('id', this.docModalID).append('type', 'LEGAL');
          that.httpService
            .get('/api/supplier/documents', params)
            .subscribe(resp => {
              that.itemsToDisplay = resp.body['items']

              that.myTable = true;
              console.log('this.itemsToDisplay two',this.itemsToDisplay);
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
    // const data: any = {data: this.addModalRef, type: 'AddDoc'};
    // this.addDocModal.emit(data);
    this.addDocState = true;
  }

  changeModalType() {
    this.changeType.emit();
  }

  uploadFile() {
    this.uploader.uploadAll();
  }
  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  private cleanVariables() {
    this.fileextension = '';
    this.filename = '';
    this.category = '';
    this.uploader.cancelAll();
  }

  private goToDocView() {
    this.cleanVariables();
    this.addDocState = false;
  }

  downloadDocument(item) {
    return this.httpService.getFile('/api/documents/download/'+item.id)
      .subscribe(res => {
        console.log('downloadDocument res', res);
        return this.readFileFromBlob(<Blob>res.body);
      }, err => {
        console.log('[downloadDocument] err', err)
      })
    ;
  }

  readFileFromBlob(blob) {
    if(blob) {
      // reader.readAsDataURL(blob);
      const fileURL = URL.createObjectURL(blob);
      console.log('fileURL', fileURL)
      window.open(fileURL, '_blank');
    }
  }
}
