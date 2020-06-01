import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BrowserStorageService } from 'src/app/services/storageService';
import { ModalComponent } from '../modal/modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { Configuration } from '../../config/environment';
import { HttpService } from 'src/app/services/http.service';


@Component({
  selector: 'app-supplier-login-page',
  templateUrl: './supplier-login-page.component.html',
  styleUrls: ['./supplier-login-page.component.scss']
})
export class SupplierLoginPageComponent implements OnInit, OnDestroy {

  @ViewChild(ModalComponent) appModal: ModalComponent;

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
  constructor(private router: Router,
    private bsService: BrowserStorageService,
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

  // TODO: change this ugly af function
  validate() {
    if (this.credentials['username'] !== '' && this.credentials['password'] !== '') {
      this.isLoader = true;
      this.subscription = this.authService.loginAsSupplier(this.credentials['username'], this.credentials['password'])
        .subscribe((res) => {
          this.isLoader = false;
          if (res['msg'] === 'Wrong password.') {
            this.type = 'error';
            this.message = res['msg'];
            this.title = 'Error';
            this.showModal();
          } else if(res['data'] === {}) {
            this.type = 'error';
            this.message = res['msg'];
            this.title = 'Error';
            this.showModal();
          } else {
            this.router.navigate(['supplier', 'upload']);
          }
        }, error => {
          console.log('error', error);
          if(error.error.msg === 'Wrong credentials.' || error.error.msg === 'User not found.') {
            this.errMsg = 'Email ou mot de passe erroné.';
          } else if(error.error.msg === 'Your login credentials are expired, please request a new account.') {
            this.errMsg = 'Identifiants expirés, veuillez en demander de nouveaux.';
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
          this.showModal();
        });
    }
  }

  remove() {
    this.iserror = 'hide';
    this.iserror1 = 'hide';
  }

}
