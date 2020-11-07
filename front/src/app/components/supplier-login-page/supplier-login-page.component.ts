import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BrowserStorageService } from 'src/app/services/storageService';
import { ModalComponent } from '../modal/modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, combineLatest } from 'rxjs';
import { Configuration } from '../../config/environment';
import { HttpService } from 'src/app/services/http.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-supplier-login-page',
  templateUrl: './supplier-login-page.component.html',
  styleUrls: ['./supplier-login-page.component.scss']
})
export class SupplierLoginPageComponent implements OnInit, OnDestroy {

  @ViewChild(ModalComponent) appModal: ModalComponent;
  @ViewChild('resetPassword') public resetPasswordRef: TemplateRef<any>;

  formFocus: any = {
    one: false,
    two: false
  };
  credentials = {
    username: '',
    password: '',
    cacheConnected: false
  };
  iserror = 'hide';
  iserror1 = 'hide';
  subscription: Subscription;
  title: any;
  message: any;
  type: any;
  role: any;
  isLoader: Boolean = false;
  show = false;
  errMsg: String;

  subscriptions: Subscription[] = [];
  resetPasswordMail: String = '';
  resetPwdErrMsg: String = '';
  modalConfig = {
    animated: true,
    class: 'modal-dialog-centered'
  };
  searchEmail: String = '';
  modalRef: BsModalRef;

  constructor(private router: Router,
    private bsService: BrowserStorageService,
    private modalService: BsModalService,
    private changeDetection: ChangeDetectorRef,
    private httpService: HttpService,
    public authService: AuthService) { }

  ngOnInit() {
    // this.bsService.clearLocalStorage();
  }
  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  showModal() {
    this.appModal.openLogin(this.type, this.message, this.title);
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
        this.resetPasswordMail = '';
        this.unsubscribe();
      })
    );
    
    const config = cloneDeep(this.modalConfig);
    config.class += ' modal-medium';
    this.modalRef = this.modalService.show(template, config);
  }

  unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  hideModal(type?) {
    if (!this.modalRef) {
      return;
    }
    this.searchEmail = '';
    this.resetPwdErrMsg = '';
    this.resetPasswordMail = '';
    this.modalService.hide(1);
    this.modalRef = null;
  }

  // TODO: change this ugly af function
  validate() {
    if (this.credentials['username'] !== '' && this.credentials['password'] !== '') {
      this.isLoader = true;
      this.subscription = this.authService.loginAsSupplier(this.credentials['username'], this.credentials['password'])
        .subscribe((res) => {
          this.isLoader = false;
          if (res['msg'] === 'Wrong password.') {
            console.log('supplier login one', res);
            this.type = 'error';
            this.message = res['msg'];
            this.title = 'Error';
            this.showModal();
          } else if(res['data'] === {}) {
            console.log('supplier login one', res);
            this.type = 'error';
            this.message = res['msg'];
            this.title = 'Error';
            this.showModal();
          } else {
            console.log('supplier login one', res);
            this.router.navigate(['supplier', 'upload']);
          }
        }, error => {
          console.log('error', error);
          // if(error.error.msg === 'Wrong credentials.' || error.error.msg === 'User not found.') {
          //   this.errMsg = 'Email ou mot de passe erroné.';
          // } else 
          if(error.error.msg === 'Your login credentials are expired, please request a new account.') {
            this.errMsg = 'Identifiants expirés, veuillez en demander de nouveaux.';
          } else {
            this.errMsg = 'Email ou mot de passe erroné.';
          }
          this.isLoader = false;
          this.type = 'error';
          if(error['msg']) {
            this.message = error['msg'];
          } else {
            // this.message = 'An error has occured when trying to log in. Please retry';
            this.message = 'Une erreur s\'est produite, merci de réessayer de vous connecter';
          }
          this.title = 'Error';
          // this.showModal();
        });
    }
  }

  remove() {
    this.iserror = 'hide';
    this.iserror1 = 'hide';
  }

  supplierResetPassword(mail) {
    this.resetPwdErrMsg = '';
    this.authService.supplierResetPassword(mail)
      .subscribe(res => {
        console.log('supplierResetPassword res :', res);
        console.log('supplierResetPassword res :', res.hasOwnProperty('exists'));
        if(res && res.hasOwnProperty('exists') && res['exists'] === false) {
          console.log('here');
          this.resetPwdErrMsg = "L'adresse email spécifiée n'existe pas.";
        } else if(res && res.hasOwnProperty('msg') && res.msg === 'Account not activated') {
          this.resetPwdErrMsg = "Votre compte n'a pas encore été activé.";
        } else {
          this.hideModal();
        }
      }, err => {
        console.error('supplierResetPassword error :', err);
      })
    ;
    
  }

}
