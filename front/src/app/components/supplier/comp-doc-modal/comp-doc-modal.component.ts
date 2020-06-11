import { Component, OnInit, ViewChild, Output, EventEmitter, TemplateRef, ElementRef, Input } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { FileUploader } from 'ng2-file-upload';
import { HttpService } from 'src/app/services/http.service';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-comp-doc-modal',
  templateUrl: './comp-doc-modal.component.html',
  styleUrls: ['./comp-doc-modal.component.scss'],
})
export class CompDocModalComponent implements OnInit {

  @Output() addDocModal = new EventEmitter<string>();
  @Output() changeType = new EventEmitter<string>();
  @Output() hideModal = new EventEmitter<string>();
  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
  @ViewChild('addDocModal') addModalRef: TemplateRef<any>;
  @ViewChild('labelImport') labelImport: ElementRef;
  @Input() docModalID;


  formImport: FormGroup;
  public uploader: FileUploader = new FileUploader(
    { url: 'http://localhost:8080/api/document/upload', removeAfterUpload: true, autoUpload: false });
  public hasBaseDropZoneOver: Boolean = false;
  itemsToDisplay: Array<any> = [];
  data: Array<any> = [];
  dtElement: DataTableDirective;
  dataTable: any;
  currentState: String = 'false';
  hideFirst = 0;
  fileToUpload1: any = "";
  tableParams: any = {
    start: 0,
    length: 9
  };
  dtOptions: DataTables.Settings = {};
  myTable: Boolean = false;
  addCompDoc: Boolean = false;
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

  constructor(private httpService: HttpService) { 
  //   this.formImport = new FormGroup({
  //     importFile: new FormControl('', Validators.required)
  //  });
  }

  ngOnInit() {
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
        let params = new HttpParams().append('id', this.docModalID).append('type', 'COMP');
          that.httpService
            .get('/api/supplier/documents', params)
            .subscribe(resp => {
              console.log(resp);
              that.itemsToDisplay = resp.body['items']
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

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  changeModalType() {
    console.log('comp doc changemodaltype')
    this.changeType.emit();
  }

  handleFileInput(event: any) {
    console.log('event ===', event[0]);
    // this.fileToUpload1 = event[0];
    this.labelImport.nativeElement.innerText = Array.from(event)
      .map(f => f['name'])
      .join(', ')
    ;
    this.fileToUpload1 = event.item(0);
  }

  downloadDocument(item) {
    return this.httpService.get('/api/documents/download/'+item.id)
      .subscribe(res => {
        console.log('downloadDocument res', res)
      }, err => {

      })
    ;
  }
}
