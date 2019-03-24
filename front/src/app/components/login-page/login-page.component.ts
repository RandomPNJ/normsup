import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BrowserStorageService } from 'src/app/services/storageService';
import { ModalComponent } from '../modal/modal.component';
import { ProductService } from 'src/app/services/product.service';
import { HttpService } from '../../services/http.service';
import { Configuration } from '../../config/environment';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  @ViewChild(ModalComponent) appModal: ModalComponent;

  credentials = {};
  iserror = 'hide';
  iserror1 = 'hide';
  title: any;
  message: any;
  type: any;
  role: any;
  isLoader: Boolean = false;
  show = false;
  constructor(private router: Router,
    private bsService: BrowserStorageService,
    public productService: ProductService,
    private httpService: HttpService) { }

  ngOnInit() {
    this.bsService.clearLocalStorage();
  }
  showModal() {
    this.appModal.openLogin(this.type, this.message, this.title);
  }

  validate(user, pwd) {
    this.isLoader = true;
    const username = user;
    const password = pwd;
    if (this.credentials['username'] === '' && this.credentials['password'] === '') {
      console.log('Here');
      this.iserror = '';
      this.iserror1 = '';
      this.isLoader = false;
    } else if (this.credentials['username'] === '') {
      this.iserror = '';
      this.isLoader = false;
    } else if (this.credentials['password'] === '') {
      this.iserror1 = '';
      this.isLoader = false;
    } else {
      const data = {
        userName: user,
        password: pwd
      };
      const url = '/api/auth/login';
      this.productService.postLoginData(url, data)
        .subscribe((res) => {
          this.isLoader = false;
          let response: any;
          response = res;
          if (response.data === 'Wrong password.') {
            this.type = 'error';
            this.message = response.data;
            this.title = 'Error';
            this.showModal();
          } else if (response.attachedObj === null) {
            this.type = 'error';
            this.message = response.errorMsg;
            this.title = 'Error';
            this.showModal();
          } else {
            this.bsService.setLocalStorage('current_user', response.user);
            this.bsService.setLocalStorage('token', response.token);
            console.log(this.bsService.getLocalStorage('current_user'));
            this.router.navigate(['search']);
          }
        }, error => {
          this.isLoader = false;
        });
    }
  }

  remove() {
    this.iserror = 'hide';
    this.iserror1 = 'hide';
  }

}
