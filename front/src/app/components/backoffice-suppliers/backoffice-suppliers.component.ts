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
  selector: 'app-backoffice-suppliers',
  templateUrl: './backoffice-suppliers.component.html',
  styleUrls: ['./backoffice-suppliers.component.scss']
})
export class BackofficeSuppliersComponent implements OnInit {
  
  @ViewChild('template') public modal: TemplateRef<any>;
  @ViewChild('usersTable') public usersTableRef: TemplateRef<any>;

  sidebarVisible: Boolean = true;
  subscriptions: Subscription[] = [];
  modalRef: BsModalRef;
  subModalRef: BsModalRef;
  groupSelect: String;
  isLoading: Boolean = false;
  filteredList: Array<any>;
  userToAdd: any = {};
  userToModify: any = {};
  modalState: String;

  focus: any = {
    one: false,
    two: false,
    three: false,
    four: false,
    five: false,
    six: false,
  };

  clientSelected: any;
  supplierSelected: any;
  searching: Boolean = false;
  searchFailed: Boolean = false;

  dataLength: any = 1;
  modalConfig = {
    animated: true,
    class: 'modal-dialog-centered modal-sm'
  };
  itemsDisplay: Array<any> = [];
  items = [];

  itemPluralMapping = {
    'users': {
      '=0': 'Aucun utilisateur',
      '=1': 'utilisateur',
      'other': 'utilisateurs'
    }
  };

  itemPluralCount = {
    'users': {
      '=0': '',
      'other': '#'
    }
  };

  searchClients = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.httpService.get('/api/admin/clients', new HttpParams().set('search', term)).pipe(
          tap(() => this.searchFailed = false),
          map(response => response.body['items']),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    );

  formatter = (x: any) => x.org_name;

  searchSuppliers = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.httpService.get('/api/admin/suppliers', new HttpParams().set('search', term).set('clientID', this.clientSelected ? this.clientSelected.id : 0)).pipe(
          tap(() => this.searchFailed = false),
          map(response => response.body['items']),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    );

  formatter2 = (x: any) => x.denomination;
       
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
        this.userToAdd = {};
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
      this.userToAdd = {};
      this.modalRef = null;
  }

  fillUser(record: any) {
    this.userToAdd.name = record.name;
    this.userToAdd.lastname = record.lastname;
    this.userToAdd.email = record.email;
    this.userToAdd.role = record.role;
    this.openModal(this.modal, 'ModifyUser');
  }



  // TODO: modify this, we only need JWT
  addUser(data: any) {
    console.log('User', data);
    console.log('clientSelected', this.clientSelected);
    console.log('supplierSelected', this.supplierSelected);
    if(this.clientSelected && this.supplierSelected) {
      data.client_id = this.clientSelected.id;
      data.org_id = this.supplierSelected.id;
    }
    this.apiService.postData('/api/admin/suppliers/register', { user: data })
      .subscribe(res => {
          this.hideModal('');
        }, err => {
      })
    ;
  }

}
