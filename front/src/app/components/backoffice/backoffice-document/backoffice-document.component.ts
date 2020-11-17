import { ChangeDetectorRef, Component, OnInit, ViewChild, TemplateRef, ElementRef, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { combineLatest, Subscription, Observable, of } from 'rxjs';
import { find, filter, remove, cloneDeep } from 'lodash';
import { ProductService } from 'src/app/services/product.service';
import * as moment from 'moment';
import { HttpService } from 'src/app/services/http.service';
import { debounceTime, distinctUntilChanged, tap, switchMap, map, catchError } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
declare var require: any;

@Component({
  selector: 'app-backoffice-document',
  templateUrl: './backoffice-document.component.html',
  styleUrls: ['./backoffice-document.component.scss']
})
export class BackofficeDocumentComponent implements OnInit {

  @ViewChild('template') public modal: TemplateRef<any>;
  @ViewChild('usersTable') public usersTableRef: TemplateRef<any>;

  sidebarVisible: Boolean = true;
  subscriptions: Subscription[] = [];
  modalRef: BsModalRef;
  subModalRef: BsModalRef;
  groupSelect: String;
  isLoading: Boolean = false;
  filteredList: Array<any>;
  clientToAdd: any = {};
  clientToModify: any = {};
  modalState: String;

  focus: any = {
    one: false,
    two: false,
    three: false,
    four: false,
    five: false,
    six: false,
  };

  dataLength: any = 1;
  modalConfig = {
    animated: true,
    class: 'modal-dialog-centered modal-sm'
  };
  itemsDisplay: Array<any> = [];
  items = [];

  itemPluralMapping = {
    'users': {
      '=0': 'Aucun document',
      '=1': 'document',
      'other': 'documents'
    }
  };

  itemPluralCount = {
    'users': {
      '=0': '',
      'other': '#'
    }
  };


  constructor(
    private modalService: BsModalService,
    private apiService: ProductService,
    private changeDetection: ChangeDetectorRef,
    private httpService: HttpService) {
  }

  ngOnInit() {
  }

  openModal(template: TemplateRef<any>, type: any) {
    const _combine = combineLatest(
      this.modalService.onShow,
      this.modalService.onShown,
      this.modalService.onHide,
      this.modalService.onHidden
    ).subscribe(() => this.changeDetection.markForCheck());

    this.subscriptions.push(
      this.modalService.onHidden.subscribe(() => {
        this.modalState = 'addUser';
        this.clientToAdd = {};
        this.unsubscribe();
      })
    );
    this.modalState = type;

    const config = cloneDeep(this.modalConfig);
    this.subscriptions.push(_combine);
    // if(modalType !== 'Supplier' && modalType !== 'AddDoc') {
    //   config.class += ' modal-lg';
    // }
    this.modalRef = this.modalService.show(template, config);

  }

  unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  hideModal(type) {
    console.log('type ===', type);
    if (!this.modalRef) {
      return;
    }
    this.modalService.hide(1);
    this.modalState = 'addUser';
    this.clientToAdd = {};
    this.modalRef = null;
  }

  fillUser(record: any) {
    this.clientToAdd.name = record.name;
    this.clientToAdd.lastname = record.lastname;
    this.clientToAdd.email = record.email;
    this.clientToAdd.role = record.role;
    this.openModal(this.modal, 'ModifyUser');
  }



  // TODO: modify this, we only need JWT
  addClient(data: any) {
    console.log('Client Data : ', data);

    this.apiService.postData('/api/admin/clients/register', { client: data })
      .subscribe(res => {
        this.hideModal('');
      }, err => {
        console.log('addClient error : ', err)
      })
    ;
  }

}
