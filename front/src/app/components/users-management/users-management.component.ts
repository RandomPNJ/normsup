import { ChangeDetectorRef, Component, OnInit, ViewChild, TemplateRef, ElementRef, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { combineLatest, Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';
import { ProductService } from 'src/app/services/product.service';
import * as moment from 'moment';
import { HttpService } from 'src/app/services/http.service';
import { UsersTableComponent } from './users-table/users-table.component';

declare var require: any;

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss']
})
export class UsersManagementComponent implements OnInit {

  @ViewChild('template') public modal: TemplateRef<any>;
  @ViewChild('usersTable') public usersTableRef: UsersTableComponent;

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
  addInterloc: Boolean = false;
  roles: Array<any> = [
    { name : ' ', value: ' '},
    { name: 'Administrateur', value: 'admin'},
    { name: 'Utilisateur', value: 'user'},
    // { name: 'Invité', value: 'guest'},
  ];

  focus: any = {
    one: false,
    two: false,
    three: false,
    four: false
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
        this.addInterloc = false;
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
    const user = 

    this.apiService.postData('/api/users/register', { user: data })
      .subscribe(res => {
          this.hideModal('');
          this.usersTableRef.reload();
        }, err => {
      })
    ;
  }

}
