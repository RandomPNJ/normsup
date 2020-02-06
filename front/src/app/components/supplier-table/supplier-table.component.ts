import { AfterViewInit, EventEmitter, Component, OnInit, ViewChild, Input, Output, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { HttpService } from 'src/app/services/http.service';
// import {Configuration} from '../../../../config/environment.local';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import 'datatables.net';
import { cloneDeep } from 'lodash';
import { combineLatest, Subscription } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { NotifService } from 'src/app/services/notif.service';
import { Router } from '@angular/router';
import { BrowserStorageService } from 'src/app/services/storageService';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-supplier-table',
  templateUrl: './supplier-table.component.html',
  styleUrls: ['./supplier-table.component.scss']
})
export class SupplierTableComponent implements OnInit,AfterViewInit {

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
  @ViewChild('confirmationModal') confirmationModal: TemplateRef<any>;
  @Output() infoModal = new EventEmitter<string>();
  @Input() items: Array<any> = [];
  @Output() suppliersData: EventEmitter<number> =   new EventEmitter();


  itemsToDisplay: Array<any> = [];
  indexInfo: Number = -1;
  infoType: String = '';
  infoPopup: any;
  toggleModification: Boolean = false;
  interloc: any;
  supplier: any;
  data: Array<any> = [];
  groups: Array<any> = [ 
    { id: '', name: 'Veuillez choisir un groupe' },
    { id: '1', name: '' }];
  dtElement: DataTableDirective;
  dataTable: any;
  nbOfRows: any;
  firstDraw: Boolean = true;
  tableParams: any = {
    start: 0,
    length: 10,
    search: '',
    group: '',
  };
  dtOptions: DataTables.Settings = {};
  groupSelect: String = '';
  myTable: Boolean = false;

  // Modal variables
  modalRef: BsModalRef;
  modalConfig = {
    animated: true,
    class: 'modal-dialog-centered modal-sm'
  };
  subscriptions: Subscription[] = [];
  confirmationModalTxt: String;

  constructor(
    private httpService: HttpService, 
    private notif: NotifService, 
    private router: Router, 
    private bs: BrowserStorageService,
    private authService: AuthService,
    private changeDetection: ChangeDetectorRef,
    private modalService: BsModalService,) { }

