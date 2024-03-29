import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cloneDeep } from 'lodash';
import { BrowserStorageService } from 'src/app/services/storageService';
import { NotifService } from 'src/app/services/notif.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { combineLatest, Subscription, forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { SettingsService } from 'src/app/services/settings.service';

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
  profilePic: any = false;
  defaultBG: any = '/src/assets/img/add-pic.svg';
  urlToImage: any;
  showImg: Boolean = true;

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

  imagePath: any;
  imgURL: any;
  selectedPicture: Boolean = false;
  pictureFile: any;
  pictureObj: any;

  modifyPasswordToggle: Boolean= false;
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
    private bsService: BrowserStorageService, 
    private changeDetection: ChangeDetectorRef,
    private notifService: NotifService,
    private modalService: BsModalService,
    private settingsService: SettingsService) { }

  ngOnInit() {
    this.id = JSON.parse(this.bsService.getLocalStorage('current_user')).id;
    this.apiService.get('/api/users/current')
      .subscribe(res => {
        console.log('userInfo res', res)
        if(res.body['user']) {
          this.userInfo = cloneDeep(res.body['user']);
          this.user = cloneDeep(res.body['user']);
          this.loading = false;
        
        }
      }, err => {
        if(err.code === -1) {
          this.notifService.error('Session expirée. Vous serez redirigé vers la page de connexion.');
          setTimeout(() => {
            this.authService.isLogged.next(false);
            this.router.navigate(['/login']);
            this.bsService.clearLocalStorage();
          }, 2500);
        }
      })
    ;
    // Decomment to get the profile picture
    this.apiService.getPicture('/api/users/picture')
      .subscribe(res => {
        // this.showImg = true;
        // this.urlToImage = '/src/assets/img/add-pic-two.svg';
        return this.createImageFromBlob(<Blob>res.body);
      }, err => {
        // this.showImg = true;
        // this.urlToImage = this.defaultBG;
        return err;
      })
    ;
  }


  sendModifications() {
    let main_form: FormData = new FormData();
    let calls = [];
    if(this.selectedPicture === true && this.pictureObj) {
      console.log('this.pictureFile', this.pictureObj);
      main_form.append('file', this.pictureObj);
      forkJoin(
        this.apiService.put('/api/users/modify/' + this.id, this.userInfo),
        this.apiService.uploadDocument('/api/users/upload', main_form)
      )
        .subscribe(res => {
          console.log('forkjoin res', res);
          this.notifService.success('Utilisateur modifié avec succès.');
          let user = JSON.stringify(this.userInfo);
          this.bsService.setLocalStorage('current_user', user);
          this.settingsService.profileModif.next(this.userInfo);
        }, err => {
          this.notifService.error('Une erreur s\'est produite, veuillez réessayer.');
        })
      ;
    } else {
      return this.apiService.put('/api/users/modify/' + this.id, this.userInfo)
        .subscribe(res => {
          this.notifService.success('Utilisateur modifié avec succès.');
          let user = JSON.stringify(this.userInfo);
          this.bsService.setLocalStorage('current_user', user);
          this.settingsService.profileModif.next(this.userInfo);
        })
      ;
    }
  }

  loadPicture(e) {
    let pic;

    if(e.target && e.target.files && e.target.files['0']) {
      pic = e.target.files['0'];
      var mimeType = pic.type;
      if (mimeType.match(/image\/*/) == null) {
        return this.notifService.error('Merci de sélectionner une image.');
      }

      var reader = new FileReader();
      this.imagePath = pic;
      reader.readAsDataURL(pic); 
      reader.onload = (_event) => { 
        this.imgURL = reader.result; 
      }
      this.selectedPicture = true;
      this.pictureObj = pic;
    }
  }

  deletePicture() {
    this.imagePath = null;
    this.imgURL = null;
    this.pictureFile = '';
    this.selectedPicture = false;
    this.pictureObj = null;
    return;
  }

  modifyPasswordFn() {
    this.modifyPasswordToggle = true;
  }

  toggleOffPassword() {
    this.modifyPwd = {
      lastPwd: '',
      newPwd: '',
      newPwd2: ''
    };
    this.modifyPwdErr1 = '';
    this.modifyPwdErr = '';
    this.modifyPasswordToggle = false;
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
          this.toggleOffPassword();
        }, err => {
          if(err.reason === -1) {
            this.notifService.error('Session expirée. Vous serez redirigé vers la page de connexion.');
            setTimeout(() => {
              this.authService.isLogged.next(false);
              this.router.navigate(['/login']);
              this.bsService.clearLocalStorage();
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

  createImageFromBlob(image: Blob) {
    let reader = new FileReader(); 
    reader.addEventListener("load", () => {
       this.profilePic = reader.result; 
    }, false);
 
    if (image) {
       reader.readAsDataURL(image);
    }
 }
}
