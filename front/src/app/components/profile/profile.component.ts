import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cloneDeep } from 'lodash';
import { BrowserStorageService } from 'src/app/services/storageService';
import { NotifService } from 'src/app/services/notif.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { combineLatest, Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {


  @ViewChild('modifyPassword') public modifyPwdRef: TemplateRef<any>;

  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];
  modalConfig = {
    animated: true,
    class: 'modal-dialog-centered modal-sm'
  };

  token: any;
  loading: Boolean = true;
  id: Number;
  user: any = {
    name: '',
    lastname: '',
    email: '',
    phonenumber: '',
    address: '',
    postalCode: '',
    city: ''
  };
  userInfo: any = {
    name: '',
    lastname: '',
    email: '',
    phonenumber: '',
    address: '',
    postalCode: '',
    city: ''
  };
  formFocus: any = {
    one: false,
    two: false,
    three: false,
    four: false,
    five: false,
    six: false,
    seven: false
  };

  modifyPwdFocus: any = {
    one: false,
    two: false,
    three: false
  };

  modifyPwd: any = {
    lastPwd: '',
    newPwd: '',
    newPwd2: ''
  };
  constructor(
    private apiService: HttpService, 
    private bsService: BrowserStorageService, 
    private changeDetection: ChangeDetectorRef,
    private notifService: NotifService,
    private modalService: BsModalService,) { }

  ngOnInit() {
    this.token = this.bsService.getLocalStorage('token');
    this.id = JSON.parse(this.bsService.getLocalStorage('current_user')).id;
    this.apiService.get('/api/users/current')
      .subscribe(res => {
        this.userInfo = cloneDeep(res.body['items'][0]);
        this.user = cloneDeep(res.body['items'][0]);
        this.loading = false;
      })
    ;
  }


  sendModifications() {
    return this.apiService.put('/api/users/modify/' + this.id, this.userInfo)
      .subscribe(res => {
        this.notifService.success('Utilisateur modifié avec succès.');
        let user = JSON.stringify(this.userInfo);
        this.bsService.setLocalStorage('current_user', user);
      })
    ;
  }

  modifyPasswordFn() {
    this.openModal(this.modifyPwdRef);
  }

  openModal(template: TemplateRef<any>) {
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
    this.modalRef = this.modalService.show(template, config);
  }

  unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  hideModal() {
    if (!this.modalRef) {
      return;
    }
    this.modalService.hide(1);
    this.modalRef = null;
  }
}