  ngOnInit() {
    // First query to get the number of rows
    this.httpService
      .get('/api/supplier/count')
      .subscribe(res => {
        this.nbOfRows = res.body['count'];
      })
    ;
    this.httpService
      .get('/api/supplier/groups')
      .subscribe(res => {
        this.groups = this.groups.concat(res.body['items']);
      }, err => {
        if(err.message === 'Unexpected error : Failed to authenticate token. (jwt expired)') {
          this.notif.error('Session expirée. Vous serez redirigé vers la page de connexion.');
          setTimeout(() => {
            this.authService.isLogged.next(false);
            this.router.navigate(['/login']);
            this.bs.clearLocalStorage();
          }, 2500);
        }
      })
    ;
    const that = this;
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
      lengthMenu: [[10, 25, 50], [10, 25, 50]],
      searchDelay: 4500,
      ordering: false,
      searching: true,
      responsive: true,
      serverSide: true,
      stateSave: true,
      // processing: true,
      language: {
          lengthMenu: 'Afficher par _MENU_',
          zeroRecords: 'Aucun résultat trouvé',
          info: 'Page _PAGE_ sur _PAGES_',
          infoEmpty: 'Aucun résultat disponible',
          search: '',
          searchPlaceholder: "Rechercher un fournisseur",
          infoFiltered: '(filtré sur un total de _MAX_ résultats)',
          paginate: {
              first:      'Premier',
              last:       'Dernier',
              next:       '>',
              previous:   '<'
          },
      },
      ajax: (dataTablesParameters: any, callback: any) => {
        const action = this.compareParams(dataTablesParameters);
        // that.tableParams = dataTablesParameters;
        // if()
        console.log('tableParams', this.tableParams);
        this.tableParams.company = 'Fakeclient';
        if(action === 'query') {
          that.httpService
            .get('/api/supplier', this.tableParams)
            .subscribe(resp => {
              // console.log(resp);
              that.data = that.data.concat(resp.body['items']);
              that.itemsToDisplay = that.data.slice(that.tableParams.start, that.tableParams.start + that.tableParams.length);
              // console.log('length =', that.data);
              that.myTable = true;
              this.suppliersData.emit(that.data.length);
              callback({
                recordsTotal: that.nbOfRows, // grand total avant filtre
                recordsFiltered: that.nbOfRows, // Nb d'onglet pagination
                data: []
              });
            });
        } else if(action === 'redraw') {
          that.itemsToDisplay = that.data.slice(that.tableParams.start, that.tableParams.start + that.tableParams.length);
          callback({
            recordsTotal: that.nbOfRows, // grand total avant filtre
            recordsFiltered: that.nbOfRows, // Nb d'onglet pagination
            data: []
          });
        }
      },
      preDrawCallback: function(settings) {
      },
      columns: [
        {
          title: 'Fournisseur',
          // data: 'denomination',
          searchable: true
        },
        {
          title: 'Interlocuteur',
          // data: 'denomination',
          searchable: true
        },
        {
          title: 'Localisation',
          // data: 'denomination',
          searchable: true
        },
        {
          title: 'Statut des documents',
          // data: 'denomination',
          searchable: true
        },
        {
          title: 'Actions',
          // data: 'denomination',
          searchable: true
        }
      ]
    };
  }

  ngAfterViewInit(): void {
   
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
      if(this.data.length <= datatableParams.start) {
        action = 'query';
      } else {
        action = 'redraw';
      }
    }
    if(this.tableParams.search !== datatableParams.search.value) {
      this.data.length = 0;
      this.tableParams.search = datatableParams.search.value;
      this.recount(this.tableParams.search);
      action = 'query';
    }
    if(this.tableParams.length !== datatableParams.length) {
      this.tableParams.length = datatableParams.length;
      action = 'query';
    }
    return action;

  }

  recount(search?: string) {
    const that = this;
    let firstQParams = new HttpParams();
    if(search) {
      firstQParams = firstQParams.set('search', search);
    }
    return this.httpService
      .get('/api/supplier/count', firstQParams)
      .subscribe(res => {
        that.nbOfRows = res.body['count'];
      })
    ;
  }

  filterByGroup(): void {
    // console.log(this.dtElement);
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }
  edit(item) {
  }

  delete(item) {
    console.log(item);
  }

  // reload(dataInput?: any) {
  //   this.myTable = true;
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     // Destroy the table first
  //     dtInstance.destroy();
  //     // Call the dtTrigger to rerender again
  //     this.dtTrigger.next();
  //   });
  // }

  openSupplierInfo(item, i) {
    this.modifySupplier(false);
    if(this.indexInfo === i && this.infoType === 'SUPPLIER') {
      this.indexInfo = -1;
      this.infoPopup = {};
    } else {
      this.infoType = 'SUPPLIER';
      this.infoPopup = item;
      this.indexInfo = i;
    }
    console.log('toggleModification = ', this.toggleModification);
  }

  openInterlocInfo(item, i) {
    this.modifyInterloc(false);
    console.log('i =', i);
    if(this.indexInfo === i && this.infoType === 'INTERLOC') {
      this.indexInfo = -1;
      this.infoPopup = {};
    } else {
      this.infoType = 'INTERLOC';
      this.infoPopup = item;
      this.indexInfo = i;
    }
    console.log('toggleModification = ', this.toggleModification);
  }

  modifyInterloc(toggle?) {
    if(toggle === false) {
      this.interloc = {};
      this.toggleModification = false;
      return;
    }
    if(this.toggleModification === false) {
      this.interloc = this.infoPopup;
      this.toggleModification = true;
    } else if(this.toggleModification === true) {
      this.interloc = {};
      this.toggleModification = false;
    }
    console.log('toggleModification = ', this.toggleModification);
  }
  modifySupplier(toggle?) {
    if(toggle === false) {
      this.supplier = {};
      this.toggleModification = false;
      return;
    }
    if(this.toggleModification === false) {
      this.supplier = this.infoPopup;
      this.toggleModification = true;
    } else if(this.toggleModification === true) {
      this.supplier = {};
      this.toggleModification = false;
    }
    console.log('toggleModification = ', this.toggleModification);
  }

  confirmSupplierModification() {

  }

  confirmInterlocModification() {

  }

  deleteInterloc() {
    
  }

  deleteSupplier() {
    
  }
  openModal(template: TemplateRef<any>, modalType: String) {
    const _combine = combineLatest(
      this.modalService.onShow,
      this.modalService.onShown,
      this.modalService.onHide,
      this.modalService.onHidden
    ).subscribe(() => this.changeDetection.markForCheck());

    this.subscriptions.push(
      this.modalService.onHidden.subscribe(() => {
        this.unsubscribe();
      })
    );
    
    const config = cloneDeep(this.modalConfig);
    this.subscriptions.push(_combine);

    if(modalType === 'INTERLOC') {
      this.confirmationModalTxt = 'l\'interlocuteur';
    } else if(modalType === 'SUPPLIER') {
      this.confirmationModalTxt = 'le fournisseur';
    }
    this.modalRef = this.modalService.show(template, config);
  }

  hideModal(type) {
    console.log('type ===', type);
    if (!this.modalRef) {
      return;
    }
    this.confirmationModalTxt = '';
    this.modalService.hide(1);
    this.modalRef = null;
  }

  unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  openLegalDocModal(item) {
    if(item) {
      const data: any = {data: item, type: 'Legaldoc'};
      this.infoModal.emit(data);
    } else {
      return;
    }
  }

  openCompDocModal(item) {
    if(item) {
      // console.log(item);
      const data: any = {data: item, type: 'Compdoc'};
      this.infoModal.emit(data);
    } else {
      return;
    }
  }
}
