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
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  @ViewChild('resetPassword') public resetPasswordRef: TemplateRef<any>;

  formFocus: any = {
    one: false,
    two: false
  };
  modalRef: BsModalRef;
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
    console.log('this.credentials', this.credentials);
    if (this.credentials['username'] !== '' && this.credentials['password'] !== '') {
      this.isLoader = true;
      this.subscription = this.authService.login(this.credentials['username'], this.credentials['password'], this.credentials['cacheConnected'])
        .subscribe((res) => {
          this.isLoader = false;
          if (res['msg'] === 'Wrong password.') {
            this.type = 'error';
            this.message = res['msg'];
            this.title = 'Error';
          } else if(res['data'] === {}) {
            this.type = 'error';
            this.message = res['msg'];
            this.title = 'Error';
          } else {
            this.bsService.setLocalStorage('current_user', JSON.stringify(res['data']));
            this.router.navigate(['/dashboard/main']);
          }
        }, error => {
          console.log('login error', error);
          if(error.error.code) {
            if(error.error.code === 0) {
              this.errMsg = 'Email ou mot de passe erroné.';
            } else if(error.error.code === 1) {
              this.errMsg = 'Email ou mot de passe erroné.';
            } else if(error.error.code === 2) {
              this.errMsg = 'Votre compte n\'a pas été activé.';
            }
          }
          
           else if(error.error.msg === 'Wrong credentials.' || error.error.msg === 'User not found.') {
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
        });
    }
  }

  remove() {
    this.iserror = 'hide';
    this.iserror1 = 'hide';
  }

  resetPasswordFnc(mail) {
    this.authService.resetPassword(mail)
      .subscribe(res => {
        console.log('resetPassword res :', res);
        console.log('resetPassword res :', res.hasOwnProperty('exists'));
        if(res && res.hasOwnProperty('exists') && res['exists'] === false) {
          console.log('here');
          this.resetPwdErrMsg = "L'adresse email spécifiée n'existe pas.";
        }
      }, err => {
        console.error('resetPassword error :', err);
      })
    ;
  }
}
