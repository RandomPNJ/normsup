import { AfterViewInit, EventEmitter, Component, OnInit, ViewChild, Input, Output, ChangeDetectorRef, TemplateRef, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { HttpService } from 'src/app/services/http.service';
// import {Configuration} from '../../../../config/environment.local';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import 'datatables.net';
import { cloneDeep, remove, forEach } from 'lodash';
import { combineLatest, Subscription } from 'rxjs';
import * as moment from 'moment';
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
export class SupplierTableComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
  @ViewChild('confirmationModal') confirmationModal: TemplateRef<any>;
  @Output() infoModal = new EventEmitter<string>();
  @Input() items: Array<any> = [];
  @Output() suppliersData: EventEmitter<number> =   new EventEmitter();
  


  itemsToDisplay: Array<any> = [];
  indexInfo: Number = -1;
  indexInterloc: any;
  infoType: String = 'NONE';
  infoPopup: any;
  toggleModification: Boolean = false;
  interloc: any;
  supplier: any;
  data: Array<any> = [];
  groups: Array<any> = [ 
    { id: '', name: 'Choisir un groupe' }
  ];
  supplierStates: Array<any> = [ 
    { id: '', name: 'Type de fournisseur' },
    { id: 'UPTODATE', name: 'Fournisseur à jour' },
    { id: 'NOTUPTODATE', name: 'Fournisseur non à jour' },
    { id: 'OFFLINE', name: 'Fournisseurs hors ligne' },
  ];
  supplierStateValue: any = '';
  dtElement: DataTableDirective;
  dataTable: any;
  nbOfRows: any;
  firstDraw: Boolean = true;
  tableParams: any = {
    start: 0,
    length: 10,
    search: '',
    group: '',
    state: ''
  };
  dtOptions: DataTables.Settings = {};
  groupSelect: any = '';
  myTable: Boolean = false;
  now: any = new Date();

  countdownConf: any = {
    leftTime: 60,
    notify: 0,
    template: '$!h!:$!m!:$!s!'
  };
  countDowns: any = {};
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
      .get('/api/suppliers/count')
      .subscribe(res => {
        this.nbOfRows = res.body['count'];
        this.suppliersData.emit(res.body['count']);
      })
    ;
    this.httpService
      .get('/api/suppliers/groups')
      .subscribe(res => {
        res.body['items'].forEach(i => {
          i.name = i.name[0].toUpperCase() + i.name.slice(1); 
          this.groups.push(i);
        });
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
      searchDelay: 2500,
      ordering: false,
      info: false,
      searching: true,
      responsive: true,
      serverSide: true,
      stateSave: false,
      // processing: true,
      language: {
          lengthMenu: 'Afficher par _MENU_',
          zeroRecords: 'Aucun résultat trouvé',
          info: 'Page _PAGE_ sur _PAGES_',
          infoEmpty: 'Aucun résultat disponible',
          search: '',
          searchPlaceholder: "Rechercher un fournisseur",
          // infoFiltered: '(filtré sur un total de _MAX_ résultats)',
          paginate: {
              first:      'Premier',
              last:       'Dernier',
              next:       '>',
              previous:   '<'
          },
      },
      ajax: (dataTablesParameters: any, callback: any) => {
        const action = this.compareParams(dataTablesParameters);
        if(action === 'query') {
          that.httpService
            .get('/api/suppliers', this.tableParams)
            .subscribe(resp => {
              // console.log(resp);
              resp.body['items'].forEach(a => {
                if(a.spont_reminder) {
                  a.spont_reminder = new Date(a.spont_reminder);
                  this.countDowns[a.id] = cloneDeep(this.countdownConf);
                  this.countDowns[a.id].leftTime = moment(a.spont_reminder, 'YYYY-MM-DD').diff(moment(), 'seconds');
                }
              });
              console.log('this.countDowns', this.countDowns);
              that.data = that.data.concat(resp.body['items']);
              that.itemsToDisplay = that.data.slice(that.tableParams.start, that.tableParams.start + that.tableParams.length);
              // console.log('length =', that.data);
              that.myTable = true;
              // this.suppliersData.emit(that.data.length);
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

  ngOnDestroy(): void {
    // this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   dtInstance.destroy();
    // });
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
      action = 'redraw';
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
      .get('/api/suppliers/count', firstQParams)
      .subscribe(res => {
        that.nbOfRows = res.body['count'];
        this.suppliersData.emit(res.body['count']);
      })
    ;
  }

  reload() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      this.httpService
        .get('/api/suppliers', this.tableParams)
        .subscribe(resp => {
          console.log(resp);
          this.data = resp.body['items'];
          this.itemsToDisplay = this.data.slice(this.tableParams.start, this.tableParams.start + this.tableParams.length);
          // this.myTable = true;
        });
        this.httpService
          .get('/api/suppliers/count')
          .subscribe(res => {
            this.nbOfRows = res.body['count'];
            this.suppliersData.emit(res.body['count']);
          })
        ;
      dtInstance.ajax.reload();
    });
  }

  filterByGroup(): void {
    if(this.groupSelect.toString() === '') {
      if(this.tableParams.group !== '') {
        this.tableParams.group = '';
        this.reload();
      }
    } else if(this.groupSelect.toString() !== this.tableParams.group) {
      this.tableParams.group = this.groupSelect.toString();
      this.reload();
    }
  }

  filterBySupplierState(): void {
    if(this.supplierStateValue.toString() === '') {
      if(this.tableParams.state !== '') {
        this.tableParams.state = '';
        this.reload();
      }
    } else if(this.supplierStateValue.toString() !== this.tableParams.state) {
      this.tableParams.state = this.supplierStateValue.toString();
      this.reload();
    }
  }


  openSupplierInfo(item, i) {
    this.modifySupplier(false);
    if(this.indexInfo === i && this.infoType === 'SUPPLIER') {
      this.indexInfo = -1;
      this.infoPopup = {};
      this.infoType = 'NONE';
    } else {
      this.infoType = 'SUPPLIER';
      this.infoPopup = item;
      this.indexInfo = i;
    }
  }

  openInterlocInfo(item, i) {
    this.modifyInterloc(false);
    if(this.indexInfo === i && this.infoType === 'INTERLOC') {
      this.indexInfo = -1;
      this.infoPopup = {};
      this.infoType = 'NONE';
    } else {
      this.infoType = 'INTERLOC';
      this.infoPopup = item;
      this.indexInfo = i;
    }
  }

  modifyInterloc(toggle?) {
    if(toggle === false) {
      this.interloc = {};
      this.toggleModification = false;
      return;
    }
    if(this.toggleModification === false) {
      this.interloc = cloneDeep(this.infoPopup);
      this.toggleModification = true;
    } else if(this.toggleModification === true) {
      this.interloc = {};
      this.toggleModification = false;
    }
  }
  modifySupplier(toggle?) {
    if(toggle === false) {
      this.supplier = {};
      this.toggleModification = false;
      return;
    }
    if(this.toggleModification === false) {
      this.supplier = cloneDeep(this.infoPopup);
      this.toggleModification = true;
    } else if(this.toggleModification === true) {
      this.supplier = {};
      this.toggleModification = false;
    }
  }

  confirmSupplierModification() {

  }

  confirmInterlocModification() {
    console.log('this.interloc', this.interloc);
    let data = {
      name: this.interloc.name,
      email: this.interloc.email,
      phonenumber: this.interloc.phonenumber,
      lastname: this.interloc.lastname,
    };
    
    return this.httpService.post('/api/suppliers/modify_representative/' + this.interloc.repres_id, data)
      .subscribe(res => {
        this.notif.success('Interlocuteur modifié avec succès.');
        this.updateLocalData(this.indexInfo);
        
        
        this.toggleModification = false;
        console.log('[confirmInterlocModification] res', res);
      }, err => {
        console.log('[confirmInterlocModification] err', err);
        this.notif.error('Erreur, veuillez réessayer plus tard.');
        this.interloc = {};
        this.toggleModification = false;
      })
    ;
  }

  updateLocalData(i) {
    this.data[i + this.tableParams.start] = cloneDeep(this.interloc);
    this.itemsToDisplay[i] = cloneDeep(this.interloc);
    this.infoPopup.phonenumber = this.interloc.phonenumber;
    this.infoPopup.email = this.interloc.email;
    this.infoPopup.name = this.interloc.name;
    this.infoPopup.lastname = this.interloc.lastname;

    this.interloc = {};
  }

  deleteInterloc() {
    let i = this.indexInterloc;
    return this.httpService.delete('/api/suppliers/representatives/' + this.infoPopup.id + '/delete')
      .subscribe(res => {
        console.log('deleteInterloc res', res);
        this.deleteLocalInterlocInfo(i);
        this.indexInfo = null;
        this.hideModal('');
        this.notif.success('Interlocuteur supprimé.');
      }, err => {
        console.log('deleteInterloc err', err);
        this.indexInfo = null;
        this.notif.error('Erreur lors de la suppression de l\'interlocuteur, veuillez réessayer plus tard.');
      })
    ;
  }

  deleteLocalInterlocInfo(i) {
    delete this.itemsToDisplay[i].name;
    delete this.itemsToDisplay[i].lastname;
    delete this.itemsToDisplay[i].phonenumber;
    delete this.itemsToDisplay[i].repres_id;
    delete this.itemsToDisplay[i].repres_creation;
    delete this.itemsToDisplay[i].repres_added_by;
    delete this.itemsToDisplay[i].repres_client_id;
    delete this.itemsToDisplay[i].createdAt;

    delete this.data[this.tableParams.start + i].name;
    delete this.data[this.tableParams.start + i].lastname;
    delete this.data[this.tableParams.start + i].phonenumber;
    delete this.data[this.tableParams.start + i].repres_id;
    delete this.data[this.tableParams.start + i].repres_creation;
    delete this.data[this.tableParams.start + i].repres_added_by;
    delete this.data[this.tableParams.start + i].repres_client_id;
    delete this.data[this.tableParams.start + i].createdAt;

    this.indexInfo = -1;
    this.infoPopup = {};
    this.infoType = 'NONE';
  }

  deleteSupplier() {
    let supplier = this.infoPopup;
    this.httpService
      .post('/api/suppliers/delete/' + supplier.id)
      .subscribe(res => {
        this.notif.success('Fournisseur supprimé.');
        remove(this.data, (n) => {
          return n.id === supplier.id })
        ;
        this.itemsToDisplay = this.data.slice(this.tableParams.start, this.tableParams.start + this.tableParams.length);
        this.nbOfRows -= 1;
        this.indexInfo = -1;
        this.infoPopup = {};
        this.infoType = 'NONE';
        this.hideModal('');
        this.suppliersData.emit(this.data.length);
      })
    ;
  }

  openModal(template: TemplateRef<any>, modalType: String, index?) {
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
      this.confirmationModalTxt = 'fournisseur';
      this.indexInterloc = index;
    }
    this.modalRef = this.modalService.show(template, config);
  }

  hideModal(type) {
    if(!this.modalRef) {
      return;
    }
    this.confirmationModalTxt = '';
    this.modalService.hide(1);
    this.modalRef = null;
    this.indexInterloc = null;
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

  openAddInterlocModal(item) {
    if(item) {
      const data: any = {data: item, type: 'AddInterloc'};
      this.infoModal.emit(data);
    } else {
      return;
    }
  }

  updateInterlocData(data) {
    forEach(this.data, res => {
      if(res.id === data.supplierID) {
        res['name'] = data.name;
        res['lastname'] = data.lastname;
        res['phonenumber'] = data.phonenumber;
        res['email'] = data.email;
      }
    });
    forEach(this.itemsToDisplay, res => {
      if(res.id === data.supplierID) {
        res['name'] = data.name;
        res['lastname'] = data.lastname;
        res['phonenumber'] = data.phonenumber;
        res['email'] = data.email;
      }
    });
  }
  private sendReminder(id) {
    console.log('sendreminder id', id);
    return this.httpService.post('/api/reminders/supplier/' + id)
      .subscribe(res => {
        console.log('[sendReminder] res', res);
        this.data.map(d => {
          if(d.id === id) {
            d.spont_success = true;
            d.spont_txt = 'Succès';
          }
        });
        this.itemsToDisplay.map(d => {
          if(d.id === id) {
            d.spont_success = true;
            d.spont_txt = 'Succès'
          }
        });
      }, err => {
        console.log('[sendReminder] err', err);
        this.data.map(d => {
          if(d.id === id) {
            d.spont_success = true;
            d.spont_txt = 'Erreur';
          }
        });
        this.itemsToDisplay.map(d => {
          if(d.id === id) {
            d.spont_success = true;
            d.spont_txt = 'Erreur'
          }
        });
      })
    ;
  }

  private countDownEvent(e, item) {
    console.log('countDownEvent', item);
  }
}

