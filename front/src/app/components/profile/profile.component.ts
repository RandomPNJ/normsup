import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cloneDeep } from 'lodash';
import { BrowserStorageService } from 'src/app/services/storageService';
import { NotifService } from 'src/app/services/notif.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { combineLatest, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

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
  modifyPwdErr1: String;
  modifyPwdErr: String;
  constructor(
    private apiService: HttpService,
    private authService: AuthService,
    private router: Router, 
    private bs: BrowserStorageService,
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
      }, err => {
        if(err.code === -1) {
          this.notifService.error('Session expirée. Vous serez redirigé vers la page de connexion.');
          setTimeout(() => {
            this.authService.isLogged.next(false);
            this.router.navigate(['/login']);
            this.bs.clearLocalStorage();
          }, 2500);
        }
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

  modifyPwFinal() {
    let regexp = /[!@#$%^&*(),.?":{}|<>]/;
    if(this.modifyPwd.newPwd.match(regexp) !== null) {
      console.log('lastpwd',this.modifyPwd.lastPwd);
      const data = {
        newpassword: this.modifyPwd.newPwd,
        password: this.modifyPwd.lastPwd
      };
      console.log('data', data);
      return this.apiService.post('/api/users/modify/' + this.id + '/modify_password', data)
        .subscribe(res => {
          this.notifService.success('Mot de passe modifié avec succès.');
          this.hideModal();
        }, err => {
          if(err.reason === -1) {
            this.notifService.error('Session expirée. Vous serez redirigé vers la page de connexion.');
            setTimeout(() => {
              this.authService.isLogged.next(false);
              this.router.navigate(['/login']);
              this.bs.clearLocalStorage();
            }, 2500);
          } else if(err.msg === 'Wrong credentials.') {
            this.modifyPwdErr = 'Mot de passe renseigné invalide.';
          }

        })
      ;
    } else {
      this.modifyPwdErr1 = 'Nouveau mot de passe doit contenir au moins un charactère spécial.'
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
    this.modifyPwd = {
      lastPwd: '',
      newPwd: '',
      newPwd2: ''
    };
    this.modifyPwdErr1 = '';
    this.modifyPwdErr = '';
    this.modalRef = null;
  }
}
